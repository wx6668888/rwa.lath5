import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RWA.LAT — AI Investment Intelligence Platform',
  description: 'A next-generation AI investment operating system. Global Stock Intelligence, AI Agents, Compute Infrastructure, Prediction Intelligence. Powered by AI.',
  keywords: ['AI investment', 'stock intelligence', 'AI agents', 'financial technology', 'RWA', 'portfolio intelligence'],
  authors: [{ name: 'RWA.LAT' }],
  openGraph: {
    title: 'RWA.LAT — Invest Smarter. Powered by AI.',
    description: 'A next-generation AI investment operating system connecting Global Stock Intelligence, AI Agents, Compute Infrastructure, and Prediction Intelligence.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#05070D',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#05070D]">
      <body className="antialiased font-sans bg-[#05070D] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
