import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
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
            Deutschland<br />kann mehr.
          </h1>

          <p className="text-lg sm:text-xl text-white/75 leading-relaxed max-w-2xl mb-10 font-normal">
            Die Neue Mitte kämpft für schnellere Behörden, moderne Schulen,
            weniger Bürokratie und einen Staat, der Probleme löst statt verwaltet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/programm" className="btn-outline-white text-base px-7 py-3.5">
              Programm lesen
            </Link>
            <Link href="/unterstuetzen" className="btn-primary bg-white text-nm-blue hover:bg-white/90 text-base px-7 py-3.5">
              Unterstützen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
