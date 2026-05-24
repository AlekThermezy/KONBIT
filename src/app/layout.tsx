import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'KONBIT — Konekte, Tèt ansanm, Pou nou vanse',
  description: 'Invest in Haitian businesses. Learn from Haitian experts. Build the future together.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  )
}