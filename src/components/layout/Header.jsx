import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../ui/SearchBar';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Logo({ scrolled }) {
  const mainColor = scrolled ? '#0F3356' : '#FFFFFF';
  const subtitleColor = scrolled ? '#7A8FA6' : 'rgba(255,255,255,0.50)';

  return (
    <div className="flex flex-col gap-[2px] leading-none cursor-pointer max-w-[200px] overflow-hidden flex-shrink min-w-0 md:max-w-none md:overflow-visible">
      <span className="logo-main flex items-baseline gap-0 font-heading text-[17px] tracking-[-0.02em] leading-none">
        <span style={{ color: mainColor, fontWeight: 800 }}>MisconiUSA</span>
        <span style={{ color: mainColor, fontWeight: 400 }}>Distribution</span>
        <span style={{ color: 'var(--alert-green)', fontWeight: 700 }}>.com</span>
      </span>
      <span
        className="logo-sub font-body text-[9px] tracking-[0.14em] uppercase font-[500]"
        style={{ color: subtitleColor }}
      >
        Supplier Representation Network
      </span>
    </div>
  );
}

function NavItem({ to, label, scrolled, onNavigate }) {
  const hoverBg = scrolled ? '#EEF4FB' : 'rgba(255,255,255,0.08)';
  const baseClass = scrolled ? 'text-[var(--slate-gray)]' : 'text-[rgba(255,255,255,0.80)]';
  const hoverClass = scrolled ? 'group-hover:text-[var(--compliance-blue)]' : 'group-hover:text-white';
  const activeTextClass = scrolled ? 'text-[var(--compliance-blue)]' : 'text-white';

  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className="group relative overflow-hidden px-[12px] py-[8px] rounded-[6px] transition-colors focus-visible:outline-none"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-200 rounded-[6px]"
        style={{ backgroundColor: hoverBg }}
      />
      <span
        className={cx(
          'relative z-10 font-heading text-[13px] font-[600] tracking-[0.03em] transition-colors',
          baseClass,
          hoverClass,
          isActive && activeTextClass
        )}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-[12px] right-[12px] bottom-0 h-[2px] bg-[var(--alert-green)]"
        style={{ opacity: isActive ? 1 : 0, transition: 'opacity 180ms var(--ease)' }}
      />
    </NavLink>
  );
}

