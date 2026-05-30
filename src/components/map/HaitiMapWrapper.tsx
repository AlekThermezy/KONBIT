"use client";

import dynamic from 'next/dynamic';

const HaitiMap = dynamic(() => import('./HaitiMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[var(--bg-void)]" style={{ minHeight: '500px' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[var(--green-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-[var(--green-primary)] text-sm font-mono">Loading map...</p>
      </div>
    </div>
  ),
});

export default HaitiMap;
