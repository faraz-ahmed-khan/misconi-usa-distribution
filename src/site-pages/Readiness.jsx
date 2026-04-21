import { motion } from 'framer-motion';
import React from 'react';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import SectionLabel from '../components/ui/SectionLabel.jsx';
import Button from '../components/ui/Button.jsx';
import ReadinessLevelCard from '../components/readiness/ReadinessLevelCard.jsx';
import { readinessLevels } from '../data/readiness.js';

function fadeInUpVariants() {
  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

export default function ReadinessPage() {
  const fadeInUp = fadeInUpVariants();

  const levelDetails = [
    {
      level: 'LEVEL_1',
      number: '1',
      color: '#9E9E9E',
      title: 'Identity Verified',
      description:
        'Supplier has completed intake and basic verification. Identity is confirmed, initial documentation reviewed, and classification assigned.',
      emphasis: 'identity',
    },
    {
      level: 'LEVEL_2',
      number: '2',
      color: '#2196F3',
      title: 'Activation Ready',
      description:
        'Supplier is subscription-enabled and documentation-verified. Routing begins, matching is initiated, and pre-qualification is active.',
      emphasis: 'activation',
    },
    {
      level: 'LEVEL_3',
      number: '3',
      color: '#00C853',
      title: 'Representation Eligible',
      description:
        'Supplier is fully readiness-approved and eligible for representation. All compliance thresholds met, classification confirmed, surfaces activated.',
      emphasis: 'representation',
    },
  ];

  return (
    <div className="bg-white">
      <header className="bg-[var(--compliance-blue-xdark)] text-white">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 pt-[140px] pb-[80px]">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Readiness' }]} />
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-white text-[56px] leading-[1.0]">
            Readiness
          </motion.h1>
          <p className="mt-4 font-body text-[18px] leading-[1.7] text-white/70 max-w-[720px]">
            Readiness is the gate. Only suppliers who meet strict standards appear in our network.
          </p>
        </div>
      </header>

      <section className="py-[120px] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }} variants={fadeInUp}>
            <SectionLabel text="The Three Levels" light={false} />
            <h2 className="mt-6 font-display text-[48px] leading-[1.05] tracking-[-0.02em] font-[600] text-[var(--text-primary)]">
              Readiness levels shape who is visible.
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-[28px]">
            {levelDetails.map((l) => (
              <motion.div
                key={l.level}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--off-white-2)] p-8"
                style={{ borderLeft: `4px solid ${l.color}` }}
              >
                <div className="font-display text-[64px] leading-[1.0] text-[var(--text-primary)] opacity-10">{l.number}</div>
                <div className="mt-2 font-heading text-[18px] font-[700] text-[var(--text-primary)]">{l.title}</div>
                <div className="mt-3 font-body text-[15px] text-[var(--text-secondary)] leading-[1.7]">{l.description}</div>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full px-3 py-1 border" style={{ backgroundColor: `${l.color}20`, borderColor: `${l.color}40`, color: l.color }}>
                  <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: l.color }} aria-hidden="true" />
                  <span className="font-heading text-[10px] tracking-[0.12em] uppercase">LEVEL {l.number}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {levelDetails.map((l, idx) => {
        const left = idx % 2 === 0;
        return (
          <section key={l.level} className="py-[120px] bg-[var(--surface-subtle)]">
            <div className="mx-auto max-w-[1280px] px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-120px' }}
                  variants={fadeInUp}
                  className={left ? 'lg:order-1' : 'lg:order-2'}
                >
                  <SectionLabel text={`Level ${l.number}`} light={false} />
                  <h2 className="mt-6 font-display text-[52px] leading-[1.05] tracking-[-0.02em] font-[600] text-[var(--text-primary)]">
                    {l.title}
                  </h2>
                  <p className="mt-4 font-body text-[18px] leading-[1.8] text-[var(--text-secondary)]">
                    {l.description}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3 items-center">
                    <div className="inline-flex items-center rounded-full border border-[var(--border-light)] bg-white px-4 py-[10px] font-heading text-[12px] tracking-[0.08em] uppercase text-[var(--compliance-blue)]">
                      Emphasis: {l.emphasis}
                    </div>
                    <div className="inline-flex items-center rounded-full border border-[var(--border-light)] bg-white px-4 py-[10px] font-heading text-[12px] tracking-[0.08em] uppercase text-[var(--alert-green)]">
                      Readiness gate
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-120px' }}
                  className={left ? 'lg:order-2' : 'lg:order-1'}
                >
                  <ReadinessLevelCard
                    level={l.level}
                    levelNumber={l.number}
                    title={l.title}
                    description={l.description}
                    color={l.color}
                  />
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="py-[120px] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }} variants={fadeInUp}>
            <SectionLabel text="Why Readiness Matters" light={false} />
            <h2 className="mt-6 font-display text-[48px] leading-[1.05] tracking-[-0.02em] font-[600] text-[var(--text-primary)]">
              Compliance, visibility, representation.
            </h2>
            <p className="mt-4 font-body text-[18px] leading-[1.8] text-[var(--text-secondary)] max-w-[720px]">
              Readiness gating ensures the directory only surfaces suppliers that meet strict thresholds. Visibility updates automatically as governance requirements are met.
            </p>
          </motion.div>

          <div className="mt-12 flex justify-center">
            <Button variant="secondary" to="/suppliers" withArrow>
              Explore Readiness-Approved Suppliers
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

