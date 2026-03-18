import React from 'react';

export default function LoadingSkeleton({ className = '' }) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #EEF1F5 25%, #E0E7EE 50%, #EEF1F5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
          border-radius: var(--radius-sm);
        }
      `}</style>
      <div className={`skeleton ${className}`} />
    </>
  );
}

