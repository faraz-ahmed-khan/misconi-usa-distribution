import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  variant = 'overlay',
  isOpen = false,
  onClose,
  placeholder = 'Search suppliers...',
  onSubmit,
  initialValue = '',
}) {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuery(initialValue);
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(t);
  }, [isOpen, initialValue]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (variant === 'inline') {
    // Inline variant will be fully utilized on the Directory page.
    // For now we implement the exact styling shell.
    return (
      <div className="flex items-center gap-3 h-[52px] border-[1.5px] border-[var(--border)] rounded-[var(--radius-md)] px-4 bg-white">
        <Search size={18} className="text-[var(--text-muted)]" aria-hidden="true" />
        <input
          className="w-full bg-transparent outline-none text-[15px] font-body placeholder:text-[var(--text-muted)]"
          placeholder="Search suppliers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className="h-[34px] px-3 rounded-[var(--radius-sm)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-colors"
          aria-label="Open filters"
        >
          Filters
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] bg-[rgba(8,30,52,0.95)] backdrop-blur-[20px] flex"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto max-w-[1280px] px-6 md:px-12 w-full pt-[120px] pb-24">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  className="w-full bg-transparent border-b border-white/20 pb-6 text-white font-heading text-[24px] leading-[1.2] outline-none placeholder:text-white/40"
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSubmit?.(query);
                  }}
                />
              </div>
              <button
                type="button"
                className="shrink-0 h-[44px] w-[44px] rounded-full border border-white/20 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/40 transition-colors"
                onClick={() => onClose?.()}
                aria-label="Close search"
              >
                <X size={20} className="mx-auto" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

