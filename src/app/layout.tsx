import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KONBIT — Konekte, Tèt ansanm, Pou nou vanse',
  description: 'Invest in Haitian businesses. Learn from Haitian experts. Build the future together.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}