import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx';
import SupplierCard from '../components/suppliers/SupplierCard.jsx';
import { suppliers } from '../data/suppliers.js';

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = String(params.get('query') || '').trim();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 260);
    return () => window.clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return [];
    return suppliers.filter((s) => {
      return (
        s.name.toLowerCase().includes(q) ||
        s.categoryName.toLowerCase().includes(q) ||
        s.capabilitiesSummary.toLowerCase().includes(q) ||
        (s.region || '').toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <div className="bg-white">
      <header className="bg-[var(--compliance-blue-xdark)] text-white">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 pt-[140px] pb-[80px]">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-white text-[56px] leading-[1.0]">
            Search Results
          </motion.h1>
          <p className="mt-4 font-body text-[18px] leading-[1.7] text-white/70 max-w-[720px]">
            Results for your search across supplier names, categories, capabilities, and regions.
          </p>
          <div className="mt-6 font-heading text-[13px] tracking-[0.08em] uppercase text-[var(--alert-green)]">
            {query ? `Showing ${filtered.length} suppliers` : 'Start a search to see results'}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-[80px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-[28px] shadow-sm">
                <LoadingSkeleton className="h-[56px] w-[56px]" />
                <div className="mt-6">
                  <LoadingSkeleton className="h-[16px] w-[60%]" />
                  <LoadingSkeleton className="mt-3 h-[14px] w-[75%]" />
                  <LoadingSkeleton className="mt-4 h-[14px] w-[90%]" />
                </div>
              </div>
            ))}
          </div>
        ) : query && filtered.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center">
            <div className="text-[var(--text-muted)]">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="mt-6 font-display text-[28px] text-[var(--text-primary)]">No suppliers match your search</div>
            <div className="mt-3 font-body text-[16px] text-[var(--text-secondary)] max-w-[520px]">
              Try adjusting your search terms.
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px]"
          >
            {filtered.map((s) => (
              <SupplierCard
                key={s.supplierId}
                supplierId={s.supplierId}
                name={s.name}
                logoUrl={s.logoUrl}
                categoryName={s.categoryName}
                capabilitiesSummary={s.capabilitiesSummary}
                region={s.region}
                supplierType={s.supplierType}
                representationStatus={s.representationStatus}
                readinessLevel={s.readinessLevel}
                similarSupplierIds={s.similarSupplierIds}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

