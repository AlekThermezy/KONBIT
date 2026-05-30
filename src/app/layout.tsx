import './globals.css'
import type { Metadata } from 'next'
import 'leaflet/dist/leaflet.css'

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
        {children}
      </body>
    </html>
  )
}