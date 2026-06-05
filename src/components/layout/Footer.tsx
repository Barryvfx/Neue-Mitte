import Link from 'next/link'

const PROGRAM_COLS = [
  [
    { label: 'Wirtschaft', href: '/wirtschaft' },
    { label: 'Steuern', href: '/steuern' },
    { label: 'Bildung', href: '/bildung' },
    { label: 'Gesundheit', href: '/gesundheit' },
    { label: 'Sicherheit', href: '/sicherheit' },
  ],
  [
    { label: 'Migration', href: '/migration' },
    { label: 'Digitalisierung', href: '/digitalisierung' },
    { label: 'Energie', href: '/energie' },
    { label: 'Wohnen', href: '/wohnen' },
    { label: 'Familie', href: '/familie' },
  ],
  [
    { label: 'Rente', href: '/rente' },
    { label: 'Landwirtschaft', href: '/landwirtschaft' },
    { label: 'Europa', href: '/europa' },
    { label: 'Außenpolitik', href: '/aussenpolitik' },
  ],
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-nm-blue text-white mt-auto">
      {/* Legal notice */}
      <div className="border-b border-white/10">
        <div className="nm-container py-3">
          <p className="text-[11px] text-white/50 text-center">
            Die Neue Mitte ist ein privates Projekt zur Entwicklung politischer Ideen und steht in keiner Verbindung zu bestehenden Parteien oder Organisationen.
          </p>
        </div>
      </div>

      {/* Main footer */}
      <div className="nm-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand */}
          <div className="md:col-span-3">
            <div className="text-white font-black tracking-[0.18em] uppercase text-lg leading-none mb-1">Neue Mitte</div>
            <div className="flex h-[3px] mb-5" style={{ width: 60 }}>
              <span className="flex-1" style={{ background: 'rgba(255,255,255,0.4)' }} />
              <span className="flex-1" style={{ background: '#CC0000' }} />
              <span className="flex-1" style={{ background: '#F0B823' }} />
            </div>
            <p className="text-[13px] text-white/60 leading-relaxed mb-5 max-w-[200px]">
              Politik, die funktioniert.
            </p>
            <a
              href="mailto:info@neue-mitte.org"
              className="text-[12px] text-white/50 hover:text-white transition-colors block mb-1"
            >
              info@neue-mitte.org
            </a>
            <a
              href="tel:+4915252990491"
              className="text-[12px] text-white/50 hover:text-white transition-colors block"
            >
              +49 152 52990491
            </a>
          </div>

          {/* Programm */}
          <div className="md:col-span-6 grid grid-cols-3 gap-6">
            {PROGRAM_COLS.map((col, ci) => (
              <div key={ci}>
                {ci === 0 && (
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-4">Programm</p>
                )}
                {ci !== 0 && <p className="text-[10px] invisible mb-4">–</p>}
                <ul className="space-y-2.5">
                  {col.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[13px] text-white/60 hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Partei & Rechtliches */}
          <div className="md:col-span-3 grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-4">Partei</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'Startseite', href: '/' },
                  { label: 'Aktuelles', href: '/aktuelles' },
                  { label: 'Veranstaltungen', href: '/veranstaltungen' },
                  { label: 'Petition', href: '/petition' },
                  { label: 'Presse', href: '/presse' },
                  { label: 'Newsletter-Archiv', href: '/newsletter-archiv' },
                  { label: 'Unterstützen', href: '/unterstuetzen' },
                  { label: 'Mitgliederbereich', href: '/mitglieder' },
                  { label: 'Kontakt', href: '/kontakt' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-white/60 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-4">Mitmachen & Tools</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'Bürgerfragen', href: '/buergerfragen' },
                  { label: 'Ideen', href: '/ideen' },
                  { label: 'Bürgervoting', href: '/abstimmungen' },
                  { label: 'Steuerrechner', href: '/steuerrechner' },
                  { label: 'Brief-Generator', href: '/brief' },
                  { label: 'Glossar', href: '/glossar' },
                  { label: 'Zeitstrahl', href: '/zeitstrahl' },
                  { label: 'Statistiken', href: '/statistiken' },
                  { label: 'Mitglieder', href: '/mitglieder' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-white/60 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="nm-container py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/30">
            &copy; {year} Neue Mitte. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/impressum" className="text-[11px] text-white/40 hover:text-white transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-[11px] text-white/40 hover:text-white transition-colors">Datenschutz</Link>
            <p className="text-[11px] text-white/30">Deutschland kann mehr.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
