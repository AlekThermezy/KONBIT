import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'KONBIT — Konekte, Tèt ansanm, Pou nou vanse',
  description: 'Invest in Haitian businesses. Learn from Haitian experts. Build the future together.',
  keywords: 'Haitian diaspora investment, Haitian businesses, invest in Haiti, learn Haitian, Haitian platform',
  authors: [{ name: 'KONBIT' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://konbit.io',
    siteName: 'KONBIT',
    title: 'KONBIT — Konekte, Tèt ansanm, Pou nou vanse',
    description: 'Invest in Haitian businesses. Learn from Haitian experts. Build the future together.',
    images: [{
      url: '/images/konbit-og-image.png',
      width: 1200,
      height: 630,
      alt: 'KONBIT — Haitian Diaspora Investment Platform',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@konbit_io',
    creator: '@konbit_io',
    title: 'KONBIT — Konekte, Tèt ansanm, Pou nou vanse',
    description: 'Invest in Haitian businesses. Learn from Haitian experts. Build the future together.',
    images: ['/images/konbit-og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://konbit.io',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-green-600 focus:text-white focus:rounded-lg">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}