"use client";

import dynamic from 'next/dynamic';

const HaitiMap = dynamic(() => import('./HaitiMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center bg-[var(--bg-void)]" style={{ height: '100vh' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[var(--green-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-[var(--green-primary)] text-sm font-mono">Loading map...</p>
      </div>
    </div>
  ),
});

export default function HaitiMapWrapper() {
  return (
    <div className="w-full" style={{ height: '100vh', position: 'relative' }}>
      <HaitiMap />
    </div>
  );
}
