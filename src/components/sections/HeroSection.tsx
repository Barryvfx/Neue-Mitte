import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="bg-nm-blue pt-[130px] pb-20 lg:pt-[150px] lg:pb-28">
      <div className="nm-container">
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
