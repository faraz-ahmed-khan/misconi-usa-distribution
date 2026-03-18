import React, { useMemo, useState } from 'react';
import FAQItem from './FAQItem.jsx';

export default function FAQAccordion({ items = [] }) {
  const entries = useMemo(() => items, [items]);
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="w-full">
      {entries.map((it, idx) => (
        <FAQItem
          key={it.q}
          q={it.q}
          a={it.a}
          isOpen={openIndex === idx}
          onToggle={() => setOpenIndex((cur) => (cur === idx ? null : idx))}
        />
      ))}
    </div>
  );
}

