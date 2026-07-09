'use client'

import { useRef, useEffect } from 'react'

interface Orb {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  hue: number
  phase: number
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbsRef = useRef<Orb[]>([])
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const count = isMobile ? 4 : 7
    orbsRef.current = Array.from({ length: count }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r: 140 + Math.random() * 260,
      hue: 150 + Math.random() * 16,
      phase: Math.random() * Math.PI * 2,
    }))

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const draw = () => {
      timeRef.current += 0.005
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      for (const orb of orbsRef.current) {
        orb.x += orb.vx
        orb.y += orb.vy
        orb.phase += 0.008

        if (orb.x < -orb.r) orb.x = w + orb.r
        if (orb.x > w + orb.r) orb.x = -orb.r
        if (orb.y < -orb.r) orb.y = h + orb.r
        if (orb.y > h + orb.r) orb.y = -orb.r

        const breathe = 0.5 + Math.sin(orb.phase) * 0.5
        const r = orb.r * (0.85 + breathe * 0.15)
        const alpha = 0.05 + breathe * 0.05

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r)
        grad.addColorStop(0, `hsla(${orb.hue}, 100%, 55%, ${alpha})`)
        grad.addColorStop(1, `hsla(${orb.hue}, 100%, 55%, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      if (!reduce) animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.9 }}
    />
  )
}
