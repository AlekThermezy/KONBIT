"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import createGlobe, { COBEOptions } from 'cobe'

// ── Haiti + diaspora markers ──────────────────────────────────────────
const MARKERS: NonNullable<COBEOptions['markers']> = [
  { location: [18.9712, -72.2852], size: 0.15 }, // Port-au-Prince  ★ hero
  { location: [19.7580, -72.2040], size: 0.09 }, // Cap-Haïtien
  { location: [18.2032, -73.7478], size: 0.07 }, // Les Cayes
  { location: [18.2342, -72.5384], size: 0.07 }, // Jacmel
  { location: [19.4548, -72.6808], size: 0.06 }, // Gonaïves
  { location: [19.1077, -72.6823], size: 0.05 }, // Saint-Marc
  // Diaspora
  { location: [25.7617, -80.1918], size: 0.08 }, // Miami
  { location: [40.7128, -74.0060], size: 0.09 }, // New York
  { location: [45.5017, -73.5673], size: 0.07 }, // Montréal
  { location: [48.8566,  2.3522], size: 0.07 },  // Paris
  { location: [51.5074, -0.1278], size: 0.06 },  // London
  { location: [25.2048, 55.2708], size: 0.05 },  // Dubai
  { location: [18.4655, -66.1057], size: 0.05 }, // Puerto Rico
  { location: [-23.5505, -46.6333], size: 0.05 },// São Paulo
  { location: [4.3612,  18.5550], size: 0.04 },  // Central Africa
]

// ── Arcs: every diaspora city → Port-au-Prince ───────────────────────
const ARCS: NonNullable<COBEOptions['arcs']> = [
  { from: [25.7617, -80.1918], to: [18.9712, -72.2852] },
  { from: [40.7128, -74.0060], to: [18.9712, -72.2852] },
  { from: [45.5017, -73.5673], to: [18.9712, -72.2852] },
  { from: [48.8566,  2.3522],  to: [18.9712, -72.2852] },
  { from: [51.5074, -0.1278],  to: [18.9712, -72.2852] },
  { from: [25.2048, 55.2708],  to: [18.9712, -72.2852] },
  { from: [18.4655, -66.1057], to: [18.9712, -72.2852] },
  { from: [-23.5505,-46.6333], to: [18.9712, -72.2852] },
]

// ── Haiti lon/lat → globe phi/theta ──────────────────────────────────
// phi  = longitude in radians (west is positive in cobe)
// theta = latitude in radians (north is positive)
const HAITI_PHI   = (72.2852 * Math.PI) / 180   // ~1.261 rad  (72°W)
const HAITI_THETA = (18.9712 * Math.PI) / 180   // ~0.331 rad  (19°N)

// ── Animation phases ─────────────────────────────────────────────────
// Phase 0 (0–1.5s)   : static close-up on Haiti, scale=3.2
// Phase 1 (1.5–5s)   : eased zoom-out scale 3.2 → 1.1, globe stays on Haiti
// Phase 2 (5s+)      : gentle auto-rotation begins
const PHASE_HOLD   = 1500   // ms
const PHASE_ZOOM   = 3800   // ms — slightly slower zoom-out
const SCALE_CLOSE  = 3.2
const SCALE_FAR    = 1.1

// Ease in-out cubic
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// ── City labels (fixed positions relative to globe center) ───────────
const CITY_LABELS = [
  { name: 'Port-au-Prince', top: '46%', left: '44%', primary: true },
  { name: "Cap-Haïtien",    top: '38%', left: '46%', primary: false },
  { name: 'Jacmel',         top: '52%', left: '45%', primary: false },
]

