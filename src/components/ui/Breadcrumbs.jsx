import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items = [] }) {
  return (
    <div className="mb-6 font-body text-[13px] text-[var(--text-muted)] flex flex-wrap items-center gap-2">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            {idx !== 0 && <span className="text-[var(--text-ghost)]">/</span>}
            {isLast ? (
              <span className="text-[var(--text-primary)]">{item.label}</span>
            ) : (
              <Link className="hover:text-[var(--compliance-blue)] transition-colors" to={item.to}>
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

