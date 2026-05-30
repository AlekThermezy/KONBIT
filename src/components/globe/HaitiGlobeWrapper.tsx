"use client"
import dynamic from 'next/dynamic'

const HaitiGlobe = dynamic(() => import('./HaitiGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-green-500/30 border-t-green-500 animate-spin" />
    </div>
  ),
})

export default HaitiGlobe
