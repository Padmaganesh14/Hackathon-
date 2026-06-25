import React from 'react';

export default function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Warm amber orb top-left */}
      <div
        className="absolute rounded-full orb-float-1"
        style={{
          width: '500px',
          height: '500px',
          top: '-100px',
          left: '-100px',
          background: 'radial-gradient(circle, rgba(146, 64, 14, 0.10) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      {/* Warm stone orb bottom-right */}
      <div
        className="absolute rounded-full orb-float-2"
        style={{
          width: '400px',
          height: '400px',
          bottom: '-80px',
          right: '10%',
          background: 'radial-gradient(circle, rgba(120, 113, 108, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      {/* Subtle warm grid */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,248,235,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,248,235,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}