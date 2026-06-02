'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowDown, ChevronRight } from 'lucide-react'

interface HeroProps {
  supporterCount: number
}

export default function Hero({ supporterCount }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Array<{
      x: number; y: number; vx: number; vy: number; size: number; opacity: number
    }> = []

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      })
    }

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(79, 141, 255, ${p.opacity})`
        ctx.fill()
      })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden bg-hero-gradient">
      {/* Grid pattern */}
      <div className="absolute inset-0 hero-pattern opacity-40" />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nm-sky/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-nm-blue-light/20 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-nm-gold rounded-full animate-pulse-slow" />
            Politik, die funktioniert
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.05] tracking-tight mb-6 max-w-5xl"
        >
          Politik,{' '}
          <span className="text-gradient-white">die funktioniert.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg sm:text-xl text-white/75 max-w-2xl leading-relaxed mb-10"
        >
          Deutschland braucht keinen größeren oder kleineren Staat.{' '}
          <strong className="text-white/95 font-semibold">
            Deutschland braucht einen Staat, der funktioniert.
          </strong>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Link
            href="/#programm"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-nm-blue font-bold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
          >
            Unser Programm
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/#unterstuetzen"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-nm-sky text-white font-bold rounded-xl hover:bg-nm-sky-light transition-all duration-200 shadow-lg hover:shadow-xl text-base"
          >
            Jetzt unterstützen
          </Link>
        </motion.div>

        {/* Supporter count */}
        {supporterCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur-sm px-5 py-3 rounded-full"
          >
            <div className="flex -space-x-1.5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-nm-blue bg-nm-sky/50"
                  style={{ background: `hsl(${220 + i * 15}, 70%, ${55 + i * 5}%)` }}
                />
              ))}
            </div>
            <p className="text-white/90 text-sm font-medium">
              <span className="font-bold text-white">{supporterCount.toLocaleString('de-DE')}</span>{' '}
              {supporterCount === 1 ? 'Unterstützer hat' : 'Unterstützer haben'} bereits unterschrieben
            </p>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex flex-col items-center pb-8 text-white/50 animate-bounce">
        <span className="text-xs font-medium tracking-widest uppercase mb-2">Mehr erfahren</span>
        <ArrowDown className="h-4 w-4" />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none" />
    </section>
  )
}
