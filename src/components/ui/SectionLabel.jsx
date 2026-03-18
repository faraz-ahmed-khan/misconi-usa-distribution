import React from 'react';

export default function SectionLabel({ text, light = false }) {
  return (
    <div className="flex items-center gap-[10px]">
      <div
        className="h-[2px] w-[28px] rounded-[var(--radius-xs)]"
        style={{ backgroundColor: light ? 'var(--alert-green)' : 'var(--compliance-blue)' }}
        aria-hidden="true"
      />
      <div
        className="font-heading text-[11px] tracking-[0.18em] uppercase"
        style={{ color: light ? 'var(--alert-green)' : 'var(--compliance-blue)' }}
      >
        {text}
      </div>
    </div>
  );
}

