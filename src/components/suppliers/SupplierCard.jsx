import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { getInitialsAvatar } from '../../utils/getInitialsAvatar.jsx';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

const readinessPills = {
  LEVEL_1: { bg: '#9E9E9E15', color: '#9E9E9E', border: '#9E9E9E30', label: 'LEVEL 1' },
  LEVEL_2: { bg: '#2196F315', color: '#2196F3', border: '#2196F330', label: 'LEVEL 2' },
  LEVEL_3: { bg: '#00C85315', color: '#00C853', border: '#00C85330', label: 'LEVEL 3' },
};

function ReadinessPill({ readinessLevel }) {
  const cfg = readinessPills[readinessLevel] || readinessPills.LEVEL_1;
  return (
    <div
      className="inline-flex items-center gap-2 rounded-[var(--radius-full)] px-[10px] py-[4px] border flex-shrink-0 whitespace-nowrap"
      style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }}
    >
      <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: cfg.color }} aria-hidden="true" />
      <span className="font-heading text-[10px] tracking-[0.12em] uppercase font-[700]">{cfg.label}</span>
    </div>
  );
}

function TypeBadgeRow({ supplierType }) {
  const isLead = supplierType === 'LEAD';
  const dot = isLead ? '#D4A857' : '#00A86B';
  const textColor = dot;
  const label = isLead ? 'Seeking Representation' : 'Represented';

  return (
    <div className="flex items-center gap-[6px] mt-[10px] whitespace-nowrap">
      <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: dot }} aria-hidden="true" />
      <span className="font-body text-[11px] font-[500] tracking-[0.04em]" style={{ color: textColor }}>
        {label}
      </span>
    </div>
  );
}

function RepresentationStatusPill({ representationStatus }) {
  const s = String(representationStatus || '').toLowerCase();

  const cfg = s.includes('actively')
    ? { label: 'ACTIVELY REPRESENTED', color: '#00A86B' }
    : s.includes('limited')
      ? { label: 'LIMITED REPRESENTATION', color: '#FB8C00' }
      : { label: 'REPRESENTATION AVAILABLE', color: '#1A4C7C' };

  const bg = `${cfg.color}20`;
  const border = `${cfg.color}40`;

  return (
    <div
      className="inline-flex items-center gap-[6px] rounded-[999px] px-[12px] py-[4px] border whitespace-nowrap min-w-fit"
      style={{ backgroundColor: bg, color: cfg.color, borderColor: border }}
    >
      <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: cfg.color }} aria-hidden="true" />
      <span className="font-heading text-[10px] tracking-[0.10em] uppercase font-[700]">{cfg.label}</span>
    </div>
  );
}

export default function SupplierCard({
  supplierId,
  name,
  logoUrl,
  categoryName,
  capabilitiesSummary,
  region,
  supplierType,
  representationStatus,
  readinessLevel,
  similarSupplierIds,
  compact = false,
}) {
  const capabilitiesStyle = compact
    ? { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
    : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' };

  const paddingClass = compact ? 'p-[22px]' : 'p-[28px]';
  const logoSizeClass = 'w-[56px] h-[56px]';
  const logoPadClass = 'p-[8px]';
  const nameSizeClass = 'text-[16px]';
  const capabilitiesTopMargin = compact ? 'mt-4' : 'mt-5';

  return (
    <motion.div
      className={cx(
        'relative bg-white border rounded-[var(--radius-lg)] shadow-sm transition-[transform,box-shadow,border-color] will-change-transform',
        paddingClass,
        'border-[var(--border)]'
      )}
      style={{ transition: 'all 0.30s var(--ease)' }}
      initial={false}
      whileHover={{
        y: -6,
        boxShadow: 'var(--shadow-lg)',
        borderColor: 'var(--border-strong)',
      }}
      transition={{ duration: 0.30, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div
              className={cx(
                'flex items-center justify-center bg-white border border-[rgba(26,76,124,0.12)] overflow-hidden flex-shrink-0 rounded-[10px]',
                logoSizeClass,
                logoPadClass
              )}
            >
              {logoUrl ? (
                <img src={logoUrl} alt={`${name} logo`} className="w-full h-full object-contain" loading="lazy" />
              ) : (
                getInitialsAvatar(name)
              )}
            </div>

            <div className="flex-1 min-w-0 overflow-hidden px-[12px]">
              <div
                className={cx('font-heading font-[700] text-[var(--text-primary)] whitespace-nowrap overflow-hidden text-ellipsis', nameSizeClass)}
              >
                {name}
              </div>
              <div className="mt-[3px] font-body font-[400] text-[13px] text-[var(--text-muted)]">
                {categoryName}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <ReadinessPill readinessLevel={readinessLevel} />
          </div>
        </div>

        <TypeBadgeRow supplierType={supplierType} />
      </div>

      <div className={capabilitiesTopMargin}>
        <div className="h-[1px] bg-[var(--border-light)] my-3" />
        <p className="font-body text-[15px] text-[var(--text-secondary)]" style={capabilitiesStyle}>
          {capabilitiesSummary}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-[8px]">
        {region && (
          <div className="inline-flex items-center rounded-full border border-[var(--border-light)] bg-[var(--surface-subtle)] px-3 py-[7px] text-[13px] font-body text-[var(--text-secondary)]">
            {region}
          </div>
        )}
        <RepresentationStatusPill representationStatus={representationStatus} />
      </div>

      <div className="mt-6 pt-5 border-t border-[var(--border-light)]">
        <Link
          to={`/suppliers/${supplierId}`}
          className="group flex items-center justify-end gap-3 font-heading text-[12px] tracking-[0.08em] uppercase text-[var(--compliance-blue)] hover:text-[var(--alert-green)] transition-colors"
        >
          <span>View Supplier</span>
          <motion.span
            aria-hidden="true"
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <ArrowRight size={16} />
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
}

