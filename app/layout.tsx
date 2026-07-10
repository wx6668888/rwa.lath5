import type { Metadata, Viewport } from 'next'
import PwaRegister from '@/components/pwa-register'
import './globals.css'

export const metadata: Metadata = {
  title: 'RWA.LAT — AI Investment OS',
  description: 'A premium USDT-first digital asset investment experience for AI Compute, RWA, global assets and prediction intelligence.',
  applicationName: 'RWA.LAT',
  manifest: '/manifest.webmanifest',
  keywords: ['AI investment', 'digital assets', 'AI Compute', 'RWA', 'portfolio intelligence'],
  authors: [{ name: 'RWA.LAT' }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RWA.LAT',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: '/rwa-mark.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/rwa-mark-180.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'RWA.LAT — Invest with intelligence.',
    description: 'One USDT wallet. Global opportunities. AI-guided decisions.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#090B10',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#090B10]">
      <body className="antialiased bg-[#090B10] text-white overflow-x-hidden">
        <PwaRegister />
        {children}
      </body>
    </html>
  )
}