export default function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/suppliers', label: 'Suppliers' },
      { to: '/categories', label: 'Categories' },
      { to: '/representation', label: 'Representation' },
      { to: '/readiness', label: 'Readiness' },
      { to: '/contact', label: 'Contact' },
    ],
    []
  );

  useEffect(() => {
    const forceScrolled = /^\/suppliers\/[^/]+$/.test(location.pathname);
    const onScroll = () => setScrolled(window.scrollY > 60 || forceScrolled);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const hamburgerColor = scrolled ? '#4A4A4A' : 'rgba(255,255,255,0.90)';
  const searchColor = scrolled ? '#4A4A4A' : 'rgba(255,255,255,0.70)';
  const desktopCtaBg = 'var(--compliance-blue)';

  return (
    <>
      <header
        className={cx('misconi-header fixed top-0 left-0 w-full z-[100] transition-all', scrolled && 'scrolled')}
        style={{ transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        <div className="misconi-header-inner mx-auto max-w-[1280px] px-5 md:px-12 flex items-center justify-between flex-nowrap w-full">
          <NavLink
            to="/"
            className="relative z-20"
            onClick={() => setMobileOpen(false)}
            style={{ flexShrink: 0 }}
          >
            <Logo scrolled={scrolled} />
          </NavLink>

          <nav className="hidden md:flex items-center gap-[4px]">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                scrolled={scrolled}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0 ml-[12px] md:ml-0 md:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="header-search-btn h-[40px] w-[40px] rounded-[var(--radius-sm)] border border-[var(--border-light)] bg-transparent hover:bg-[var(--border-light)] transition-colors flex items-center justify-center self-center"
              aria-label="Open search"
              style={{ color: searchColor }}
            >
              <Search size={20} />
            </button>

            <NavLink
              to="/suppliers"
              className="hidden md:inline-flex items-center justify-center gap-0 select-none rounded-[8px] px-[20px] py-[11px] font-heading text-[12px] tracking-[0.08em] uppercase font-[700] text-white hover:bg-[var(--compliance-blue-light)] hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(26,76,124,0.30)]"
              style={{
                background: desktopCtaBg,
                border: '1.5px solid rgba(255,255,255,0.30)',
                transition: 'all 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              aria-label="Explore suppliers"
            >
              <span>EXPLORE SUPPLIERS</span>
              <ArrowRight size={14} className="ml-[6px]" />
            </NavLink>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="hamburger-btn md:hidden h-[40px] w-[40px] rounded-[6px] border border-transparent bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] transition-colors flex items-center justify-center self-center"
              aria-label="Open navigation menu"
              style={{ color: hamburgerColor }}
            >
              <span className="flex flex-col items-center justify-center gap-[4px]" aria-hidden="true">
                <span style={{ width: 20, height: 2, backgroundColor: hamburgerColor }} />
                <span style={{ width: 20, height: 2, backgroundColor: hamburgerColor }} />
                <span style={{ width: 20, height: 2, backgroundColor: hamburgerColor }} />
              </span>
            </button>
          </div>
        </div>

        <style>
          {`
            .misconi-header.scrolled {
              background: rgba(255,255,255,0.96);
              backdrop-filter: blur(24px);
              box-shadow: 0 1px 0 rgba(26,76,124,0.10);
              padding: 14px 0;
            }
            .misconi-header:not(.scrolled) {
              background: transparent;
              padding: 24px 0;
            }

            @media (max-width: 768px) {
              .misconi-header-inner {
                padding-left: 20px;
                padding-right: 20px;
              }
              .logo-main {
                font-size: 13px !important;
                letter-spacing: -0.02em;
                flex-wrap: wrap;
              }
              .logo-sub {
                font-size: 8px !important;
                letter-spacing: 0.08em !important;
              }
            }

            @media (max-width: 399px) {
              .misconi-header-inner {
                padding-left: 14px;
                padding-right: 14px;
              }
              .logo-main {
                flex-wrap: wrap;
              }
            }

            @media (max-width: 480px) {
              .logo-main {
                font-size: 13px !important;
              }
              .logo-sub {
                font-size: 8px !important;
                letter-spacing: 0.08em !important;
              }
            }
            @media (max-width: 379px) {
              .logo-sub {
                display: none !important;
              }
              .logo-main {
                font-size: 12px !important;
                flex-wrap: wrap;
              }
            }

            @media (max-width: 380px) {
              .hamburger-btn {
                width: 36px !important;
                height: 36px !important;
              }
            }

            @media (max-width: 480px) {
              .header-search-btn {
                display: none !important;
              }
            }
          `}
        </style>
      </header>

      <SearchBar
        variant="overlay"
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSubmit={(q) => {
          const query = String(q || '').trim();
          const target = `/search${query ? `?query=${encodeURIComponent(query)}` : ''}`;
          navigate(target);
          setSearchOpen(false);
        }}
      />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[180] bg-[rgba(8,30,52,0.98)] backdrop-blur-[20px] flex"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-full px-6 py-20 mx-auto max-w-[720px]">
              <div className="flex items-start justify-between">
                <div className="text-white">
                  <Logo scrolled={false} />
                </div>
                <button
                  type="button"
                  className="h-[44px] w-[44px] rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <span style={{ color: 'rgba(255,255,255,0.60)', fontSize: 26, lineHeight: 1 }}>×</span>
                </button>
              </div>

              <div className="mt-10 flex flex-col items-center gap-[28px]">
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.06 }}
                >
                  <div className="flex flex-col items-center gap-[28px]">
                    {navItems.map((item, idx) => (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: idx * 0.06 }}
                      >
                        <NavLink
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className="font-heading text-[32px] font-[700] text-white tracking-[0.02em] block text-center"
                        >
                          {item.label}
                        </NavLink>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <div className="w-full mt-[10px]">
                  <NavLink
                    to="/suppliers"
                    onClick={() => setMobileOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-[6px] select-none rounded-[8px] px-[20px] py-[11px] font-heading text-[12px] tracking-[0.08em] uppercase font-[700] text-white"
                    style={{
                      background: 'var(--compliance-blue)',
                      border: '1.5px solid rgba(255,255,255,0.30)',
                      transition: 'all 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                    aria-label="Explore suppliers"
                  >
                    <span>EXPLORE SUPPLIERS</span>
                    <ArrowRight size={14} />
                  </NavLink>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

