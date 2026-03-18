import React from 'react';

export default function SelectField({ label, value, onChange, options = [], required = false, error, name }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-heading text-[13px] text-[var(--text-secondary)] font-[500]">
          {label}
          {required ? <span className="text-[var(--alert-green)]"> *</span> : null}
        </label>
      )}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={[
            'w-full h-[48px] px-4 border-[1.5px] rounded-[var(--radius-sm)] font-body text-[15px] outline-none appearance-none transition-shadow',
            'focus:border-[var(--compliance-blue)] focus:shadow-[0_0_0_3px_rgba(26,76,124,0.12)]',
            error ? 'border-[#E53935]' : 'border-[var(--border)]',
          ].join(' ')}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {error && <div className="text-[#E53935] text-[13px]">{error}</div>}
    </div>
  );
}

