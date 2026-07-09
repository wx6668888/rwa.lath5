'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { WordReveal, MagneticButton } from './motion-primitives'

const AICore = dynamic(() => import('./ai-core'), { ssr: false })

// Intro overlay runs ~2.6s; hero content reveals as it lifts.
const BASE = 2.4

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Keep scroll work minimal: only cheap opacity + a light text drift.
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-start md:justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background depth layers */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(46, 232, 142,0.10) 0%, transparent 70%)',
        }}
      />
      <div className="noise-texture absolute inset-0 pointer-events-none" />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* Globe — behind text, materializes from intro (no scroll transforms = smooth) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0, scale: 0.7, filter: 'blur(18px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <AICore />
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4 pt-28 pb-16 w-full max-w-6xl mx-auto pointer-events-none"
        style={{ y: textY, opacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: BASE }}
          className="mb-8"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full backdrop-blur-md"
            style={{
              background: 'rgba(46, 232, 142,0.12)',
              border: '1px solid rgba(46, 232, 142,0.3)',
              color: '#5FF3AB',
            }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#2EE88E' }}
              animate={{
                boxShadow: [
                  '0 0 4px #2EE88E',
                  '0 0 12px #2EE88E',
                  '0 0 4px #2EE88E',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            AI Investment OS
          </span>
        </motion.div>

        {/* Headline — word by word reveal */}
        <WordReveal
          as="h1"
          text="Invest Smarter."
          delay={BASE + 0.1}
          stagger={0.12}
          className="text-balance leading-[0.95] font-bold tracking-tight"
          style={{
            fontSize: 'clamp(3rem, 9vw, 7rem)',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #6B7280 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        />
        <WordReveal
          as="h2"
          text="Powered by AI."
          delay={BASE + 0.35}
          stagger={0.12}
          className="text-balance leading-[0.95] font-bold tracking-tight mb-8"
          style={{
            fontSize: 'clamp(3rem, 9vw, 7rem)',
            background:
              'linear-gradient(180deg, #5FF3AB 0%, #2EE88E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        />

        {/* Subtitle */}
        <motion.p
          className="max-w-md text-base md:text-lg leading-relaxed mb-12"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: BASE + 0.6 }}
        >
          AI-powered intelligence for global markets.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex items-center gap-4 flex-wrap justify-center pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: BASE + 0.85 }}
        >
          <MagneticButton href="#app" variant="primary">
            Get Started Free
          </MagneticButton>
          <MagneticButton href="#product" variant="ghost">
            See How It Works
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: BASE + 1.6 }}
        style={{ color: 'rgba(255,255,255,0.3)' }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8"
          style={{
            background:
              'linear-gradient(to bottom, rgba(46, 232, 142,0.6), transparent)',
          }}
        />
      </motion.div>
    </section>
  )
}
