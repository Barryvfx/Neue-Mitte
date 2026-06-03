'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

const VARIANT_A = {
  headline: <>Deutschland<br />kann mehr.</>,
  sub: 'Die Neue Mitte kämpft für schnellere Behörden, moderne Schulen, weniger Bürokratie und einen Staat, der Probleme löst statt verwaltet.',
}

const VARIANT_B = {
  headline: <>Gemeinsam.<br />Pragmatisch. Neu.</>,
  sub: 'Die Neue Mitte steht für eine Politik, die liefert: Weniger Ideologie, mehr Lösungen – für Deutschland und seine Bürger.',
}

function trackClick(variant: string) {
  fetch('/api/abtest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variant, action: 'cta_click' }),
  }).catch(() => {})
}

export default function HeroSection() {
  const [variant, setVariant] = useState<'A' | 'B'>('A')

  useEffect(() => {
    const stored = localStorage.getItem('nm_ab')
    if (stored === 'A' || stored === 'B') {
      setVariant(stored)
    } else {
      const v = Math.random() < 0.5 ? 'A' : 'B'
      localStorage.setItem('nm_ab', v)
      setVariant(v)
    }
  }, [])

  const content = variant === 'B' ? VARIANT_B : VARIANT_A

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

          <h1 className="text-display text-white mb-6">
            {content.headline}
          </h1>

          <p className="text-lg sm:text-xl text-white/75 leading-relaxed max-w-2xl mb-10 font-normal">
            {content.sub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/programm" className="btn-outline-white text-base px-7 py-3.5">
              Programm lesen
            </Link>
            <Link
              href="/unterstuetzen"
              className="btn-primary bg-white text-nm-blue hover:bg-white/90 text-base px-7 py-3.5"
              onClick={() => trackClick(variant)}
            >
              Unterstützen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
