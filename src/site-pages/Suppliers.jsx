import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import Button from '../components/ui/Button.jsx';
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx';
import SupplierCard from '../components/suppliers/SupplierCard.jsx';
import { suppliers } from '../data/suppliers.js';
import { categories } from '../data/categories.js';

const PAGE_SIZE = 6;

function fadeInUpVariants() {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

export default function Suppliers() {
  const fadeInUp = fadeInUpVariants();

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [readinessLevel, setReadinessLevel] = useState('all');
  const [region, setRegion] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 280);
    return () => window.clearTimeout(t);
  }, []);

  const regionOptions = useMemo(() => {
    const set = new Set();
    suppliers.forEach((s) => {
      if (s.region) set.add(s.region);
    });
    return Array.from(set).sort();
  }, []);

  const categoriesById = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c]));
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suppliers.filter((s) => {
      const matchesQuery = !q || s.name.toLowerCase().includes(q) || s.capabilitiesSummary.toLowerCase().includes(q);
      const matchesCategory = categoryId === 'all' || s.categoryId === categoryId;
      const matchesReadiness = readinessLevel === 'all' || s.readinessLevel === readinessLevel;
      const matchesRegion = region === 'all' || s.region === region;
      return matchesQuery && matchesCategory && matchesReadiness && matchesRegion;
    });
  }, [query, categoryId, readinessLevel, region]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);

  useEffect(() => setPage(1), [query, categoryId, readinessLevel, region]);

  const paged = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageSafe]);

  const activeFilters = useMemo(() => {
    const items = [];
    if (categoryId !== 'all') items.push({ key: 'category', label: categoriesById.get(categoryId)?.name || 'Category' });
    if (readinessLevel !== 'all') items.push({ key: 'readiness', label: readinessLevel.replace('LEVEL_', 'Level ') });
    if (region !== 'all') items.push({ key: 'region', label: region });
    if (query.trim()) items.push({ key: 'query', label: `Search: ${query.trim()}` });
    return items;
  }, [categoryId, readinessLevel, region, query, categoriesById]);

  return (
    <div className="bg-white">
      <header className="bg-[var(--compliance-blue-xdark)] text-white">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 pt-[140px] pb-[80px]">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Suppliers' },
            ]}
          />
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-white text-[56px] leading-[1.0]">
            Supplier Directory
          </motion.h1>
          <p className="mt-4 font-body text-[18px] leading-[1.7] text-white/70 max-w-[720px]">
            Browse all readiness-approved, representation-eligible suppliers in our network.
          </p>
          <div className="mt-6 font-heading text-[13px] tracking-[0.08em] uppercase text-[var(--alert-green)]">
            Showing {filtered.length} suppliers
          </div>
        </div>
      </header>

      <div className="sticky top-[72px] z-[50] bg-white border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
            <div className="lg:col-span-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-[52px] border-[1.5px] border-[var(--border)] rounded-[var(--radius-md)] px-4 outline-none text-[15px] font-body placeholder:text-[var(--text-muted)] focus:border-[var(--compliance-blue)] focus:shadow-[0_0_0_3px_rgba(26,76,124,0.12)] transition-shadow"
                placeholder="Search suppliers"
              />
            </div>
            <div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-[52px] border-[1.5px] border-[var(--border)] rounded-[var(--radius-md)] px-4 outline-none font-body text-[15px] focus:border-[var(--compliance-blue)] focus:shadow-[0_0_0_3px_rgba(26,76,124,0.12)] transition-shadow bg-white"
              >
                <option value="all">Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={readinessLevel}
                onChange={(e) => setReadinessLevel(e.target.value)}
                className="w-full h-[52px] border-[1.5px] border-[var(--border)] rounded-[var(--radius-md)] px-4 outline-none font-body text-[15px] focus:border-[var(--compliance-blue)] focus:shadow-[0_0_0_3px_rgba(26,76,124,0.12)] transition-shadow bg-white"
              >
                <option value="all">Readiness</option>
                <option value="LEVEL_1">Level 1</option>
                <option value="LEVEL_2">Level 2</option>
                <option value="LEVEL_3">Level 3</option>
              </select>
            </div>
            <div>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full h-[52px] border-[1.5px] border-[var(--border)] rounded-[var(--radius-md)] px-4 outline-none font-body text-[15px] focus:border-[var(--compliance-blue)] focus:shadow-[0_0_0_3px_rgba(26,76,124,0.12)] transition-shadow bg-white"
              >
                <option value="all">Region</option>
                {regionOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {activeFilters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 border border-[var(--border-strong)] bg-[rgba(26,76,124,0.06)] text-[var(--compliance-blue)] font-heading text-[11px] tracking-[0.12em] uppercase"
                  onClick={() => {
                    if (f.key === 'category') setCategoryId('all');
                    if (f.key === 'readiness') setReadinessLevel('all');
                    if (f.key === 'region') setRegion('all');
                    if (f.key === 'query') setQuery('');
                  }}
                  aria-label={`Remove filter ${f.label}`}
                >
                  <span className="truncate max-w-[180px]">{f.label}</span>
                  <X size={14} aria-hidden="true" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategoryId('all');
                  setReadinessLevel('all');
                  setRegion('all');
                }}
                className="ml-auto font-heading text-[12px] tracking-[0.08em] uppercase text-[var(--compliance-blue)] hover:text-[var(--alert-green)] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-[80px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-[28px] shadow-sm">
                <LoadingSkeleton className="h-[56px] w-[56px] rounded-[var(--radius-md)]" />
                <div className="mt-6">
                  <LoadingSkeleton className="h-[18px] w-[70%]" />
                  <LoadingSkeleton className="mt-3 h-[14px] w-[55%]" />
                </div>
                <div className="mt-6">
                  <LoadingSkeleton className="h-[14px] w-[90%]" />
                  <LoadingSkeleton className="mt-2 h-[14px] w-[80%]" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center">
            <div className="text-[var(--text-muted)]">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="mt-6 font-display text-[28px] text-[var(--text-primary)]">No suppliers match your search</div>
            <div className="mt-3 font-body text-[16px] text-[var(--text-secondary)] max-w-[520px]">
              Try adjusting your filters or search terms.
            </div>
            <button
              type="button"
              className="mt-6 font-heading text-[12px] tracking-[0.08em] uppercase text-[var(--compliance-blue)] hover:text-[var(--alert-green)] transition-colors"
              onClick={() => {
                setQuery('');
                setCategoryId('all');
                setReadinessLevel('all');
                setRegion('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px]"
            >
              {paged.map((s) => (
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

            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={pageSafe <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-[40px] px-4 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--compliance-blue)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--border-strong)] transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <ChevronLeft size={16} />
                  Prev
                </span>
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const isActive = p === pageSafe;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className="h-[40px] px-4 rounded-[var(--radius-sm)] border border-[var(--border)] font-heading text-[13px] tracking-[0.02em] transition-colors"
                    style={{
                      backgroundColor: isActive ? 'var(--compliance-blue)' : 'transparent',
                      color: isActive ? 'white' : 'var(--compliance-blue)',
                      borderColor: isActive ? 'var(--compliance-blue)' : 'var(--border)',
                    }}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={pageSafe >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-[40px] px-4 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--compliance-blue)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--border-strong)] transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  Next
                  <ChevronRight size={16} />
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

