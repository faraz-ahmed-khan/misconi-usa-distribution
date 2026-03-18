import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import TestimonialCard from './TestimonialCard.jsx';

export default function TestimonialCarousel({ testimonials = [] }) {
  const items = useMemo(() => testimonials, [testimonials]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!items.length) return;
    if (paused) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);

    return () => window.clearInterval(id);
  }, [items.length, paused]);

  if (!items.length) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <TestimonialCard {...items[index]} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            className="h-[6px] w-[6px] rounded-full transition-colors"
            style={{
              backgroundColor: i === index ? 'var(--alert-green)' : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

