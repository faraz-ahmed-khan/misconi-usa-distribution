import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function WhiteLogo() {
  return (
    <div className="flex flex-col leading-none">
      <span className="font-heading text-[17px] font-[800] text-white">
        MisconiUSA
        <strong className="font-[800]">Distribution</strong>
        <span className="text-[var(--alert-green)]">.com</span>
      </span>
      <span className="font-body text-[9px] tracking-[0.14em] uppercase text-[rgba(255,255,255,0.60)] mt-1">
        Supplier Representation Network
      </span>
    </div>
  );
}

export default function Footer({ categories = [] }) {
  const quickLinks = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/suppliers', label: 'Suppliers' },
      { to: '/categories', label: 'Categories' },
      { to: '/representation', label: 'Representation' },
      { to: '/readiness', label: 'Readiness' },
      { to: '/faq', label: 'FAQ' },
      { to: '/contact', label: 'Contact' },
    ],
    []
  );

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  return (
    <footer className="bg-[var(--compliance-blue-xdark)] pt-16 pb-10">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <WhiteLogo />
            <p className="mt-4 text-[rgba(255,255,255,0.60)] text-[15px] leading-[1.7] max-w-[260px]">
              A procurement-aligned, readiness-gated supplier directory for Misconi USA representation.
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-[rgba(255,255,255,0.70)] hover:text-[var(--alert-green)] transition-colors text-[14px]"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="text-[rgba(255,255,255,0.70)] hover:text-[var(--alert-green)] transition-colors text-[14px]"
              >
                X
              </a>
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.35)] font-heading font-[700]">
              Supplier Categories
            </div>
            <ul className="mt-4 space-y-3">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/categories/${c.id}`}
                    className="text-[rgba(255,255,255,0.60)] hover:text-[var(--alert-green)] transition-colors text-[14px]"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              {!categories.length && (
                <li className="text-[rgba(255,255,255,0.45)] text-[14px]">
                  Categories will appear once loaded.
                </li>
              )}
            </ul>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.35)] font-heading font-[700]">
              Quick Links
            </div>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-[rgba(255,255,255,0.60)] hover:text-[var(--alert-green)] transition-colors text-[14px]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.35)] font-heading font-[700]">
              Contact
            </div>
            <div className="mt-4 text-[rgba(255,255,255,0.60)] text-[14px] leading-[1.8]">
              <div>Email: <a className="hover:text-[var(--alert-green)] transition-colors" href="mailto:info@misconiusa.com">info@misconiusa.com</a></div>
              <div>Phone: <a className="hover:text-[var(--alert-green)] transition-colors" href="tel:+10000000000">+1 (000) 000-0000</a></div>
              <div>Office Hours: Mon - Fri, 9:00 AM - 5:00 PM</div>
            </div>

            <div className="mt-7">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.35)] font-heading font-[700]">
                Newsletter
              </div>
              <form
                className="mt-4 flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email.trim()) return;
                  setStatus('success');
                }}
              >
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder="Email address"
                  className="h-[48px] px-4 rounded-[var(--radius-md)] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.14)] text-white placeholder:text-[rgba(255,255,255,0.50)] outline-none focus:border-[rgba(0,168,107,0.45)] transition-colors"
                />
                <button
                  type="submit"
                  className={cx(
                    'h-[48px] rounded-[var(--radius-md)] px-5 font-heading text-[12px] tracking-[0.08em] uppercase border transition-colors',
                    'bg-[rgba(255,255,255,0.10)] border-[rgba(255,255,255,0.22)] text-white hover:bg-[rgba(255,255,255,0.18)]'
                  )}
                >
                  {status === 'success' ? 'Subscribed' : 'Sign Up'}
                </button>
                {status === 'success' && (
                  <div className="text-[var(--alert-green)] text-[13px]">
                    Thanks for subscribing.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-[rgba(255,255,255,0.08)] pt-6">
          <div className="text-[rgba(255,255,255,0.60)] text-[13px] leading-[1.6] flex flex-wrap items-center gap-3">
            <span>© 2024 Misconi USA Distribution. All rights reserved.</span>
            <span className="text-[rgba(255,255,255,0.40)]">|</span>
            <a href="#" className="hover:text-[var(--alert-green)] transition-colors">
              Privacy Policy
            </a>
            <span className="text-[rgba(255,255,255,0.40)]">|</span>
            <a href="#" className="hover:text-[var(--alert-green)] transition-colors">
              Terms of Use
            </a>
            <span className="text-[rgba(255,255,255,0.40)]">|</span>
            <a href="#" className="hover:text-[var(--alert-green)] transition-colors">
              Compliance Notice
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

