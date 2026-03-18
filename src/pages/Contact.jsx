import { motion } from 'framer-motion';
import React from 'react';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import ContactForm from '../components/forms/ContactForm.jsx';

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

export default function ContactPage() {
  const fadeInUp = fadeInUpVariants();

  return (
    <div className="bg-[var(--off-white)]">
      <header className="bg-[var(--compliance-blue-xdark)] text-white">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 pt-[140px] pb-[70px]">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
          <h1 className="font-display text-white text-[56px] leading-[1.0]">Contact</h1>
          <p className="mt-4 font-body text-[18px] leading-[1.7] text-white/70 max-w-[720px]">
            Contact Misconi USA to connect procurement teams with readiness-approved suppliers.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }} variants={fadeInUp} className="lg:col-span-7">
            <div className="font-display text-[40px] leading-[1.05] tracking-[-0.02em] font-[600] text-[var(--text-primary)]">
              Get In Touch
            </div>
            <div className="mt-4 font-body text-[16px] leading-[1.8] text-[var(--text-secondary)] max-w-[620px]">
              Send your message and our representation team will follow up with next steps.
            </div>

            <div className="mt-8">
              <ContactForm />
            </div>
          </motion.div>

          <motion.aside initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-120px' }} variants={fadeInUp} className="lg:col-span-5">
            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-md)] p-7 shadow-sm">
              <div className="font-heading text-[16px] font-[700] text-[var(--text-primary)]">Direct Contact</div>
              <div className="mt-5 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-[36px] h-[36px] rounded-[var(--radius-sm)] bg-[rgba(26,76,124,0.08)] border border-[rgba(26,76,124,0.18)] text-[var(--compliance-blue)] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 4h16v16H4V4Z" stroke="currentColor" strokeWidth="2" />
                      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="font-body text-[15px] leading-[1.6] text-[var(--text-secondary)]">
                    <a className="hover:text-[var(--alert-green)] transition-colors" href="mailto:info@misconiusa.com">
                      info@misconiusa.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-[36px] h-[36px] rounded-[var(--radius-sm)] bg-[rgba(26,76,124,0.08)] border border-[rgba(26,76,124,0.18)] text-[var(--compliance-blue)] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.52a2 2 0 0 1-.45 2.11L7.9 9.91a16 16 0 0 0 6 6l1.56-1.29a2 2 0 0 1 2.11-.45c.82.24 1.66.42 2.52.54A2 2 0 0 1 22 16.92Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="font-body text-[15px] leading-[1.6] text-[var(--text-secondary)]">
                    <a className="hover:text-[var(--alert-green)] transition-colors" href="tel:+10000000000">
                      +1 (000) 000-0000
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-[36px] h-[36px] rounded-[var(--radius-sm)] bg-[rgba(26,76,124,0.08)] border border-[rgba(26,76,124,0.18)] text-[var(--compliance-blue)] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 21s7-4.5 7-11a7 7 0 0 0-14 0c0 6.5 7 11 7 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="font-body text-[15px] leading-[1.6] text-[var(--text-secondary)]">
                    100 Procurement Ave, Suite 200, United States
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-[var(--border-light)] pt-6">
                <div className="font-heading text-[16px] font-[700] text-[var(--text-primary)]">Office Hours</div>
                <div className="mt-3 font-body text-[15px] leading-[1.7] text-[var(--text-secondary)]">
                  Mon - Fri, 9:00 AM - 5:00 PM
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white border border-[var(--border)] rounded-[var(--radius-md)] p-7 shadow-sm">
              <div className="font-heading text-[16px] font-[700] text-[var(--text-primary)]">Location</div>
              <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--border-light)] overflow-hidden bg-[linear-gradient(135deg,rgba(26,76,124,0.10),rgba(0,168,107,0.08))]">
                <div className="relative h-[180px]">
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(26,76,124,0.25) 0, transparent 55%), radial-gradient(circle at 70% 60%, rgba(0,168,107,0.18) 0, transparent 50%)' }} />
                  <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(90deg, rgba(26,76,124,0.10) 1px, transparent 1px), linear-gradient(rgba(26,76,124,0.10) 1px, transparent 1px)' , backgroundSize: '24px 24px' }} />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 21s7-4.5 7-11a7 7 0 0 0-14 0c0 6.5 7 11 7 11Z" stroke="var(--alert-green)" strokeWidth="2" strokeLinejoin="round" />
                      <circle cx="12" cy="10" r="2.2" fill="var(--alert-green)" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mt-4 font-body text-[15px] leading-[1.7] text-[var(--text-secondary)]">
                Reach out to arrange a meeting aligned to procurement coordination schedules.
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

