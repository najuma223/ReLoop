import React from 'react';

export default function SkeletonLoader({ rows = 5, height = 36 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%', padding: '0.5rem' }}>
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          style={{
            height: `${height}px`,
            width: '100%',
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            borderRadius: '8px',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
