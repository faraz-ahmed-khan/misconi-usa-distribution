import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import SectionLabel from '../components/ui/SectionLabel.jsx';
import CategoryCard from '../components/categories/CategoryCard.jsx';
import SupplierCard from '../components/suppliers/SupplierCard.jsx';
import ReadinessLevelCard from '../components/readiness/ReadinessLevelCard.jsx';
import TestimonialCarousel from '../components/testimonials/TestimonialCarousel.jsx';
import FAQAccordion from '../components/faq/FAQAccordion.jsx';
import RepresentationDiagram from '../components/representation/RepresentationDiagram.jsx';
import CorporateBanner from '../components/layout/CorporateBanner.jsx';

import { categories as categories } from '../data/categories.js';
import { suppliers as suppliersData } from '../data/suppliers.js';

function fadeInUpVariants() {
  return {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

function staggerVariants() {
  return {
    visible: { transition: { staggerChildren: 0.12 } },
  };
}

function SupplyNetworkIllustration() {
  const nodes = [
    { cx: 150, cy: 210, r: 7, delay: 0.0 },
    { cx: 230, cy: 150, r: 6, delay: 0.35 },
    { cx: 310, cy: 220, r: 7, delay: 0.7 },
    { cx: 390, cy: 160, r: 6, delay: 0.25 },
    { cx: 430, cy: 280, r: 7, delay: 0.55 },
    { cx: 260, cy: 320, r: 6, delay: 0.8 },
  ];

  const bigNodes = [
    { cx: 150, cy: 210 },
    { cx: 310, cy: 220 },
    { cx: 430, cy: 280 },
    { cx: 260, cy: 320 },
  ];

  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      <style>{`
        @keyframes ringRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes nodePulse { 0%, 100% { transform: scale(1); opacity: 0.95; } 50% { transform: scale(1.18); opacity: 1; } }
        @keyframes dashFlow { to { stroke-dashoffset: -220; } }
      `}</style>

      <svg viewBox="0 0 600 520" className="w-full h-auto" role="img" aria-label="Supply chain network illustration">
        <defs>
          <filter id="softBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <g className="outerRing">
          <circle
            cx="300"
            cy="260"
            r="170"
            fill="none"
            stroke="rgba(34,96,160,0.35)"
            strokeWidth="2"
            strokeDasharray="8 10"
          />
          <circle
            cx="300"
            cy="260"
            r="150"
            fill="none"
            stroke="rgba(0,168,107,0.18)"
            strokeWidth="2"
            strokeDasharray="4 10"
          />
        </g>

        <g className="flowLines" style={{ transformOrigin: '300px 260px' }}>
          <path
            d="M150 210 C 220 145, 270 150, 310 220 C 350 285, 410 250, 430 280"
            fill="none"
            stroke="rgba(226,195,122,0.55)"
            strokeWidth="2"
            strokeDasharray="10 12"
            style={{ animation: 'dashFlow 3s linear infinite' }}
          />
          <path
            d="M230 150 C 250 210, 240 260, 260 320 C 290 410, 380 380, 430 280"
            fill="none"
            stroke="rgba(34,96,160,0.50)"
            strokeWidth="2"
            strokeDasharray="8 12"
            style={{ animation: 'dashFlow 2.7s linear infinite' }}
          />
        </g>

        {/* soft depth blobs */}
        <circle cx="430" cy="160" r="95" fill="rgba(26,76,124,0.20)" filter="url(#softBlur)" />
        <circle cx="180" cy="310" r="85" fill="rgba(0,168,107,0.10)" filter="url(#softBlur)" />

        {/* key nodes */}
        {bigNodes.map((n, idx) => (
          <g key={idx} style={{ animation: `nodePulse 2s ${idx % 2 ? '1s' : '0s'} infinite ease-in-out` }}>
            <circle cx={n.cx} cy={n.cy} r="12" fill="rgba(0,168,107,0.12)" />
            <circle cx={n.cx} cy={n.cy} r="6" fill="rgba(26,76,124,0.85)" />
          </g>
        ))}

        {/* pulse nodes */}
        {nodes.map((n, idx) => (
          <g key={idx} style={{ transformOrigin: `${n.cx}px ${n.cy}px`, animation: `nodePulse 2s ${n.delay}s infinite ease-in-out` }}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill="rgba(34,96,160,0.95)" />
            <circle cx={n.cx} cy={n.cy} r={n.r + 8} fill="rgba(34,96,160,0.12)" />
          </g>
        ))}
      </svg>

      <style>{`
        .outerRing {
          transform-origin: 300px 260px;
          animation: ringRotate 60s linear infinite;
        }
      `}</style>
    </div>
  );
}

function RepresentationFlowDiagram() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      <style>{`
        @keyframes dashFlow2 { to { stroke-dashoffset: -260; } }
      `}</style>

      <svg viewBox="0 0 680 420" className="w-full h-auto" role="img" aria-label="Representation chain diagram">
        <defs>
          <filter id="glassBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* nodes as glass cards */}
        <g>
          <rect x="40" y="140" width="160" height="64" rx="16" fill="rgba(255,255,255,0.06)" stroke="rgba(26,76,124,0.55)" strokeWidth="1.5" />
          <text x="120" y="178" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14" fontFamily="Syne, sans-serif" fontWeight="700">
            Supplier Leads (MSI)
          </text>

          <rect x="250" y="82" width="180" height="64" rx="16" fill="rgba(255,255,255,0.06)" stroke="rgba(26,76,124,0.55)" strokeWidth="1.5" />
          <text x="340" y="120" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14" fontFamily="Syne, sans-serif" fontWeight="700">
            Readiness Engine
          </text>

          <rect x="250" y="240" width="180" height="64" rx="16" fill="rgba(255,255,255,0.06)" stroke="rgba(26,76,124,0.55)" strokeWidth="1.5" />
          <text x="340" y="278" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14" fontFamily="Syne, sans-serif" fontWeight="700">
            DIST Engine
          </text>

          <rect x="470" y="140" width="170" height="64" rx="16" fill="rgba(255,255,255,0.06)" stroke="rgba(26,76,124,0.55)" strokeWidth="1.5" />
          <text x="555" y="178" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14" fontFamily="Syne, sans-serif" fontWeight="700">
            Surface Activation Controller
          </text>

          <rect x="470" y="260" width="170" height="64" rx="16" fill="rgba(255,255,255,0.06)" stroke="rgba(26,76,124,0.55)" strokeWidth="1.5" />
          <text x="555" y="298" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14" fontFamily="Syne, sans-serif" fontWeight="700">
            MisconiUSADistribution.com
          </text>
        </g>

        {/* flow lines */}
        <path
          d="M200 172 C 220 160, 235 150, 250 130"
          fill="none"
          stroke="rgba(34,96,160,0.7)"
          strokeWidth="2"
          strokeDasharray="10 12"
          style={{ animation: 'dashFlow2 3.2s linear infinite' }}
        />
        <path
          d="M250 162 C 235 182, 222 210, 200 210"
          fill="none"
          stroke="rgba(0,168,107,0.55)"
          strokeWidth="2"
          strokeDasharray="10 12"
          style={{ animation: 'dashFlow2 2.8s linear infinite' }}
        />
        <path
          d="M430 114 C 450 114, 450 114, 470 140"
          fill="none"
          stroke="rgba(226,195,122,0.6)"
          strokeWidth="2"
          strokeDasharray="10 12"
          style={{ animation: 'dashFlow2 3s linear infinite' }}
        />
        <path
          d="M470 172 C 450 210, 450 210, 420 240"
          fill="none"
          stroke="rgba(34,96,160,0.65)"
          strokeWidth="2"
          strokeDasharray="10 12"
          style={{ animation: 'dashFlow2 3.1s linear infinite' }}
        />
        <path
          d="M535 204 C 535 224, 535 238, 535 260"
          fill="none"
          stroke="rgba(0,168,107,0.6)"
          strokeWidth="2"
          strokeDasharray="10 12"
          style={{ animation: 'dashFlow2 2.9s linear infinite' }}
        />
      </svg>
    </div>
  );
}

