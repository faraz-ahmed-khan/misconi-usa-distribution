'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

const MotionLink = motion.create(Link);
const MotionAnchor = motion.a;
const MotionButton = motion.button;

export default function Button({
  variant = 'primary',
  type = 'button',
  to,
  href,
  onClick,
  disabled,
  children,
  withArrow,
  ariaLabel,
}) {
  const shouldShowArrow =
    withArrow ?? (variant === 'primary' || variant === 'secondary');

  const base =
    'inline-flex items-center justify-center gap-3 select-none ' +
    'font-heading text-[12px] tracking-[0.08em] uppercase rounded-[var(--radius-sm)] ' +
    'px-[24px] py-[13px] transition-[background-color,border-color,color] duration-200 ' +
    'focus-visible:outline-none';

  const variants = {
    primary:
      'bg-[var(--compliance-blue)] text-white border border-transparent',
    secondary:
      'bg-transparent text-[var(--compliance-blue)] border-[1.5px] border-[var(--compliance-blue)]',
    ghost:
      'bg-[rgba(255,255,255,0.10)] text-[rgba(255,255,255,0.90)] border-[1.5px] border-[rgba(255,255,255,0.22)]',
    text:
      'bg-transparent text-[var(--compliance-blue)] border border-transparent px-0 py-0 tracking-[0.08em] hover:text-[var(--alert-green)]',
  };

  const commonProps = {
    className: cx(base, variants[variant]),
    whileHover:
      variant === 'ghost'
        ? { y: 0, scale: 1.01 }
        : { y: -2, boxShadow: 'var(--shadow-blue)' },
    whileTap: { y: 0 },
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  };

  const content = (
    <>
      <span>{children}</span>
      {shouldShowArrow && (
        <motion.span
          aria-hidden="true"
          className="inline-flex"
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <ArrowRight size={16} />
        </motion.span>
      )}
    </>
  );

  if (disabled) {
    return (
      <MotionButton
        type={type}
        {...commonProps}
        onClick={onClick}
        disabled
        aria-label={ariaLabel}
        style={{ opacity: 0.55, cursor: 'not-allowed' }}
      >
        {content}
      </MotionButton>
    );
  }

  if (to) {
    return (
      <MotionLink href={to} {...commonProps} aria-label={ariaLabel}>
        {content}
      </MotionLink>
    );
  }

  if (href) {
    return (
      <MotionAnchor
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
        {...commonProps}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {content}
      </MotionAnchor>
    );
  }

  return (
    <MotionButton type={type} {...commonProps} onClick={onClick} aria-label={ariaLabel}>
      {content}
    </MotionButton>
  );
}

