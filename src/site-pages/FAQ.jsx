import { motion } from 'framer-motion';
import React from 'react';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import FAQAccordion from '../components/faq/FAQAccordion.jsx';
import Button from '../components/ui/Button.jsx';

const groups = [
  {
    title: 'About the Network',
    items: [
      {
        q: 'How do suppliers appear on MisconiUSADistribution.com?',
        a: 'Suppliers appear only when they have passed all readiness requirements, including qualifying verification and surface activation approval. Misconi USA internal engines govern this automatically.',
      },
      {
        q: 'Can any supplier submit to appear here?',
        a: 'Supplier leads may submit through our intake process, but appearance on the distribution site is never guaranteed. Only suppliers who achieve required readiness thresholds and receive representation approval from Misconi USA will be visible.',
      },
      {
        q: 'What is Misconi USA Representation Control?',
        a: 'Representation Control is the governed model that determines which suppliers are surfaced, how they are represented, and how procurement teams trust what they find.',
      },
    ],
  },
  {
    title: 'Supplier Visibility',
    items: [
      {
        q: 'Do suppliers upload their own products here?',
        a: 'No. Products are not displayed on this site. MisconiUSADistribution.com is a supplier visibility platform, not a product catalog.',
      },
      {
        q: 'Does Misconi USA represent all listed suppliers?',
        a: 'No. Representation status varies. Some suppliers are Actively Represented, some have Limited Representation, and others have Representation Available. Each supplier profile displays its current status.',
      },
      {
        q: 'How often does the directory update?',
        a: 'Updates follow readiness and representation governance. Suppliers appear when their readiness status is approved for surface activation and remain visible while they meet governing standards.',
      },
    ],
  },
  {
    title: 'Representation',
    items: [
      {
        q: 'What does representation mean in this directory?',
        a: 'Representation means procurement teams can rely on Misconi USA as the governed control point for qualification, access, and representation-led engagement.',
      },
      {
        q: 'What is the difference between active and limited representation?',
        a: 'Active representation indicates full governed representation across procurement channels. Limited representation indicates representation is restricted to defined categories or regions.',
      },
      {
        q: 'Can representation be initiated by suppliers?',
        a: 'Supplier leads can qualify through intake, but representation assignment is governed by Misconi USA after readiness approval is confirmed.',
      },
    ],
  },
  {
    title: 'Readiness',
    items: [
      {
        q: 'What is Readiness Level 1?',
        a: 'Level 1 means identity verification and basic intake have been completed, with initial documentation review and classification assigned.',
      },
      {
        q: 'What is Readiness Level 2?',
        a: 'Level 2 means activation readiness. The supplier is subscription-enabled and documentation-verified to support governed routing and qualification.',
      },
      {
        q: 'What is Readiness Level 3?',
        a: 'Level 3 means representation eligible. The supplier is fully readiness-approved and eligible for representation under Misconi USA governance.',
      },
      {
        q: 'Why does readiness gating matter?',
        a: 'Readiness gating ensures the directory only surfaces suppliers that meet strict thresholds. If a supplier fails any governing threshold, visibility is updated automatically.',
      },
    ],
  },
  {
    title: 'For Buyers & Procurement',
    items: [
      {
        q: 'How are suppliers matched with buyers?',
        a: 'Matching is governed by internal engines based on qualification and intent. Neither suppliers nor buyers choose matches independently; the system assigns based on governed qualification.',
      },
      {
        q: 'What should procurement teams do first?',
        a: 'Start by reviewing supplier profiles, then contact the representation team for procurement-aligned engagement and governed next steps.',
      },
      {
        q: 'Is this a marketplace?',
        a: 'No. The directory is curated. It is governed by readiness and representation control, not by open marketplace listings.',
      },
      {
        q: 'Does the site display products or opportunities?',
        a: 'No. This site is a supplier visibility and representation platform. Products and opportunities are handled elsewhere in governed procurement workflows.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-white">
      <header className="bg-[var(--compliance-blue-xdark)] text-white">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 pt-[140px] pb-[80px]">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-white text-[56px] leading-[1.0]">
            FAQ
          </motion.h1>
          <p className="mt-4 font-body text-[18px] leading-[1.7] text-white/70 max-w-[720px]">
            Answers about the network, supplier visibility, representation, readiness, and procurement guidance.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-[100px]">
        <div className="grid grid-cols-1 gap-10">
          {groups.map((g) => (
            <section key={g.title} className="bg-[var(--off-white)] border border-[var(--border)] rounded-[var(--radius-lg)] p-8">
              <div className="font-heading text-[16px] font-[700] text-[var(--text-primary)]">{g.title}</div>
              <div className="mt-5">
                <FAQAccordion items={g.items} />
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button variant="primary" to="/contact">
            Contact Representation Team
          </Button>
        </div>
      </div>
    </div>
  );
}

