import React from 'react';

export function getInitialsAvatar(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const first = parts[0]?.[0] || '';
  const second = parts[1]?.[0] || '';
  const initials = (first + second).toUpperCase();

  return (
    <div
      className="w-full h-full flex items-center justify-center rounded-[var(--radius-md)] bg-[linear-gradient(135deg,var(--compliance-blue)_0%,var(--compliance-blue-light)_55%,rgba(0,168,107,0.18)_100%)] text-white font-heading font-[700] tracking-[0.02em]"
      style={{ letterSpacing: '-0.02em' }}
      aria-hidden="true"
    >
      <span className="text-[16px]">{initials || '??'}</span>
    </div>
  );
}

