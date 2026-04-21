'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Linkedin, Twitter } from 'lucide-react';
import { categories as categoriesData } from '../../data/categories.js';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function WhiteLogo() {
  return (
    <div className="flex flex-col leading-none min-w-0">
      <span className="font-heading text-[15px] font-[800] text-white tracking-[-0.03em] whitespace-normal break-words md:whitespace-nowrap md:break-normal leading-none">
        <span style={{ fontWeight: 800 }}>MisconiUSA</span>
        <strong style={{ fontWeight: 400 }}>Distribution</strong>
        <span className="font-[700] text-[var(--alert-green)]">.com</span>
      </span>
      <span className="font-body text-[8px] tracking-[0.12em] uppercase text-[rgba(255,255,255,0.40)] mt-1 font-[500] whitespace-nowrap">
        Supplier Representation Network
      </span>
    </div>
  );
}

export default function Footer() {
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
        <div className="grid grid-cols-1 gap-[36px] md:grid-cols-2 md:gap-x-[32px] md:gap-y-[40px] lg:grid-cols-[280px_200px_200px_280px] lg:gap-[48px] lg:items-start">
          <div className="max-w-[280px] overflow-hidden flex flex-col gap-[16px]">
            <WhiteLogo />
            <p className="text-[rgba(255,255,255,0.55)] text-[13px] leading-[1.6] max-w-[240px] mt-1">
              A procurement-aligned, readiness-gated supplier directory for Misconi USA representation.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="h-[36px] w-[36px] rounded-[8px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.10)] flex items-center justify-center text-[rgba(255,255,255,0.60)] transition-all duration-[180ms] ease-[cubic-bezier(0.22, 1, 0.36, 1)] hover:bg-[rgba(255,255,255,0.14)] hover:text-white hover:border-[rgba(255,255,255,0.22)]"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="h-[36px] w-[36px] rounded-[8px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.10)] flex items-center justify-center text-[rgba(255,255,255,0.60)] transition-all duration-[180ms] ease-[cubic-bezier(0.22, 1, 0.36, 1)] hover:bg-[rgba(255,255,255,0.14)] hover:text-white hover:border-[rgba(255,255,255,0.22)]"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.30)] font-heading font-[700] mb-4">
              Categories
            </div>
            <ul className="mt-0">
              {categoriesData.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/categories/${c.id}`}
                    className="font-body text-[14px] font-[400] text-[rgba(255,255,255,0.60)] leading-[2] transition-colors duration-[180ms] ease-[cubic-bezier(0.22, 1, 0.36, 1)] hover:text-[var(--alert-green)]"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.30)] font-heading font-[700] mb-4">
              Quick Links
            </div>
            <ul className="mt-0">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    href={l.to}
                    className="font-body text-[14px] font-[400] text-[rgba(255,255,255,0.60)] leading-[2] transition-colors duration-[180ms] ease-[cubic-bezier(0.22, 1, 0.36, 1)] hover:text-[var(--alert-green)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.30)] font-heading font-[700] mb-4">
              Contact
            </div>
            <div className="mt-0 text-[rgba(255,255,255,0.60)] text-[14px] leading-[1.8]">
              <div>Email: <a className="hover:text-[var(--alert-green)] transition-colors" href="mailto:info@misconiusa.com">info@misconiusa.com</a></div>
              <div>Phone: <a className="hover:text-[var(--alert-green)] transition-colors" href="tel:+10000000000">+1 (000) 000-0000</a></div>
              <div>Office Hours: Mon - Fri, 9:00 AM - 5:00 PM</div>
            </div>

            <div className="mt-7">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.30)] font-heading font-[700] mb-4">
                Newsletter
              </div>
              <form
                className="mt-0 flex flex-col gap-3"
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

        <div className="mt-12 border-t border-[rgba(255,255,255,0.07)] pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center flex-wrap gap-2 md:gap-3">
            <div className="font-body text-[12px] text-[rgba(255,255,255,0.35)] leading-[1.6] text-center md:text-left">
              © 2024 Misconi USA Distribution. All rights reserved.
            </div>

            <div className="font-body text-[12px] text-[rgba(255,255,255,0.35)] leading-[1.6] flex flex-wrap items-center justify-center md:justify-end text-center md:text-right">
              <a href="#" className="hover:text-[rgba(255,255,255,0.70)] transition-colors">
                Privacy Policy
              </a>
              <span className="text-[rgba(255,255,255,0.20)] mx-[10px]">·</span>
              <a href="#" className="hover:text-[rgba(255,255,255,0.70)] transition-colors">
                Terms of Use
              </a>
              <span className="text-[rgba(255,255,255,0.20)] mx-[10px]">·</span>
              <a href="#" className="hover:text-[rgba(255,255,255,0.70)] transition-colors">
                Compliance Notice
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

