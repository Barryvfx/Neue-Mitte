import Link from 'next/link'

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.858L1.258 2.25H8.08l4.259 5.632L18.244 2.25z"/>
  </svg>
)
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 106.34 6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/>
  </svg>
)

export default function TopBar() {
  return (
    <div className="bg-nm-blue text-white hidden lg:block">
      <div className="nm-container">
        <div className="flex items-center justify-between h-8">
          <a
            href="mailto:info@neue-mitte.org"
            className="text-[11px] text-white/70 hover:text-white transition-colors"
          >
            info@neue-mitte.org
          </a>
          <div className="flex items-center divide-x divide-white/20">
            <div className="flex items-center gap-3 pr-4">
              {[
                { href: '#', label: 'Instagram', icon: '◈' },
              ].map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                   className="text-white/60 hover:text-white transition-colors text-xs">
                  {s.label}
                </a>
              ))}
              <a href="#" aria-label="TikTok" className="text-white/60 hover:text-white transition-colors">
                <TikTokIcon />
              </a>
              <a href="#" aria-label="X / Twitter" className="text-white/60 hover:text-white transition-colors">
                <XIcon />
              </a>
            </div>
            <div className="flex items-center gap-4 pl-4">
              <Link href="/impressum" className="text-[11px] text-white/60 hover:text-white transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="text-[11px] text-white/60 hover:text-white transition-colors">Datenschutz</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
