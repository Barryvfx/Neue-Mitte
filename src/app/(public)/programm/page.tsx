import Link from 'next/link'
import { PROGRAM_AREAS } from '@/lib/programData'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Programm – Neue Mitte',
  description: 'Das vollständige Programm der Neuen Mitte: 14 Themenfelder von Wirtschaft über Bildung bis Außenpolitik.',
}

export default function ProgrammPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">
            Neue Mitte
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Unser Programm
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Klare Positionen zu den drängendsten Fragen unserer Zeit. Kein Wahlversprechen ohne Finanzierungsgrundlage.
            Keine Rhetorik ohne Inhalt.
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="border-b border-nm-line">
        <div className="nm-container py-10">
          <p className="text-nm-muted max-w-3xl leading-relaxed text-[15px]">
            Das Programm der Neuen Mitte ist kein Versprechen an alle und niemanden. Es ist eine ehrliche Bestandsaufnahme
            dessen, was Deutschland in den kommenden Jahren braucht – und konkrete Vorschläge, wie es erreicht werden kann.
            Wir haben 14 Themenfelder erarbeitet, in denen wir klare und erklärte Positionen einnehmen.
          </p>
        </div>
      </div>

      {/* Grid of program areas */}
      <div className="nm-container py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-nm-line border border-nm-line">
          {PROGRAM_AREAS.map((area, i) => (
            <Link
              key={area.slug}
              href={`/${area.slug}`}
              className="group bg-white p-8 hover:bg-nm-gray transition-colors"
            >
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-nm-muted/50 mb-2 block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="text-xl font-black text-nm-blue group-hover:underline mb-2 tracking-tight">
                {area.title}
              </h2>
              <p className="text-nm-muted text-sm leading-relaxed line-clamp-2">
                {area.subtitle}
              </p>
              <span className="inline-flex items-center gap-1 text-nm-blue text-xs font-semibold mt-4">
                Position lesen →
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-nm-gray border-t border-nm-line">
        <div className="nm-container py-12 text-center">
          <p className="text-nm-muted mb-4 max-w-lg mx-auto">
            Überzeugt? Unterstützen Sie die Neue Mitte und helfen Sie, diese Positionen in die öffentliche Debatte zu tragen.
          </p>
          <Link href="/unterstuetzen" className="btn-primary">
            Jetzt unterstützen
          </Link>
        </div>
      </div>
    </div>
  )
}
