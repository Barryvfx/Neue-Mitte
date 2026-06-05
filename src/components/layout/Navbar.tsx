'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Sun, Moon, Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import TopBar from './TopBar'
import { useTheme } from '@/components/providers/ThemeProvider'

const MITMACHEN_LINKS = [
  { label: 'Bürgerfragen', href: '/buergerfragen', desc: 'Fragen stellen & abstimmen' },
  { label: 'Ideen einreichen', href: '/ideen', desc: 'Eigene Ideen vorschlagen' },
  { label: 'Debattier-Forum', href: '/debatte', desc: 'Pro & Contra diskutieren' },
  { label: 'Bürgervoting', href: '/abstimmungen', desc: 'Zu aktuellen Fragen abstimmen' },
  { label: 'Versprechen-Tracker', href: '/versprechen', desc: 'Forderungen verfolgen' },
  { label: 'Wähler-Kompass', href: '/waehler-kompass', desc: 'Politische Position finden' },
  { label: 'Wissenstest', href: '/wissenstest', desc: 'Politisches Wissen testen' },
  { label: 'Steuerrechner', href: '/steuerrechner', desc: 'Einkommensteuer 2024 berechnen' },
  { label: 'Brief-Generator', href: '/brief', desc: 'Brief an den Bundestag' },
  { label: 'KI-Assistent', href: '/chatbot', desc: 'Fragen zur Politik stellen' },
  { label: 'Faktencheck', href: '/faktencheck', desc: 'Politische Aussagen prüfen' },
  { label: 'Politisches Glossar', href: '/glossar', desc: 'A-Z der politischen Begriffe' },
  { label: 'Zitate-Galerie', href: '/zitate', desc: 'Kluge Worte über Demokratie' },
  { label: 'Zeitstrahl', href: '/zeitstrahl', desc: '75 Jahre Bundesrepublik' },
  { label: 'Politik erklärt', href: '/erklaert', desc: 'Themen verständlich erklärt' },
  { label: 'Statistiken', href: '/statistiken', desc: 'Live-Zahlen der Neuen Mitte' },
  { label: 'Civic Score', href: '/civic-score', desc: 'Engagement-Punkte' },
  { label: 'Mitglieder-Panel', href: '/mitglieder', desc: 'Community & exklusive Inhalte' },
]

const PROGRAM_LINKS = [
  { label: 'Programmübersicht', href: '/programm', divider: false },
  { label: 'Wirtschaft', href: '/wirtschaft', divider: false },
  { label: 'Steuern', href: '/steuern', divider: false },
  { label: 'Bildung', href: '/bildung', divider: false },
  { label: 'Gesundheit', href: '/gesundheit', divider: true },
  { label: 'Migration', href: '/migration', divider: false },
  { label: 'Sicherheit', href: '/sicherheit', divider: false },
  { label: 'Digitalisierung', href: '/digitalisierung', divider: true },
  { label: 'Energie', href: '/energie', divider: false },
  { label: 'Wohnen', href: '/wohnen', divider: false },
  { label: 'Familie', href: '/familie', divider: false },
  { label: 'Rente', href: '/rente', divider: true },
  { label: 'Landwirtschaft', href: '/landwirtschaft', divider: false },
  { label: 'Europa', href: '/europa', divider: false },
  { label: 'Außenpolitik', href: '/aussenpolitik', divider: false },
]