function Hero() {
  const fadeInUp = fadeInUpVariants();
  const stagger = staggerVariants();

  const featuredStats = [
    { value: '2,400+', label: 'Verified Suppliers' },
    { value: '47', label: 'Categories Available' },
    { value: 'Level 3', label: 'Representation Excellence' },
  ];

  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-[var(--compliance-blue-xdark)]">
      <div className="absolute inset-0 z-[0]" aria-hidden="true">
        <div className="absolute inset-0 bg-[var(--compliance-blue-xdark)]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 800px 600px at 80% 20%, rgba(26,76,124,0.55), transparent)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 600px 500px at 10% 90%, rgba(0,168,107,0.08), transparent)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(180deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 2px, transparent 4px)',
            opacity: 0.015,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-5 md:px-12 pt-[100px] pb-[60px] md:pt-[104px] md:pb-12 max-[380px]:px-[14px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-[620px]">
            <motion.div variants={fadeInUp} className="mb-8">
              <CorporateBanner variant="hero" />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <SectionLabel text="Supplier Representation Network" light={true} />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mt-6 font-display text-white text-[40px] leading-[1.0] tracking-[-0.025em] font-[600] md:text-[48px] lg:text-[80px] max-[480px]:text-[34px] max-[380px]:text-[28px]"
            >
              <em className="not-italic font-[600]">America's</em> Supplier Representation Network
            </motion.h1>

            <motion.div variants={fadeInUp} className="h-[2px] w-[60px] bg-[var(--alert-green)] my-8" aria-hidden="true" />

            <motion.p variants={fadeInUp} className="text-[18px] leading-[1.7] text-white/70 max-w-[560px]">
              We showcase suppliers who meet strict readiness, compliance, and representation standards — ensuring quality, reliability,
              and procurement-aligned performance across every category.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10 hero-stats">
              {featuredStats.map((s, i) => (
                <div
                  key={s.value}
                  className={`hero-stat${i === 2 ? ' hero-stat--level3' : ''}`}
                >
                  <div className="hero-stat-number font-display text-white text-[48px] leading-[1.0] font-[700]">
                    {s.value}
                  </div>
                  <div className="hero-stat-label font-heading text-[11px] tracking-[0.14em] uppercase text-white/50 mt-3">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 hero-cta flex flex-wrap items-center gap-4">
              <Button variant="primary" to="/suppliers" withArrow>
                Explore Suppliers
              </Button>
              <Button variant="secondary" to="/categories" withArrow>
                View Categories
              </Button>
              <Button variant="ghost" to="/contact" withArrow={false}>
                Contact Team
              </Button>
            </motion.div>

            <style>{`
              /* Hero stats responsive layout fix (mobile only) */
              .hero-stats {
                display: flex;
                align-items: stretch;
              }
              .hero-stat {
                position: relative;
                flex: 1;
                padding-left: 0;
                padding-right: 24px;
              }
              .hero-stat:not(:first-child) {
                padding-left: 24px;
                padding-right: 0;
              }
              .hero-stat:not(:first-child)::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                transform: none;
                width: 1px;
                height: 100%;
                background: rgba(255,255,255,0.12);
              }

              .hero-stat-number {
                font-size: 48px;
              }
              .hero-stat-label {
                /* Keep desktop as-is; mobile wrapping/overflow rules are applied below. */
              }

              @media (max-width: 1023px) {
                .hero-stat:not(:first-child)::before {
                  top: 50%;
                  transform: translateY(-50%);
                  height: 40px;
                  background: rgba(255,255,255,0.15);
                }
              }

              /* Tablet (480-768): keep 3 columns row, reduce type + padding */
              @media (max-width: 768px) {
                .hero-stat {
                  padding-right: 18px;
                }
                .hero-stat:not(:first-child) {
                  padding-left: 18px;
                }
                .hero-stat-number {
                  font-size: 32px !important;
                }
                .hero-stat-label {
                  font-size: 9px !important;
                  letter-spacing: 0.08em !important;
                }
              }

              /* Mobile stats grid change */
              @media (max-width: 480px) {
                .hero-stats {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 20px 16px;
                }
                .hero-stat {
                  padding: 0;
                  border-bottom: 1px solid rgba(255,255,255,0.08);
                  padding-bottom: 16px;
                }
                .hero-stat:not(:first-child)::before {
                  display: none;
                }
                .hero-stat--level3 {
                  grid-column: 1 / -1;
                  border-bottom: none;
                  padding-bottom: 0;
                }
                .hero-stat-number {
                  font-size: 36px !important;
                }
                .hero-stat-label {
                  font-size: 9px !important;
                  letter-spacing: 0.08em !important;
                  white-space: normal;
                  word-break: break-word;
                  text-align: left;
                  line-height: 1.3;
                  max-width: none;
                  overflow: visible;
                }
              }

              @media (max-width: 380px) {
                .hero-stat-number {
                  font-size: 28px !important;
                }
                .hero-stat-label {
                  font-size: 9px !important;
                  letter-spacing: 0.08em !important;
                }
              }

              /* Hero CTA mobile stacking */
              @media (max-width: 640px) {
                .hero-cta {
                  flex-direction: column;
                  flex-wrap: nowrap;
                  align-items: stretch;
                  gap: 10px;
                }
                .hero-cta > a,
                .hero-cta > button {
                  width: 100%;
                }
              }
            `}</style>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={stagger} className="hidden lg:block lg:pl-10 pt-10 lg:pt-0">
            <motion.div variants={fadeInUp}>
              <SupplyNetworkIllustration />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 md:bottom-7 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-3 max-[768px]:bottom-3 max-[640px]:bottom-2 max-[480px]:bottom-1 max-[380px]:bottom-0 max-[768px]:gap-2">
        <div className="text-white/40 font-body text-[12px] tracking-[0.08em] uppercase">Scroll to explore</div>
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[var(--compliance-blue-light)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

function StatsTicker() {
  return (
    <div className="relative bg-[var(--compliance-blue)] h-[52px] overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div className="absolute inset-0" aria-hidden="true" style={{ opacity: 0.22 }} />
      <div className="h-full flex items-center">
        <div className="flex gap-10 whitespace-nowrap font-heading text-[12px] tracking-[0.10em] uppercase text-white/80 animate-[marquee_28s_linear_infinite] w-max">
          {/* sequence 1 */}
          <span className="text-[var(--alert-green)]">✦</span> 2,400+ Verified Suppliers <span className="text-[var(--alert-green)]">✦</span> 47 Product Categories{' '}
          <span className="text-[var(--alert-green)]">✦</span> Level 3 Representation Standards <span className="text-[var(--alert-green)]">✦</span> Readiness-Gated Visibility{' '}
          <span className="text-[var(--alert-green)]">✦</span> Procurement-Aligned Sourcing <span className="text-[var(--alert-green)]">✦</span> Misconi USA Representation Control{' '}
          <span className="text-[var(--alert-green)]">✦</span>

          {/* sequence 2 (identical) */}
          <span className="text-[var(--alert-green)]">✦</span> 2,400+ Verified Suppliers <span className="text-[var(--alert-green)]">✦</span> 47 Product Categories{' '}
          <span className="text-[var(--alert-green)]">✦</span> Level 3 Representation Standards <span className="text-[var(--alert-green)]">✦</span> Readiness-Gated Visibility{' '}
          <span className="text-[var(--alert-green)]">✦</span> Procurement-Aligned Sourcing <span className="text-[var(--alert-green)]">✦</span> Misconi USA Representation Control{' '}
          <span className="text-[var(--alert-green)]">✦</span>
        </div>
      </div>
    </div>
  );
}

function CategoriesSection({ categories }) {
  const fadeInUp = fadeInUpVariants();
  const stagger = staggerVariants();
  return (
    <section className="bg-white py-[120px]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <motion.div variants={fadeInUp}>
            <SectionLabel text="Supplier Network" light={false} />
          </motion.div>
          <motion.h2 variants={fadeInUp} className="mt-6 font-display text-[52px] leading-[1.05] tracking-[-0.02em] font-[600]">
            Our Supplier Categories
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-body text-[18px] leading-[1.7] text-[var(--text-secondary)] max-w-[560px]">
            Browse our curated network of readiness-approved suppliers organized by industry category.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {categories.map((c) => (
            <div key={c.id}>
              <CategoryCard
                categoryId={c.id}
                name={c.name}
                description={c.description}
                iconUrl={c.icon}
                supplierCount={c.supplierCount}
              />
            </div>
          ))}
        </motion.div>

        <div className="mt-14 flex justify-center">
          <Button variant="secondary" to="/categories" withArrow>
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
}

function FeaturedSuppliersSection() {
  const fadeInUp = fadeInUpVariants();
  const stagger = staggerVariants();

  const featuredSuppliers = [
    {
      supplierId: 'SUP-001',
      name: 'Acme Packaging Solutions',
      logoUrl: null,
      categoryName: 'Packaging',
      capabilitiesSummary:
        'Corrugated boxes, custom packaging, pallet-ready solutions for retail and distribution channels.',
      region: 'Southeast',
      supplierType: 'REPRESENTED',
      representationStatus: 'Actively Represented',
      readinessLevel: 'LEVEL_3',
    },
    {
      supplierId: 'SUP-002',
      name: 'Blue Ridge Textiles',
      logoUrl: null,
      categoryName: 'Textiles',
      capabilitiesSummary:
        'Industrial fabrics, protective uniforms, and OSHA-compliant safety textiles for industrial environments.',
      region: 'Midwest',
      supplierType: 'LEAD',
      representationStatus: 'Representation Available via Misconi USA',
      readinessLevel: 'LEVEL_2',
    },
    {
      supplierId: 'SUP-003',
      name: 'Pinnacle Industrial Supply',
      logoUrl: null,
      categoryName: 'Industrial Supply',
      capabilitiesSummary:
        'MRO products, cutting tools, fasteners, and industrial hardware with nationwide distribution capability.',
      region: 'Northeast',
      supplierType: 'REPRESENTED',
      representationStatus: 'Actively Represented',
      readinessLevel: 'LEVEL_3',
    },
    {
      supplierId: 'SUP-004',
      name: 'Meridian Logistics Group',
      logoUrl: null,
      categoryName: 'Logistics',
      capabilitiesSummary:
        'Full-service freight management, cold chain logistics, and last-mile delivery solutions.',
      region: 'National',
      supplierType: 'REPRESENTED',
      representationStatus: 'Limited Representation',
      readinessLevel: 'LEVEL_3',
    },
    {
      supplierId: 'SUP-005',
      name: 'Coastal Food Processors',
      logoUrl: null,
      categoryName: 'Food Manufacturing',
      capabilitiesSummary:
        'FDA-certified food processing, co-packing, and private label manufacturing for retail and foodservice.',
      region: 'Southeast',
      supplierType: 'REPRESENTED',
      representationStatus: 'Actively Represented',
      readinessLevel: 'LEVEL_3',
    },
    {
      supplierId: 'SUP-006',
      name: 'Summit Building Materials',
      logoUrl: null,
      categoryName: 'Construction',
      capabilitiesSummary:
        'Structural steel, prefab components, and commercial-grade building materials for large-scale projects.',
      region: 'West',
      supplierType: 'LEAD',
      representationStatus: 'Representation Available via Misconi USA',
      readinessLevel: 'LEVEL_2',
    },
  ];

  return (
    <section className="bg-[var(--off-white)] py-[120px]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <div className="flex items-start justify-between gap-6">
            <motion.div variants={fadeInUp} className="max-w-[620px]">
              <SectionLabel text="Featured Suppliers" light={false} />
              <div className="mt-6 font-display text-[48px] leading-[1.05] tracking-[-0.02em] font-[600]">
                Featured Suppliers
              </div>
              <div className="mt-4 font-body text-[18px] leading-[1.7] text-[var(--text-secondary)]">
                Handpicked suppliers who have achieved Readiness Level 3 and are actively represented by Misconi USA.
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="hidden md:block pt-10">
              <a
                href="/suppliers"
                className="font-heading text-[12px] tracking-[0.08em] uppercase text-[var(--compliance-blue)] hover:text-[var(--alert-green)] transition-colors flex items-center gap-2"
              >
                View Full Directory
                <span aria-hidden="true" className="text-[var(--alert-green)]">
                  →
                </span>
              </a>
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-14">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-120px' }}>
            <div className="flex gap-6 overflow-x-auto pb-2 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-[28px]">
              {featuredSuppliers.map((s) => (
                <div key={s.supplierId} className="w-[360px] flex-shrink-0 md:w-auto">
                  <SupplierCard {...s} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function RepresentationOverviewSection() {
  const fadeInUp = fadeInUpVariants();
  const stagger = staggerVariants();

  const counts = useMemo(() => {
    const active = suppliersData.filter((s) => String(s.representationStatus || '').toLowerCase().includes('actively')).length;
    const available = suppliersData.filter((s) => String(s.representationStatus || '').toLowerCase().includes('representation available')).length;
    return { active, available };
  }, []);

  return (
    <section
      className="py-[140px]"
      style={{
        background: 'linear-gradient(135deg, #0F3356 0%, #081E34 60%, #0A2A1A 100%)',
      }}
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.div variants={fadeInUp}>
              <SectionLabel text="What Representation Means" light={true} />
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="mt-6 font-display text-[52px] leading-[1.05] tracking-[-0.02em] font-[600] text-white"
            >
              What <span className="italic">Representation</span> Means
            </motion.h2>

            <motion.p variants={fadeInUp} className="mt-5 font-body text-[18px] leading-[1.8] text-[rgba(255,255,255,0.70)] max-w-[520px]">
              Misconi USA is the Representation Controller. We don't list every supplier who applies — we represent the suppliers we select,
              and we select based on readiness, compliance, and procurement alignment.
            </motion.p>

            <motion.ul variants={fadeInUp} className="mt-6 space-y-4">
              {[
                'Suppliers do not choose their representation',
                'Visibility is governed by readiness, not by applications',
                'Representation is assigned by Misconi USA — not by suppliers',
              ].map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <Check size={18} className="text-[var(--alert-green)] mt-1" aria-hidden="true" />
                  <span className="font-body text-[18px] leading-[1.6] text-[rgba(255,255,255,0.85)]">{text}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeInUp} className="mt-10 h-[1px] w-full bg-[rgba(255,255,255,0.10)]" aria-hidden="true" />

            <motion.div variants={fadeInUp} className="mt-10 grid grid-cols-2 gap-10">
              <div>
                <div className="font-heading text-[15px] text-white font-[700]">Active Representation</div>
                <div className="font-display text-[60px] leading-[1.0] text-[var(--gold)] mt-3">{counts.active}</div>
              </div>
              <div>
                <div className="font-heading text-[15px] text-white font-[700]">Representation Available</div>
                <div className="font-display text-[60px] leading-[1.0] text-[var(--gold)] mt-3">{counts.available}</div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12">
              <Button variant="ghost" to="/representation" withArrow={false}>
                Learn About Our Representation Model
              </Button>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}>
            <RepresentationDiagram theme="dark" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ReadinessOverviewSection() {
  const fadeInUp = fadeInUpVariants();
  const stagger = staggerVariants();

  return (
    <section className="bg-white py-[120px]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <motion.div variants={fadeInUp}>
            <SectionLabel text="Supplier Readiness" light={false} />
          </motion.div>

          <motion.h2 variants={fadeInUp} className="mt-6 font-display text-[52px] leading-[1.05] tracking-[-0.02em] font-[600]">
            How Supplier Readiness Works
          </motion.h2>

          <motion.p variants={fadeInUp} className="mt-4 font-body text-[18px] leading-[1.7] text-[var(--text-secondary)]">
            Readiness is the gate. Only suppliers who meet strict standards appear in our network.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-[28px]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
        >
          <ReadinessLevelCard
            level="LEVEL_1"
            levelNumber="1"
            title="Identity Verified"
            description="Supplier has completed intake and basic verification."
            color="#9E9E9E"
          />
          <ReadinessLevelCard
            level="LEVEL_2"
            levelNumber="2"
            title="Activation Ready"
            description="Supplier is subscription-enabled and documentation-verified."
            color="#2196F3"
          />
          <ReadinessLevelCard
            level="LEVEL_3"
            levelNumber="3"
            title="Representation Eligible"
            description="Supplier is fully readiness-approved and eligible for representation."
            color="#00C853"
          />
        </motion.div>

        <div className="mt-14 flex justify-center">
          <Button variant="secondary" to="/readiness" withArrow>
            Learn More About Readiness
          </Button>
        </div>
      </div>
    </section>
  );
}

function WhyRepresentationMattersSection() {
  const fadeInUp = fadeInUpVariants();
  const stagger = staggerVariants();

  return (
    <section className="bg-[var(--surface-subtle)] py-[100px]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.div variants={fadeInUp}>
              <SectionLabel text="Why Representation Matters" light={false} />
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-6">
              <div
                className="font-display italic text-[40px] leading-[1.1] tracking-[-0.02em] text-[var(--compliance-blue-dark)]"
              >
                "We don't just list suppliers. We stand behind them."
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-6 font-body text-[16px] leading-[1.8] text-[var(--text-secondary)] space-y-4">
              <p>
                Every supplier on MisconiUSADistribution.com has been validated, classified, and approved by Misconi USA's internal readiness engines.
                This isn't a marketplace — it's a curated network.
              </p>
              <p>
                Our dual-track intake model separates supplier leads from the suppliers we actively represent, ensuring procurement teams connect only with organizations that meet our standards.
              </p>
              <p>
                Readiness-gated visibility means if a supplier fails any threshold, they disappear from the surface automatically. No manual curation needed.
              </p>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <div className="flex flex-col gap-7">
              {[
                {
                  title: 'Compliance-First',
                  body: 'Verified docs, clean records',
                  icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 12l2 2 4-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                },
                {
                  title: 'Performance-Driven',
                  body: 'Score thresholds required',
                  icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path d="M4 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M8 15v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M12 15V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M16 15V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  title: 'Network-Connected',
                  body: 'Matched by readiness and intent',
                  icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
                      <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="2" />
                      <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="2" />
                      <path d="M8.2 10.5l7-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M8.2 13.5l7 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  title: 'Quality-Guaranteed',
                  body: 'Representation approval or nothing',
                  icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2l2.8 6.7L22 10l-5 4.3 1.5 7L12 18.7 5.5 21.3 7 14.3 2 10l7.2-1.3L12 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                },
              ].map((stat) => (
                <motion.div
                  key={stat.title}
                  variants={fadeInUp}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-4"
                >
                  <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0 text-[var(--alert-green)]">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="font-heading text-[15px] font-[700] text-[var(--text-primary)]">{stat.title}</div>
                    <div className="mt-1 font-body text-[13px] leading-[1.7] text-[var(--text-muted)]">{stat.body}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const fadeInUp = fadeInUpVariants();
  return (
    <section className="bg-[var(--compliance-blue-xdark)] py-[120px]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={staggerVariants()}>
            <motion.div variants={fadeInUp}>
              <SectionLabel text="What Our Network Says" light={true} />
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-10">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-120px' }}>
            <TestimonialCarousel
              testimonials={[
                {
                  quote:
                    "Misconi USA's representation model is unlike anything in the industry. Our visibility increased substantially once we achieved Level 3.",
                  name: 'Sarah Mitchell',
                  role: 'VP of Business Development',
                  company: 'Pinnacle Industrial',
                },
                {
                  quote:
                    'The readiness framework gave us a clear pathway. We knew exactly what we needed to achieve before we could be represented.',
                  name: 'James Thornton',
                  role: 'Director of Procurement',
                  company: 'BlueLine Manufacturing',
                },
                {
                  quote:
                    "Working through the distribution network connected us with procurement teams we couldn't have reached independently.",
                  name: 'Patricia Okafor',
                  role: 'CEO',
                  company: 'Coastal Food Group',
                },
                {
                  quote:
                    'The two-tier supplier model means procurement teams trust what they find here. That trust is invaluable.',
                  name: 'David Chen',
                  role: 'Supply Chain Director',
                  company: 'Meridian Corp',
                },
              ]}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FAQPreviewSection() {
  const fadeInUp = fadeInUpVariants();

  const homeFaqs = [
    {
      q: 'How do suppliers appear on MisconiUSADistribution.com?',
      a: 'Suppliers appear only when they have passed all readiness requirements, including a qualifying readiness score, clean risk classification, valid documentation, and Surface Activation approval. Misconi USA\'s internal engines govern this automatically.',
    },
    {
      q: 'Can any supplier submit to appear here?',
      a: 'Supplier leads may submit through our intake process, but appearance on the distribution site is never guaranteed. Only suppliers who achieve the required readiness thresholds and receive representation approval from Misconi USA will be visible.',
    },
    {
      q: 'What is Readiness Level 3?',
      a: 'Readiness Level 3 means a supplier is fully validated, documentation-complete, and eligible for active representation by Misconi USA. It is the highest public-safe readiness designation available.',
    },
    {
      q: 'Does Misconi USA represent all listed suppliers?',
      a: 'No. Representation status varies. Some suppliers are Actively Represented, some have Limited Representation, and some have Representation Available. Each supplier\'s profile displays their current status.',
    },
    {
      q: 'How are suppliers matched with buyers?',
      a: 'Matching is governed by our internal engines based on readiness score and intent. Neither suppliers nor buyers choose their matches — the system assigns based on qualification.',
    },
    {
      q: 'Do suppliers upload their own products here?',
      a: 'No. Products are not displayed on this site. MisconiUSADistribution.com is a supplier visibility platform, not a product catalog.',
    },
  ];

  return (
    <section className="bg-white py-[100px]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <SectionLabel text="Frequently Asked Questions" light={false} />
            <div className="mt-6 font-display text-[52px] leading-[1.05] tracking-[-0.02em] font-[600]">Frequently Asked Questions</div>
            <div className="mt-4 font-body text-[18px] leading-[1.7] text-[var(--text-secondary)] max-w-[520px]">
              Quick answers about how our supplier network and representation model work.
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button variant="primary" to="/faq" withArrow>
                View All FAQs
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <FAQAccordion items={homeFaqs} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section
      className="relative py-[120px]"
      style={{
        background: 'linear-gradient(135deg, #1A4C7C 0%, #0F3356 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-10 left-10 w-[240px] h-[240px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,168,87,0.25), transparent 60%)' }}
        />
        <div
          className="absolute top-40 right-10 w-[200px] h-[200px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,168,107,0.18), transparent 55%)' }}
        />
        <div
          className="absolute bottom-[-80px] right-[-40px] font-display text-[96px] font-[600] opacity-[0.04] text-[var(--compliance-blue-dark)]"
          style={{ transform: 'rotate(-8deg)' }}
        >
          MISCONI USA
        </div>
      </div>

      <div className="relative mx-auto max-w-[780px] px-6 md:px-12 text-center">
        <SectionLabel text="Ready to Connect with America's Supplier Network?" light={true} />
        <h2 className="mt-8 font-display text-[40px] leading-[1.05] tracking-[-0.02em] font-[600] text-white">
          Ready to Connect with
          <br />
          America's Supplier Network?
        </h2>
        <p className="mt-4 font-body text-[20px] leading-[1.7] text-[rgba(255,255,255,0.75)]">
          Contact our Representation Team to learn how readiness-approved suppliers and procurement teams connect through Misconi USA's governed network.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button variant="ghost" to="/contact" withArrow={false}>
            Contact Representation Team
          </Button>
          <Button variant="ghost" to="/suppliers" withArrow={false}>
            Explore Suppliers
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setCats(categories);
      setLoaded(true);
    }, 220);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div>
      <Hero />
      <StatsTicker />

      {loaded ? (
        <>
          <CategoriesSection categories={cats} />
          <FeaturedSuppliersSection />
          <RepresentationOverviewSection />
          <ReadinessOverviewSection />
          <WhyRepresentationMattersSection />
          <TestimonialsSection />
          <FAQPreviewSection />
          <FinalCTASection />
        </>
      ) : (
        <div className="bg-white py-[120px]">
          <div className="mx-auto max-w-[1280px] px-6 md:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[240px] rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--off-white-2)] animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

