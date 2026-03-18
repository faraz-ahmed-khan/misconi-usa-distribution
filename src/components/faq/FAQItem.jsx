import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

export default function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border-b border-[var(--border-light)]">
      <button
        type="button"
        className="w-full text-left flex items-center justify-between gap-6 py-5"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-heading text-[16px] font-[600] text-[var(--text-primary)]">
          {q}
        </span>
        <span
          className="shrink-0 font-heading text-[16px] font-[700] text-[var(--compliance-blue)]"
          aria-hidden="true"
        >
          {isOpen ? 'X' : '+'}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pb-5 pr-2 font-body text-[15px] leading-[1.7] text-[var(--text-secondary)]">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

