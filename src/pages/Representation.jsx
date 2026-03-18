import { motion } from 'framer-motion';
import React from 'react';
import { Check } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import Button from '../components/ui/Button.jsx';
import SectionLabel from '../components/ui/SectionLabel.jsx';
import RepresentationDiagram from '../components/representation/RepresentationDiagram.jsx';

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

function RepresentationFlowDiagram() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      <style>{`
        @keyframes dashFlow2 { to { stroke-dashoffset: -260; } }
      `}</style>
      <svg viewBox="0 0 680 420" className="w-full h-auto" role="img" aria-label="Representation chain diagram">
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

export default function RepresentationPage() {
  const fadeInUp = fadeInUpVariants();

  return (
    <div className="bg-white">
      <header className="bg-[var(--compliance-blue-xdark)] text-white">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 pt-[140px] pb-[80px]">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Representation' }]} />
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-white text-[56px] leading-[1.0]">
            Representation
          </motion.h1>
          <p className="mt-4 font-body text-[18px] leading-[1.7] text-white/70 max-w-[720px]">
            Misconi USA controls representation and readiness-gated supplier visibility across the directory.
          </p>
        </div>
      </header>

      <section
        className="py-[140px]"
        style={{
          background: 'linear-gradient(135deg, #0F3356 0%, #081E34 60%, #0A2A1A 100%)',
        }}
      >
        <div className="mx-auto max-w-[1280px] px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }} variants={fadeInUp}>
              <SectionLabel text="What Representation Means" light={true} />
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                className="mt-6 font-display text-[52px] leading-[1.05] tracking-[-0.02em] font-[600] text-white"
              >
                What <span className="italic">Representation</span> Means
              </motion.h2>
              <p className="mt-4 font-body text-[18px] leading-[1.8] text-white/70">
                Misconi USA is the Representation Controller. We represent the suppliers we select, and we select based on readiness, compliance, and procurement alignment.
              </p>

              <ul className="mt-6 space-y-4">
                {[
                  'Suppliers do not choose their representation',
                  'Visibility is governed by readiness, not by applications',
                  'Representation is assigned by Misconi USA — not by suppliers',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-3">
                    <Check size={18} className="text-[var(--alert-green)] mt-1" aria-hidden="true" />
                    <span className="font-body text-[18px] leading-[1.6] text-white/85">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-120px' }}
              variants={fadeInUp}
              className="rounded-[var(--radius-lg)] border border-[rgba(26,76,124,0.22)] bg-[rgba(255,255,255,0.06)] backdrop-blur-[12px] p-6"
            >
              <RepresentationDiagram theme="dark" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-[120px] bg-[var(--surface-subtle)]">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }} variants={fadeInUp}>
            <SectionLabel text="Two Supplier Types" light={false} />
            <h2 className="mt-6 font-display text-[48px] leading-[1.05] tracking-[-0.02em] font-[600] text-[var(--text-primary)]">
              Supplier Leads vs. Representation Suppliers
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-7">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-120px' }} className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-8 border-l-[4px]" style={{ borderLeftColor: 'var(--compliance-blue)' }}>
              <div className="font-heading text-[15px] font-[700] text-[var(--compliance-blue)] tracking-[0.08em] uppercase">Supplier Leads</div>
              <div className="mt-4 font-display text-[28px] leading-[1.1] tracking-[-0.02em] font-[600] text-[var(--text-primary)]">Seeking Opportunities</div>
              <p className="mt-4 font-body text-[16px] leading-[1.8] text-[var(--text-secondary)]">
                Leads enter through MSI pathways. Readiness verification and classification determine if they can progress to representation eligibility.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-120px' }} className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-8 border-l-[4px]" style={{ borderLeftColor: 'var(--alert-green)' }}>
              <div className="font-heading text-[15px] font-[700] text-[var(--alert-green)] tracking-[0.08em] uppercase">Representation Suppliers</div>
              <div className="mt-4 font-display text-[28px] leading-[1.1] tracking-[-0.02em] font-[600] text-[var(--text-primary)]">Actively Surfaced</div>
              <p className="mt-4 font-body text-[16px] leading-[1.8] text-[var(--text-secondary)]">
                Representation suppliers appear on the directory after governed readiness approvals and surface activation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-[120px] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }} variants={fadeInUp}>
            <SectionLabel text="The Representation Process" light={false} />
            <h2 className="mt-6 font-display text-[48px] leading-[1.05] tracking-[-0.02em] font-[600] text-[var(--text-primary)]">
              Intake to Surface Activation
            </h2>
          </motion.div>

          <div className="mt-12 relative pl-6">
            <div className="absolute left-[12px] top-0 bottom-0 w-[2px] bg-[var(--border-light)]" aria-hidden="true" />
            {[
              'Intake',
              'Readiness Engine',
              'Classification',
              'Surface Activation',
              'MisconiUSADistribution.com',
            ].map((step, idx) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 0.45 }}
                className="flex gap-6 items-start mb-8"
              >
                <div className="relative w-[26px]">
                  <div className="w-[12px] h-[12px] rounded-full bg-[var(--alert-green)] absolute left-[-1px] top-[4px]" />
                </div>
                <div>
                  <div className="font-heading text-[16px] font-[700] text-[var(--text-primary)]">{step}</div>
                  <div className="mt-2 font-body text-[14px] leading-[1.7] text-[var(--text-secondary)]">
                    {idx === 0
                      ? 'Supplier leads enter MSI intake pathways.'
                      : idx === 1
                        ? 'Readiness verification determines eligibility progression.'
                        : idx === 2
                          ? 'Classification confirms governance alignment.'
                          : idx === 3
                            ? 'Surface activation prepares directory visibility.'
                            : 'The directory surfaces representation-governed suppliers.'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Button variant="secondary" to="/suppliers">
              Explore Representation-Eligible Suppliers
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

