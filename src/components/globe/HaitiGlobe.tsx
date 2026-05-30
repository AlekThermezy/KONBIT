"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import createGlobe from 'cobe'

// Haiti + major diaspora cities
const MARKERS: { location: [number, number]; size: number; label: string; color: [number, number, number] }[] = [
  // Haiti
  { location: [18.9712, -72.2852], size: 0.12, label: 'Port-au-Prince', color: [0.13, 0.77, 0.37] },
  { location: [19.7580, -72.2040], size: 0.07, label: 'Cap-Haïtien', color: [0.13, 0.77, 0.37] },
  { location: [18.2032, -73.7478], size: 0.06, label: 'Les Cayes', color: [0.13, 0.77, 0.37] },
  { location: [18.2342, -72.5384], size: 0.05, label: 'Jacmel', color: [0.13, 0.77, 0.37] },
  // Diaspora hubs
  { location: [25.7617, -80.1918], size: 0.06, label: 'Miami', color: [0.96, 0.62, 0.04] },
  { location: [40.7128, -74.0060], size: 0.07, label: 'New York', color: [0.96, 0.62, 0.04] },
  { location: [45.5017, -73.5673], size: 0.06, label: 'Montreal', color: [0.96, 0.62, 0.04] },
  { location: [48.8566, 2.3522], size: 0.05, label: 'Paris', color: [0.96, 0.62, 0.04] },
  { location: [51.5074, -0.1278], size: 0.05, label: 'London', color: [0.96, 0.62, 0.04] },
  { location: [25.2048, 55.2708], size: 0.04, label: 'Dubai', color: [0.96, 0.62, 0.04] },
]

export default function HaitiGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)
  const phiRef = useRef(0.6)
  const thetaRef = useRef(0.3)
  const widthRef = useRef(0)
  const pointerDownRef = useRef<[number, number] | null>(null)
  const pointerDownPhiRef = useRef(0)
  const pointerDownThetaRef = useRef(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const onResize = useCallback(() => {
    if (canvasRef.current) {
      widthRef.current = canvasRef.current.offsetWidth
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    onResize()

    const canvas = canvasRef.current
    if (!canvas) return

    let isDragging = false

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 16000,
      mapBrightness: 2.2,
      baseColor: [0.05, 0.12, 0.08],
      markerColor: [0.13, 0.77, 0.37],
      glowColor: [0.07, 0.25, 0.13],
      markers: MARKERS,
      onRender(state) {
        if (!isDragging) {
          phiRef.current += 0.003
        }
        state.phi = phiRef.current
        state.theta = thetaRef.current
        state.width = widthRef.current * 2
        state.height = widthRef.current * 2
      },
    })

    globeRef.current = globe

    setTimeout(() => setIsLoaded(true), 500)

    // Pointer drag
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      pointerDownRef.current = [e.clientX, e.clientY]
      pointerDownPhiRef.current = phiRef.current
      pointerDownThetaRef.current = thetaRef.current
      canvas.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || !pointerDownRef.current) return
      const [x0, y0] = pointerDownRef.current
      const dx = (e.clientX - x0) / widthRef.current
      const dy = (e.clientY - y0) / widthRef.current
      phiRef.current = pointerDownPhiRef.current - dx * Math.PI * 1.5
      thetaRef.current = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, pointerDownThetaRef.current + dy * Math.PI * 0.8)
      )
    }

    const onPointerUp = () => {
      isDragging = false
      pointerDownRef.current = null
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    return () => {
      globe.destroy()
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
    }
  }, [onResize])

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ cursor: 'grab' }}>
      {/* Glow halo behind globe */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '60%',
          paddingBottom: '60%',
          top: '20%',
          left: '20%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.04) 50%, transparent 75%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Gold accent glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '40%',
          paddingBottom: '40%',
          top: '30%',
          left: '30%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          aspectRatio: '1/1',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1.2s ease-in-out',
          cursor: 'grab',
        }}
      />

      {/* Drag hint */}
      {isLoaded && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs flex items-center gap-1.5"
          style={{ animation: 'fadeInUp 1s ease forwards 2s', opacity: 0 }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          Drag to explore
        </div>
      )}
    </div>
  )
}
