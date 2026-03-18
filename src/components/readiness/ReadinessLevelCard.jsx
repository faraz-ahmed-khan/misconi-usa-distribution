import React from 'react';

const pillByLevel = {
  'LEVEL_1': { bg: 'rgba(158,158,158,0.12)', border: 'rgba(158,158,158,0.25)', color: '#9E9E9E' },
  'LEVEL_2': { bg: 'rgba(33,150,243,0.12)', border: 'rgba(33,150,243,0.25)', color: '#2196F3' },
  'LEVEL_3': { bg: 'rgba(0,200,83,0.12)', border: 'rgba(0,200,83,0.25)', color: '#00C853' },
};

export default function ReadinessLevelCard({
  level,
  levelNumber,
  title,
  description,
  color,
}) {
  const cfg = pillByLevel[level] || pillByLevel.LEVEL_1;

  return (
    <div
      className="relative bg-white border border-[var(--border)] rounded-[var(--radius-lg)] px-7 py-7 overflow-hidden"
      style={{ borderLeftWidth: 4, borderLeftStyle: 'solid', borderLeftColor: color }}
    >
      <div
        className="absolute top-[-8px] right-6 font-display text-[72px] font-[500] opacity-10"
        style={{ color }}
        aria-hidden="true"
      >
        {levelNumber}
      </div>

      <div className="flex items-center justify-between gap-4 relative">
        <div className="inline-flex items-center gap-3">
          <div
            className="inline-flex items-center gap-2 rounded-[var(--radius-full)] px-3 py-1 border"
            style={{ backgroundColor: cfg.bg, borderColor: cfg.border, color: cfg.color }}
          >
            <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: cfg.color }} aria-hidden="true" />
            <span className="font-heading text-[10px] tracking-[0.12em] uppercase">{levelNumber}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 font-heading font-[700] text-[18px] text-[var(--text-primary)]">{title}</div>
      <div className="mt-3 font-body text-[15px] leading-[1.6] text-[var(--text-secondary)]">{description}</div>

      <div className="mt-7 flex items-center gap-2">
        <span className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      </div>
    </div>
  );
}