const NAV_LINKS = [
  { label: 'Start', href: '/' },
  { label: 'Aktuelles', href: '/aktuelles' },
  { label: 'Veranstaltungen', href: '/veranstaltungen' },
  { label: 'Unterstützen', href: '/unterstuetzen' },
  { label: 'Kontakt', href: '/kontakt' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [programOpen, setProgramOpen] = useState(false)
  const [mitmachenOpen, setMitmachenOpen] = useState(false)
  const [mobileProgramOpen, setMobileProgramOpen] = useState(false)
  const [mobileMitmachenOpen, setMobileMitmachenOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mitmachenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setProgramOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setProgramOpen(false)
      if (mitmachenRef.current && !mitmachenRef.current.contains(e.target as Node)) setMitmachenOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isProgramActive = pathname?.startsWith('/programm') ||
    PROGRAM_LINKS.some(l => l.href !== '/programm' && pathname === l.href)

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200',
      scrolled ? 'shadow-nav' : 'border-b border-nm-line'
    )}>
      <TopBar />

      <nav className="nm-container">
        <div className="flex items-center justify-between h-[66px] gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="nm-logo-text">Neue Mitte</div>
            <div className="nm-logo-bar">
              <span style={{ background: '#1A1A1A' }} />
              <span style={{ background: '#CC0000' }} />
              <span style={{ background: '#F0B823' }} />
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-5 flex-1">
            {/* Programm dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProgramOpen(o => !o)}
                className={cn(
                  'nav-link flex items-center gap-1',
                  isProgramActive && 'active'
                )}
              >
                Programm
                <ChevronDown className={cn(
                  'h-3.5 w-3.5 transition-transform duration-200',
                  programOpen && 'rotate-180'
                )} />
              </button>

              {programOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-nm-line shadow-lg z-50 py-1">
                  {PROGRAM_LINKS.map((link) => (
                    <div key={link.href}>
                      {link.divider && <div className="my-1 border-t border-nm-line" />}
                      <Link
                        href={link.href}
                        className={cn(
                          'block px-4 py-2 text-sm text-nm-text hover:bg-nm-gray hover:text-nm-blue transition-colors',
                          pathname === link.href && 'text-nm-blue font-semibold bg-nm-gray'
                        )}
                      >
                        {link.label}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mitmachen dropdown */}
            <div className="relative" ref={mitmachenRef}>
              <button
                onClick={() => setMitmachenOpen(o => !o)}
                className={cn('nav-link flex items-center gap-1', MITMACHEN_LINKS.some(l => pathname === l.href) && 'active')}
              >
                Mitmachen
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', mitmachenOpen && 'rotate-180')} />
              </button>
              {mitmachenOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-nm-line shadow-lg z-50 py-2 rounded-lg">
                  <div className="grid grid-cols-1 gap-0.5">
                    {MITMACHEN_LINKS.map((link) => (
                      <Link key={link.href} href={link.href}
                        className={cn('block px-4 py-2.5 hover:bg-nm-gray transition-colors', pathname === link.href && 'bg-nm-gray')}
                      >
                        <span className="text-sm font-medium text-nm-text block">{link.label}</span>
                        <span className="text-xs text-nm-muted">{link.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn('nav-link', pathname === link.href && 'active')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/suche"
              aria-label="Suche"
              className="p-2 rounded-lg text-nm-muted hover:text-nm-blue hover:bg-nm-gray transition-all"
            >
              <Search className="h-4 w-4" />
            </Link>
            <button
              onClick={toggle}
              aria-label="Dark Mode umschalten"
              className="p-2 rounded-lg text-nm-muted hover:text-nm-blue hover:bg-nm-gray transition-all"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link href="/unterstuetzen" className="btn-primary text-[13px] px-5 py-2.5">
              Jetzt unterstützen
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-nm-text hover:text-nm-blue transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-nm-line max-h-[calc(100vh-74px)] overflow-y-auto">
          <div className="nm-container py-4 flex flex-col">
            {/* Program accordion */}
            <button
              onClick={() => setMobileProgramOpen(o => !o)}
              className="flex items-center justify-between py-3 text-sm font-medium text-nm-text border-b border-nm-line"
            >
              Programm
              <ChevronDown className={cn('h-4 w-4 transition-transform', mobileProgramOpen && 'rotate-180')} />
            </button>
            {mobileProgramOpen && (
              <div className="py-2 pl-3 border-b border-nm-line mb-1">
                {PROGRAM_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-2 text-sm text-nm-muted hover:text-nm-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile Mitmachen */}
            <button
              onClick={() => setMobileMitmachenOpen(o => !o)}
              className="flex items-center justify-between py-3 text-sm font-medium text-nm-text border-b border-nm-line"
            >
              Mitmachen
              <ChevronDown className={cn('h-4 w-4 transition-transform', mobileMitmachenOpen && 'rotate-180')} />
            </button>
            {mobileMitmachenOpen && (
              <div className="py-2 pl-3 border-b border-nm-line mb-1">
                {MITMACHEN_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="block py-2 text-sm text-nm-muted hover:text-nm-blue transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-sm font-medium text-nm-text hover:text-nm-blue border-b border-nm-line transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link href="/unterstuetzen" className="btn-primary mt-4 justify-center">
              Jetzt unterstützen
            </Link>
            <button
              onClick={toggle}
              className="mt-2 flex items-center gap-2 py-2.5 text-sm font-medium text-nm-muted hover:text-nm-blue transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? 'Helles Design' : 'Dunkles Design'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
