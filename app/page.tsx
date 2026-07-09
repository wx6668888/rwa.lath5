import Navbar from '@/components/navbar'
import HeroSection from '@/components/hero-section'
import MarketMarquee from '@/components/market-marquee'
import BentoSection from '@/components/bento-section'
import AIAnalystSection from '@/components/ai-analyst-section'
import PortfolioSection from '@/components/portfolio-section'
import CTASection from '@/components/cta-section'
import IntroSequence from '@/components/intro-sequence'
import AmbientBackground from '@/components/ambient-background'

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ background: '#05070D' }}>
      {/* Cinematic intro overlay */}
      <IntroSequence />

      {/* Ambient floating light field */}
      <AmbientBackground />

      {/* Navbar */}
      <Navbar />

      <div className="relative z-10">
      {/* Hero */}
      <HeroSection />

      {/* Market Marquee */}
      <MarketMarquee />

      {/* Divider */}
      <div className="w-full h-px max-w-5xl mx-auto" style={{ background: 'rgba(255,255,255,0.05)' }} />

      {/* Bento Intelligence Modules */}
      <BentoSection />

      {/* Divider */}
      <div className="w-full h-px max-w-5xl mx-auto" style={{ background: 'rgba(255,255,255,0.05)' }} />

      {/* AI Analyst Showcase */}
      <AIAnalystSection />

      {/* Divider */}
      <div className="w-full h-px max-w-5xl mx-auto" style={{ background: 'rgba(255,255,255,0.05)' }} />

      {/* Portfolio Intelligence */}
      <PortfolioSection />

      {/* CTA + Footer */}
      <CTASection />
      </div>
    </main>
  )
}
