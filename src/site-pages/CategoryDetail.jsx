'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import CategoryIcon from '../components/categories/CategoryIcon.jsx';
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx';
import SupplierCard from '../components/suppliers/SupplierCard.jsx';
import { categories } from '../data/categories.js';
import { suppliers } from '../data/suppliers.js';

function fadeInUpVariants() {
  return {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

export default function CategoryDetailPage({ id }) {
  const fadeInUp = fadeInUpVariants();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 260);
    return () => window.clearTimeout(t);
  }, []);

  const category = useMemo(() => categories.find((c) => c.id === id) || null, [id]);
  const filteredSuppliers = useMemo(() => {
    if (!category) return [];
    return suppliers.filter((s) => s.categoryId === category.id);
  }, [category]);

  if (!category) {
    return (
      <div className="min-h-[60vh] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-24 font-display text-[48px] font-[600] text-[var(--text-primary)]">
          Category not found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <header className="bg-[var(--compliance-blue-xdark)] text-white">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 pt-[140px] pb-[80px]">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Categories', to: '/categories' },
              { label: category.name },
            ]}
          />

          <div className="flex items-start gap-5">
            <div className="w-[56px] h-[56px] rounded-[var(--radius-md)] bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <CategoryIcon iconKey={category.icon} size={26} />
            </div>
            <div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-white text-[56px] leading-[1.0]">
                {category.name}
              </motion.h1>
              <p className="mt-4 font-body text-[18px] leading-[1.7] text-white/70 max-w-[760px]">{category.description}</p>
              <div className="mt-6 font-heading text-[13px] tracking-[0.08em] uppercase text-[var(--alert-green)]">
                Showing {filteredSuppliers.length} suppliers
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-[80px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i}>
                <LoadingSkeleton className="h-[320px] w-full rounded-[var(--radius-lg)]" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px]"
          >
              {filteredSuppliers.map((s) => (
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