export default function HaitiGlobe() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const globeRef    = useRef<ReturnType<typeof createGlobe> | null>(null)
  const widthRef    = useRef(0)
  const rafRef      = useRef<number>(0)

  // Rotation state
  const phiRef      = useRef(HAITI_PHI)
  const thetaRef    = useRef(HAITI_THETA)
  const scaleRef    = useRef(SCALE_CLOSE)

  // Drag state
  const isDragging  = useRef(false)
  const dragStart   = useRef<[number, number] | null>(null)
  const phiOnDown   = useRef(HAITI_PHI)
  const thetaOnDown = useRef(HAITI_THETA)

  // Phase timing
  const startTimeRef = useRef<number>(0)
  const phaseRef     = useRef<0 | 1 | 2>(0)

  const [isLoaded,    setIsLoaded]    = useState(false)
  const [showLabels,  setShowLabels]  = useState(false)
  const [labelsPhase, setLabelsPhase] = useState<'haiti' | 'world'>('haiti')

  const onResize = useCallback(() => {
    if (canvasRef.current) widthRef.current = canvasRef.current.offsetWidth
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    onResize()

    const canvas = canvasRef.current
    if (!canvas || widthRef.current === 0) return

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width:  widthRef.current * 2,
      height: widthRef.current * 2,
      phi:    HAITI_PHI,
      theta:  HAITI_THETA,
      dark: 1,
      diffuse: 2.8,             // stronger directional light = better continent definition
      mapSamples:        24000, // maximum resolution continent edges
      mapBrightness:     9.5,   // bright chartreuse-white landmasses on deep ocean
      mapBaseBrightness: 0.06,  // deep Caribbean teal ocean floor
      baseColor:   [0.02, 0.10, 0.14], // deep teal ocean — Caribbean color
      markerColor: [0.13, 0.98, 0.50], // bright neon green — Haiti cities
      glowColor:   [0.10, 0.45, 0.20], // rich green atmosphere
      markers: MARKERS,
      arcs: ARCS,
      arcColor:  [0.25, 0.98, 0.55],   // bright arc trails
      arcWidth:  2.5,
      arcHeight: 0.42,
      scale: SCALE_CLOSE,
      opacity: 1.0,
    })

    globeRef.current = globe
    startTimeRef.current = performance.now()

    // ── Main RAF loop ─────────────────────────────────────────────
    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current

      // ── Phase 0: hold on Haiti ──
      if (phaseRef.current === 0 && elapsed > PHASE_HOLD) {
        phaseRef.current = 1
      }

      // ── Phase 1: zoom out ──
      if (phaseRef.current === 1) {
        const t = Math.min((elapsed - PHASE_HOLD) / PHASE_ZOOM, 1)
        const e = easeInOutCubic(t)
        scaleRef.current = SCALE_CLOSE - (SCALE_CLOSE - SCALE_FAR) * e

        if (t >= 1) {
          phaseRef.current = 2
          scaleRef.current = SCALE_FAR
        }
      }

      // ── Phase 2: gentle spin ──
      if (phaseRef.current === 2 && !isDragging.current) {
        phiRef.current += 0.0008   // very gentle drift — meditative pace
      }

      globeRef.current?.update({
        phi:    phiRef.current,
        theta:  thetaRef.current,
        scale:  scaleRef.current,
        width:  widthRef.current * 2,
        height: widthRef.current * 2,
      })

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    // Reveal timings
    setTimeout(() => setIsLoaded(true),    300)
    setTimeout(() => setShowLabels(true),  700)
    setTimeout(() => setLabelsPhase('world'), PHASE_HOLD + PHASE_ZOOM + 200)

    // ── Drag to rotate ─────────────────────────────────────────────
    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true
      dragStart.current  = [e.clientX, e.clientY]
      phiOnDown.current   = phiRef.current
      thetaOnDown.current = thetaRef.current
      canvas.setPointerCapture(e.pointerId)
      canvas.style.cursor = 'grabbing'
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current || !dragStart.current) return
      const [x0, y0] = dragStart.current
      const dx = (e.clientX - x0) / widthRef.current
      const dy = (e.clientY - y0) / widthRef.current
      phiRef.current   = phiOnDown.current - dx * Math.PI * 2
      thetaRef.current = Math.max(-Math.PI / 2.2,
        Math.min(Math.PI / 2.2, thetaOnDown.current + dy * Math.PI))
      // Jump to phase 2 immediately on drag
      if (phaseRef.current < 2) {
        scaleRef.current = SCALE_FAR
        phaseRef.current = 2
      }
    }
    const onPointerUp = () => {
      isDragging.current = false
      dragStart.current  = null
      canvas.style.cursor = 'grab'
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup',   onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    return () => {
      cancelAnimationFrame(rafRef.current)
      globe.destroy()
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup',   onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
    }
  }, [onResize])

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">

      {/* ── Atmospheric glow ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.14) 0%, rgba(34,197,94,0.04) 45%, transparent 72%)',
        filter: 'blur(32px)',
      }} />

      {/* ── Outer orbit ring ── */}
      <div className="absolute pointer-events-none" style={{
        width: '84%', paddingBottom: '84%',
        top: '8%', left: '8%',
        borderRadius: '50%',
        border: '1px solid rgba(34,197,94,0.07)',
        boxShadow: '0 0 80px rgba(34,197,94,0.05), inset 0 0 80px rgba(34,197,94,0.02)',
      }} />

      {/* ── Haiti heatmap pulse — green+gold glow over Caribbean ── */}
      <div className="absolute pointer-events-none" style={{
        width: '22%', paddingBottom: '22%',
        top: '34%', left: '34%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,197,94,0.45) 0%, rgba(245,158,11,0.18) 45%, transparent 72%)',
        filter: 'blur(14px)',
        mixBlendMode: 'screen',
        animation: 'haitiPulse 3s ease-in-out infinite',
      }} />

      {/* ── WebGL Canvas ── */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          aspectRatio: '1/1',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1.2s ease',
          cursor: 'grab',
        }}
      />

      {/* ── City labels (Haiti phase) ── */}
      {showLabels && labelsPhase === 'haiti' && (
        <div className="absolute inset-0 pointer-events-none">
          {CITY_LABELS.map(city => (
            <div key={city.name}
              className="absolute flex items-center gap-1.5"
              style={{
                top: city.top, left: city.left,
                opacity: 0,
                animation: 'fadeInUp 0.6s ease forwards',
              }}>
              <div style={{
                width:  city.primary ? 8 : 5,
                height: city.primary ? 8 : 5,
                borderRadius: '50%',
                background: city.primary ? '#22c55e' : 'rgba(34,197,94,0.7)',
                boxShadow: city.primary
                  ? '0 0 10px rgba(34,197,94,0.9), 0 0 20px rgba(34,197,94,0.5)'
                  : '0 0 6px rgba(34,197,94,0.6)',
                animation: 'markerPulse 2s ease-in-out infinite',
              }} />
              <span style={{
                fontSize: city.primary ? 11 : 9,
                fontWeight: 700,
                color: city.primary ? '#4ade80' : 'rgba(134,239,172,0.8)',
                textShadow: '0 0 10px rgba(34,197,94,0.8)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                {city.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── World phase: diaspora legend ── */}
      {showLabels && labelsPhase === 'world' && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ animation: 'fadeInUp 0.8s ease forwards', opacity: 0 }}>
          <div className="flex items-center gap-4 px-4 py-2 rounded-full"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(34,197,94,0.2)', backdropFilter: 'blur(10px)' }}>
            <div className="flex items-center gap-1.5">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.8)' }} />
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Haiti</span>
            </div>
            <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
            <div className="flex items-center gap-1.5">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.8)' }} />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Diaspora</span>
            </div>
            <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
            <div className="flex items-center gap-1.5">
              <div style={{ width: 16, height: 1, background: 'linear-gradient(to right, #22c55e, transparent)', borderRadius: 2 }} />
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Investment flow</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Drag hint ── */}
      {isLoaded && (
        <div className="absolute top-4 right-4 pointer-events-none flex items-center gap-1.5"
          style={{ opacity: 0, animation: 'fadeIn 1s ease forwards 2s' }}>
          <svg width="12" height="12" fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          <span className="text-[10px] text-white/30 font-medium">Drag</span>
        </div>
      )}

      <style jsx>{`
        @keyframes haitiPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.15); }
        }
        @keyframes markerPulse {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.4); opacity: 0.7; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
