import React from 'react';

export default function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  name,
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-heading text-[13px] text-[var(--text-secondary)] font-[500]">
          {label}
          {required ? <span className="text-[var(--alert-green)]"> *</span> : null}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={[
          'min-h-[140px] px-4 pt-3 border-[1.5px] rounded-[var(--radius-sm)] font-body text-[15px] outline-none resize-y transition-shadow',
          'focus:border-[var(--compliance-blue)] focus:shadow-[0_0_0_3px_rgba(26,76,124,0.12)]',
          error ? 'border-[#E53935]' : 'border-[var(--border)]',
        ].join(' ')}
      />
      {error && <div className="text-[#E53935] text-[13px]">{error}</div>}
    </div>
  );
}

