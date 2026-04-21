import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import CategoryIcon from './CategoryIcon.jsx';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CategoryCard({
  categoryId,
  name,
  description,
  iconUrl,
  supplierCount,
}) {
  const descriptionStyle = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  return (
    <motion.div
      whileHover={{
        y: -4,
        borderColor: 'var(--compliance-blue)',
        boxShadow: 'var(--shadow-md)',
      }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cx(
        'bg-white border rounded-[var(--radius-lg)] p-[32px_28px] border-[var(--border)] shadow-sm transition-colors'
      )}
      style={{ transition: 'all 0.30s var(--ease)' }}
    >
      <Link href={`/categories/${categoryId}`} className="block h-full">
        <div className="flex items-start gap-4">
          <div className="w-[48px] h-[48px] rounded-[var(--radius-md)] bg-[var(--off-white-2)] flex items-center justify-center flex-shrink-0">
            <div className="text-[var(--compliance-blue)]">
              <CategoryIcon iconKey={iconUrl} />
            </div>
          </div>
          <div className="min-w-0">
            <div className="font-heading font-[700] text-[18px] text-[var(--text-primary)]">{name}</div>
            <p className="mt-2 font-body text-[14px] text-[var(--text-muted)]" style={descriptionStyle}>
              {description}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-[var(--border-light)] flex items-center justify-between">
          <div className="font-heading text-[14px] font-[600] text-[var(--compliance-blue)] flex items-center gap-2">
            <span>{supplierCount} Suppliers</span>
            <span aria-hidden="true" className="text-[var(--compliance-blue)]">
              <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

