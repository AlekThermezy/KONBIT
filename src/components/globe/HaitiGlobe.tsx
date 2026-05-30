"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import createGlobe, { COBEOptions } from 'cobe'

// Haiti + major diaspora cities
const MARKERS: COBEOptions['markers'] = [
  { location: [18.9712, -72.2852], size: 0.12 },
  { location: [19.7580, -72.2040], size: 0.07 },
  { location: [18.2032, -73.7478], size: 0.06 },
  { location: [18.2342, -72.5384], size: 0.05 },
  { location: [25.7617, -80.1918], size: 0.06 },
  { location: [40.7128, -74.0060], size: 0.07 },
  { location: [45.5017, -73.5673], size: 0.06 },
  { location: [48.8566,  2.3522], size: 0.05 },
  { location: [51.5074, -0.1278], size: 0.05 },
  { location: [25.2048, 55.2708], size: 0.04 },
]

// Arcs from diaspora to Haiti
const ARCS: COBEOptions['arcs'] = [
  { from: [25.7617, -80.1918], to: [18.9712, -72.2852] },
  { from: [40.7128, -74.0060], to: [18.9712, -72.2852] },
  { from: [45.5017, -73.5673], to: [18.9712, -72.2852] },
  { from: [48.8566,  2.3522], to: [18.9712, -72.2852] },
  { from: [51.5074, -0.1278], to: [18.9712, -72.2852] },
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
  const isDraggingRef = useRef(false)
  const rafRef = useRef<number>(0)
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

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 16000,
      mapBrightness: 2.5,
      baseColor: [0.04, 0.10, 0.06],
      markerColor: [0.13, 0.77, 0.37],
      glowColor: [0.06, 0.22, 0.10],
      markers: MARKERS,
      arcs: ARCS,
      arcColor: [0.13, 0.77, 0.37],
      arcWidth: 1.5,
      arcHeight: 0.4,
    })

    globeRef.current = globe

    // Animation loop
    const animate = () => {
      if (!isDraggingRef.current) {
        phiRef.current += 0.003
      }
      if (globeRef.current) {
        globeRef.current.update({
          phi: phiRef.current,
          theta: thetaRef.current,
          width: widthRef.current * 2,
          height: widthRef.current * 2,
        })
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    setTimeout(() => setIsLoaded(true), 600)

    // Drag to rotate
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true
      pointerDownRef.current = [e.clientX, e.clientY]
      pointerDownPhiRef.current = phiRef.current
      pointerDownThetaRef.current = thetaRef.current
      canvas.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !pointerDownRef.current) return
      const [x0, y0] = pointerDownRef.current
      const dx = (e.clientX - x0) / widthRef.current
      const dy = (e.clientY - y0) / widthRef.current
      phiRef.current = pointerDownPhiRef.current - dx * Math.PI * 1.5
      thetaRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pointerDownThetaRef.current + dy * Math.PI * 0.8))
    }
    const onPointerUp = () => {
      isDraggingRef.current = false
      pointerDownRef.current = null
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    return () => {
      cancelAnimationFrame(rafRef.current)
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
      {/* Glow behind globe */}
      <div className="absolute inset-0 rounded-full pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.10) 0%, rgba(34,197,94,0.03) 50%, transparent 75%)',
        filter: 'blur(40px)',
      }} />

      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          aspectRatio: '1/1',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1.2s ease',
          cursor: isDraggingRef.current ? 'grabbing' : 'grab',
        }}
      />

      {isLoaded && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/25 text-xs flex items-center gap-1.5"
          style={{ animation: 'fadeInUp 1s ease forwards' }}>
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          Drag to explore
        </div>
      )}
    </div>
  )
}
