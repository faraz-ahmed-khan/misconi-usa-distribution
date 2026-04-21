'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import Button from '../components/ui/Button.jsx';
import { suppliers } from '../data/suppliers.js';
import { readinessLevels } from '../data/readiness.js';
import { getInitialsAvatar } from '../utils/getInitialsAvatar.jsx';
import SupplierCard from '../components/suppliers/SupplierCard.jsx';

function readinessColor(level) {
  if (level === 'LEVEL_1') return '#9E9E9E';
  if (level === 'LEVEL_2') return '#2196F3';
  return '#00C853';
}

function repColor(repStatus) {
  const s = String(repStatus || '').toLowerCase();
  if (s.includes('active')) return '#00A86B';
  if (s.includes('limited')) return '#FB8C00';
  return '#1A4C7C';
}

export default function SupplierDetail({ id }) {
  const supplier = useMemo(() => suppliers.find((s) => s.supplierId === id), [id]);

  const readiness = useMemo(() => {
    return readinessLevels.find((r) => r.level === supplier?.readinessLevel) || null;
  }, [supplier]);

  const similarSuppliers = useMemo(() => {
    if (!supplier) return [];
    const ids = supplier.similarSupplierIds || [];
    return ids.map((sid) => suppliers.find((s) => s.supplierId === sid)).filter(Boolean).slice(0, 3);
  }, [supplier]);

  if (!supplier) {
    return (
      <div className="min-h-[60vh] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-24">
          <div className="font-display text-[48px] font-[600] text-[var(--text-primary)]">Supplier not found</div>
        </div>
      </div>
    );
  }

  const rColor = readinessColor(supplier.readinessLevel);
  const rpColor = repColor(supplier.representationStatus);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12 pt-[120px]">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Suppliers', to: '/suppliers' },
            { label: supplier.name },
          ]}
        />

        <div className="bg-white">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            <div className="w-[80px] h-[80px] rounded-[var(--radius-md)] border border-[var(--border-light)] p-2 flex items-center justify-center flex-shrink-0">
              {supplier.logoUrl ? (
                <img src={supplier.logoUrl} alt={`${supplier.name} logo`} className="w-full h-full object-contain rounded-[var(--radius-md)]" loading="lazy" />
              ) : (
                <div className="w-full h-full">{getInitialsAvatar(supplier.name)}</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-display text-[40px] leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)] font-[600]">
                {supplier.name}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="font-body text-[14px] text-[var(--text-muted)]">{supplier.categoryName}</div>
                {supplier.region && (
                  <div className="inline-flex items-center rounded-full border border-[var(--border-light)] bg-[var(--surface-subtle)] px-3 py-[7px] text-[13px] font-body text-[var(--text-secondary)]">
                    {supplier.region}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <div
                className="inline-flex items-center gap-2 rounded-[var(--radius-full)] px-3 py-1 border"
                style={{
                  backgroundColor: `${rColor}20`,
                  color: rColor,
                  borderColor: `${rColor}40`,
                }}
              >
                <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: rColor }} aria-hidden="true" />
                <span className="font-heading text-[10px] tracking-[0.12em] uppercase">{supplier.readinessLevel.replace('LEVEL_', 'LEVEL ')}</span>
              </div>

              <div
                className="inline-flex items-center gap-2 rounded-[var(--radius-full)] px-3 py-1 border max-w-[260px]"
                style={{
                  backgroundColor: `${rpColor}20`,
                  color: rpColor,
                  borderColor: `${rpColor}40`,
                }}
              >
                <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: rpColor }} aria-hidden="true" />
                <span className="font-heading text-[10px] tracking-[0.12em] uppercase truncate">
                  {supplier.representationStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <div>
                <div className="font-heading text-[18px] font-[700] text-[var(--text-primary)]">Capabilities</div>
                <p className="mt-3 font-body text-[16px] leading-[1.7] text-[var(--text-secondary)]">{supplier.capabilitiesSummary}</p>
              </div>

              <div className="mt-8 rounded-[var(--radius-md)] border border-[rgba(0,168,107,0.20)] bg-[var(--alert-green-xlight)] p-7">
                <div className="flex items-center gap-3">
                  <div className="w-[38px] h-[38px] rounded-[var(--radius-sm)] bg-[rgba(0,168,107,0.12)] border border-[rgba(0,168,107,0.22)] flex items-center justify-center text-[var(--alert-green)]">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="font-heading text-[17px] font-[700] text-[var(--text-primary)]">
                    Represented by Misconi USA
                  </div>
                </div>
                <p className="mt-3 font-body text-[16px] leading-[1.7] text-[var(--text-secondary)]">
                  This supplier is represented in our network. To inquire about procurement opportunities, contact the representation team.
                </p>
                <div className="mt-5">
                  <Button variant="primary" to="/contact">
                    Contact Representation Team
                  </Button>
                </div>
              </div>

              <div className="mt-8 border border-[var(--border)] rounded-[var(--radius-md)] p-7">
                <div className="font-heading text-[18px] font-[700] text-[var(--text-primary)]">Readiness Explanation</div>
                <div className="mt-3 font-body text-[16px] leading-[1.8] text-[var(--text-secondary)]">
                  {readiness ? readiness.description : 'Readiness metadata is unavailable.'}
                </div>
              </div>

              <div className="mt-10">
                <div className="font-heading text-[18px] font-[700] text-[var(--text-primary)]">Similar Suppliers</div>
                {similarSuppliers.length ? (
                  <div className="mt-6 flex gap-6 overflow-x-auto pb-2">
                    {similarSuppliers.map((s) => (
                      <div key={s.supplierId} className="w-[360px] flex-shrink-0">
                        <SupplierCard
                          {...{
                            supplierId: s.supplierId,
                            name: s.name,
                            logoUrl: s.logoUrl,
                            categoryName: s.categoryName,
                            capabilitiesSummary: s.capabilitiesSummary,
                            region: s.region,
                            supplierType: s.supplierType,
                            representationStatus: s.representationStatus,
                            readinessLevel: s.readinessLevel,
                            similarSupplierIds: s.similarSupplierIds,
                            compact: true,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 font-body text-[15px] text-[var(--text-muted)]">No similar suppliers to display.</div>
                )}
              </div>
            </div>

            <aside className="lg:col-span-5 lg:sticky lg:top-[96px] self-start">
              <div className="bg-white border border-[var(--border)] rounded-[var(--radius-md)] shadow-sm p-7">
                <div className="font-heading text-[16px] font-[700] text-[var(--text-primary)]">Quick Facts</div>

                <div className="mt-5 space-y-4">
                  {[
                    { label: 'Category', value: supplier.categoryName },
                    { label: 'Region', value: supplier.region || 'National' },
                    { label: 'Supplier Type', value: supplier.supplierType === 'LEAD' ? 'Seeking Representation' : 'Represented' },
                    { label: 'Readiness Level', value: supplier.readinessLevel.replace('LEVEL_', 'Level ') },
                    { label: 'Representation Status', value: supplier.representationStatus },
                  ].map((row, idx) => (
                    <div key={row.label} className={idx === 0 ? '' : 'pt-4 border-t border-[var(--border-light)]'}>
                      <div className="font-heading text-[12px] tracking-[0.16em] uppercase text-[var(--text-muted)]">
                        {row.label}
                      </div>
                      <div className="mt-2 font-heading text-[14px] text-[var(--text-primary)]">{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-[var(--compliance-blue)] rounded-[var(--radius-md)] p-7 text-white">
                <div className="font-heading text-[17px] font-[700]">Contact Representation Team</div>
                <div className="mt-3 font-body text-[14px] leading-[1.7] text-[rgba(255,255,255,0.75)]">
                  Reach out to coordinate procurement discussions and representation inquiries.
                </div>
                <div className="mt-5">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-[24px] py-[13px] rounded-[var(--radius-sm)] bg-white text-[var(--compliance-blue)] font-heading text-[12px] tracking-[0.08em] uppercase hover:bg-[rgba(255,255,255,0.92)] transition-colors"
                  >
                    Contact Representation Team
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

