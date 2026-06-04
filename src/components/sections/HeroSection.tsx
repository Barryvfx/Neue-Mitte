'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { HERO_HEADLINES } from '@/lib/seed-content'

function trackClick(variant: string) {
  fetch('/api/abtest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variant, action: 'cta_click' }),
  }).catch(() => {})
}

export default function HeroSection() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  // Random starting headline so it differs on every visit
  useEffect(() => {
    setIndex(Math.floor(Math.random() * HERO_HEADLINES.length))
  }, [])

  // Auto-rotate every 6 seconds with a fade transition
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % HERO_HEADLINES.length)
        setVisible(true)
      }, 500)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const content = HERO_HEADLINES[index]

  return (
    <section className="relative bg-nm-blue pt-[130px] pb-20 lg:pt-[150px] lg:pb-28 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      {/* Gradient fade at right */}
      <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(3,13,31,0.5), transparent)' }}
        aria-hidden="true"
      />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(11,58,117,0.4))' }}
        aria-hidden="true"
      />

      <div className="nm-container relative">
        <div className="max-w-4xl">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-white/50 mb-6">
            Neue Mitte · Deutschland
          </p>

          {/* Rotating headline + subline */}
          <div className={`transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-display text-white mb-6 min-h-[2.2em]">
              {content.headline.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < content.headline.length - 1 && <br />}
                </span>
              ))}
            </h1>

            <p className="text-lg sm:text-xl text-white/75 leading-relaxed max-w-2xl mb-10 font-normal min-h-[3.5em]">
              {content.sub}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/programm" className="btn-outline-white text-base px-7 py-3.5">
              Programm lesen
            </Link>
            <Link
              href="/unterstuetzen"
              className="btn-primary bg-white text-nm-blue hover:bg-white/90 text-base px-7 py-3.5"
              onClick={() => trackClick(`hero_${index}`)}
            >
              Unterstützen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Rotation indicator dots */}
          <div className="flex gap-1.5 mt-10">
            {HERO_HEADLINES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setVisible(false); setTimeout(() => { setIndex(i); setVisible(true) }, 200) }}
                aria-label={`Slogan ${i + 1} anzeigen`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
