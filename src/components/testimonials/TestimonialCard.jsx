import React from 'react';

export default function TestimonialCard({ quote, name, role, company }) {
  return (
    <div className="relative bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] backdrop-blur-[12px] rounded-[var(--radius-lg)] p-8 overflow-hidden">
      <div
        className="absolute top-[-10px] left-[-8px] font-display text-[100px] text-white/10"
        aria-hidden="true"
      >
        "
      </div>
      <div
        className="font-display italic text-[22px] leading-[1.5] text-[rgba(255,255,255,0.90)] relative z-10"
      >
        {quote}
      </div>

      <div className="mt-8 relative z-10">
        <div className="font-heading text-[14px] font-[700] text-white">{name}</div>
        <div className="mt-1 font-body text-[13px] text-[rgba(255,255,255,0.55)]">
          {role}, <span className="text-[var(--alert-green)] font-[500]">{company}</span>
        </div>
      </div>
    </div>
  );
}

