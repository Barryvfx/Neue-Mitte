import Link from 'next/link'
import { ProgramArea, PROGRAM_AREAS } from '@/lib/programData'

interface ProgramLayoutProps {
  area: ProgramArea
}

export default function ProgramLayout({ area }: ProgramLayoutProps) {
  const currentIndex = PROGRAM_AREAS.findIndex((a) => a.slug === area.slug)
  const prev = currentIndex > 0 ? PROGRAM_AREAS[currentIndex - 1] : null
  const next = currentIndex < PROGRAM_AREAS.length - 1 ? PROGRAM_AREAS[currentIndex + 1] : null

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-nm-line bg-nm-gray">
        <div className="nm-container py-3">
          <nav className="breadcrumb">
            <Link href="/">Startseite</Link>
            <span>›</span>
            <Link href="/programm">Programm</Link>
            <span>›</span>
            <span>{area.title}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">
            Programm der Neuen Mitte
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 max-w-3xl">
            {area.title}
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            {area.subtitle}
          </p>
        </div>
      </div>

      <div className="nm-container py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">

          {/* Main content */}
          <div className="lg:col-span-8">
            {/* Intro */}
            <p className="text-lg text-nm-muted leading-relaxed font-medium border-l-4 border-nm-blue pl-5 mb-10">
              {area.intro}
            </p>

            {/* Sections */}
            <div className="space-y-10">
              {area.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-xl sm:text-2xl font-black text-nm-blue mb-3 tracking-tight">
                    {section.heading}
                  </h2>
                  <p className="text-nm-muted leading-relaxed text-[15px]">{section.body}</p>
                </div>
              ))}
            </div>

            {/* Conclusion */}
            <div className="mt-12 pt-10 border-t border-nm-line">
              <p className="text-nm-muted leading-relaxed italic text-[15px]">
                {area.conclusion}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 mt-12 lg:mt-0">
            {/* Demands */}
            <div className="bg-nm-gray border border-nm-line p-6 mb-8">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-nm-muted mb-4">
                Konkrete Forderungen
              </p>
              <ul className="space-y-3">
                {area.demands.map((demand) => (
                  <li key={demand} className="flex gap-3 text-sm text-nm-muted leading-relaxed">
                    <span className="w-1 h-1 rounded-full bg-nm-blue flex-shrink-0 mt-2" />
                    {demand}
                  </li>
                ))}
              </ul>
            </div>

            {/* All program areas */}
            <div className="border border-nm-line p-6">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-nm-muted mb-4">
                Alle Themenfelder
              </p>
              <ul className="space-y-1">
                {PROGRAM_AREAS.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/${a.slug}`}
                      className={`block text-sm py-1.5 px-2 -mx-2 rounded transition-colors ${
                        a.slug === area.slug
                          ? 'bg-nm-blue text-white font-semibold'
                          : 'text-nm-muted hover:text-nm-blue hover:bg-nm-gray'
                      }`}
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Prev / Next navigation */}
        <div className="mt-16 pt-8 border-t border-nm-line flex justify-between gap-4">
          {prev ? (
            <Link
              href={`/${prev.slug}`}
              className="group flex items-center gap-2 text-sm text-nm-muted hover:text-nm-blue transition-colors"
            >
              <span className="text-lg">←</span>
              <span>
                <span className="block text-[10px] uppercase tracking-widest font-bold text-nm-muted/60 group-hover:text-nm-blue/60">Vorheriges Thema</span>
                <span className="font-semibold">{prev.title}</span>
              </span>
            </Link>
          ) : <div />}
          {next ? (
            <Link
              href={`/${next.slug}`}
              className="group flex items-center gap-2 text-sm text-nm-muted hover:text-nm-blue transition-colors text-right"
            >
              <span>
                <span className="block text-[10px] uppercase tracking-widest font-bold text-nm-muted/60 group-hover:text-nm-blue/60">Nächstes Thema</span>
                <span className="font-semibold">{next.title}</span>
              </span>
              <span className="text-lg">→</span>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  )
}
