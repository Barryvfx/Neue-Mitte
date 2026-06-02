import Link from 'next/link'
import { Instagram, Youtube } from 'lucide-react'

const POLICY_LINKS = [
  { label: 'Wirtschaft', href: '/#themen' },
  { label: 'Bildung', href: '/#themen' },
  { label: 'Digitalisierung', href: '/#themen' },
  { label: 'Sicherheit', href: '/#themen' },
  { label: 'Energie', href: '/#themen' },
  { label: 'Europa', href: '/#themen' },
]

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.858L1.258 2.25H8.08l4.259 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
  </svg>
)

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-nm-blue dark:bg-gray-950 text-white">
      {/* Legal notice bar */}
      <div className="border-b border-white/10">
        <div className="section-container py-3">
          <p className="text-xs text-white/60 text-center">
            Die Neue Mitte ist ein privates Projekt zur Entwicklung politischer
            Ideen und steht in keiner Verbindung zu bestehenden Parteien oder
            Organisationen.
          </p>
        </div>
      </div>

      <div className="section-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">NM</span>
              </div>
              <span className="font-black text-sm tracking-wider">NEUE MITTE</span>
            </div>
            <div className="german-bar mb-3">
              <span className="!bg-gray-300" />
              <span />
              <span />
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-5">
              Politik, die funktioniert.
            </p>
            <div className="flex gap-3">
              {[
                { href: '#', Icon: Instagram, label: 'Instagram' },
                { href: '#', Icon: TikTokIcon, label: 'TikTok' },
                { href: '#', Icon: Youtube, label: 'YouTube' },
                { href: '#', Icon: XIcon, label: 'X (Twitter)' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Themen */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
              Themen
            </h4>
            <ul className="space-y-2.5">
              {POLICY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partei */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
              Partei
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Über uns', href: '/#ueber-uns' },
                { label: 'Programm', href: '/#programm' },
                { label: 'Unterstützen', href: '/#unterstuetzen' },
                { label: 'Kontakt', href: '/#kontakt' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
              Rechtliches
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/impressum" className="text-sm text-white/70 hover:text-white transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-sm text-white/70 hover:text-white transition-colors">
                  Datenschutz
                </Link>
              </li>
            </ul>
            <div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-white/50 leading-relaxed">
                E-Mail:{' '}
                <a
                  href="mailto:info@neue-mitte.org"
                  className="text-white/70 hover:text-white"
                >
                  info@neue-mitte.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-container py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/40">
            &copy; {year} Neue Mitte. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-4">
            <Link href="/impressum" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
