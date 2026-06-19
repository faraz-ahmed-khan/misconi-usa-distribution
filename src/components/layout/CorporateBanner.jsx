import React from 'react';

/**
 * Misconi USA Distribution corporate identity banner.
 * Lane: Procurement and warehousing readiness.
 * Tagline: Procurement • Distribution • Warehousing • Logistics
 */
export default function CorporateBanner({ variant = 'full', className = '' }) {
  if (variant === 'hero') {
    return (
      <div className={`inline-block rounded-[var(--radius-md)] overflow-hidden shadow-[var(--shadow-md)] ${className}`}>
        <img
          src="/images/distribution-banner.png"
          alt="Misconi USA Distribution — Procurement, Distribution, Warehousing, Logistics"
          className="w-full max-w-[360px] md:max-w-[420px] h-auto"
          width={420}
          height={225}
          loading="eager"
        />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 min-w-0 ${className}`}>
        <img
          src="/images/distribution-banner.png"
          alt=""
          aria-hidden="true"
          className="h-[40px] w-[40px] rounded-full object-cover object-top flex-shrink-0"
          style={{ objectPosition: '50% 8%' }}
        />
        <div className="flex flex-col gap-[2px] leading-none min-w-0">
          <span className="font-heading text-[15px] font-[700] tracking-[-0.02em] text-[var(--compliance-blue-dark)] truncate">
            Misconi USA Distribution
          </span>
          <span className="font-body text-[9px] tracking-[0.10em] uppercase text-[var(--text-muted)] truncate">
            Procurement • Distribution • Warehousing • Logistics
          </span>
        </div>
      </div>
    );
  }

  return (
    <section
      className={`relative overflow-hidden bg-white ${className}`}
      aria-label="Misconi USA Distribution"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(26,76,124,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(26,76,124,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 md:px-12 py-8 md:py-10 flex justify-center">
        <img
          src="/images/distribution-banner.png"
          alt="Misconi USA Distribution — Procurement, Distribution, Warehousing, Logistics"
          className="w-full max-w-[520px] h-auto"
          width={520}
          height={280}
          loading="eager"
        />
      </div>
    </section>
  );
}
