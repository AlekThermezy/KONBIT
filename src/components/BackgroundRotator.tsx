'use client'

import { useEffect } from 'react'

export default function BackgroundRotator() {
  useEffect(() => {
    async function loadBackground() {
      try {
        const res = await fetch('/api/daily-background')
        if (!res.ok) return
        const data = await res.json()
        if (data.imageUrl) {
          document.body.style.backgroundImage = `url(${data.imageUrl})`
        }
      } catch {
        // Fail silently — CSS fallback gradient stays visible
      }
    }
    loadBackground()
  }, [])

  return null
}
