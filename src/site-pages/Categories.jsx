import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import CategoryCard from '../components/categories/CategoryCard.jsx';
import { categories } from '../data/categories.js';
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx';
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

export default function CategoriesPage() {
  const fadeInUp = fadeInUpVariants();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 260);
    return () => window.clearTimeout(t);
  }, []);

  const totalSuppliers = suppliers.length;

  return (
    <div className="bg-white">
      <header className="bg-[var(--compliance-blue-xdark)] text-white">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 pt-[140px] pb-[80px]">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-white text-[56px] leading-[1.0]">
            Categories
          </motion.h1>
          <p className="mt-4 font-body text-[18px] leading-[1.7] text-white/70 max-w-[720px]">
            Explore the industries we serve with readiness-approved suppliers.
          </p>
          <div className="mt-6 font-heading text-[13px] tracking-[0.08em] uppercase text-[var(--alert-green)]">
            Showing {categories.length} categories • {totalSuppliers} suppliers
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-[80px]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-[32px_28px]">
                <LoadingSkeleton className="h-[48px] w-[48px]" />
                <div className="mt-6">
                  <LoadingSkeleton className="h-[20px] w-[70%]" />
                  <LoadingSkeleton className="mt-4 h-[14px] w-[90%]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]"
          >
            {categories.map((c) => (
              <CategoryCard
                key={c.id}
                categoryId={c.id}
                name={c.name}
                description={c.description}
                iconUrl={c.icon}
                supplierCount={c.supplierCount}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

