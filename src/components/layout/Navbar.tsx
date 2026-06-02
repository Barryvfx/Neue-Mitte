'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/cn'

const NAV_LINKS = [
  { label: 'Start', href: '/#home' },
  { label: 'Programm', href: '/#programm' },
  { label: 'Themen', href: '/#themen' },
  { label: 'Unterstützen', href: '/#unterstuetzen' },
  { label: 'Über uns', href: '/#ueber-uns' },
  { label: 'Kontakt', href: '/#kontakt' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
          : 'bg-transparent'
      )}
    >
      <nav className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-9 h-9 bg-nm-blue dark:bg-nm-sky rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm tracking-tight">NM</span>
            </div>
            <div className="hidden sm:block">
              <span
                className={cn(
                  'font-black text-sm tracking-wider transition-colors',
                  scrolled
                    ? 'text-nm-blue dark:text-white'
                    : 'text-white'
                )}
              >
                NEUE MITTE
              </span>
              <div className="german-bar mt-0.5">
                <span /><span /><span />
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  scrolled
                    ? 'text-gray-700 dark:text-gray-300 hover:text-nm-blue dark:hover:text-nm-sky hover:bg-gray-50 dark:hover:bg-gray-800'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle
              className={cn(
                !scrolled && 'text-white/80 hover:text-white hover:bg-white/10'
              )}
            />
            <Link
              href="/#unterstuetzen"
              className={cn(
                'hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200',
                scrolled
                  ? 'bg-nm-blue text-white hover:bg-nm-blue-light'
                  : 'bg-white text-nm-blue hover:bg-white/90'
              )}
            >
              Unterstützer werden
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors',
                scrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-white hover:bg-white/10'
              )}
              aria-label="Menü öffnen"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 shadow-lg">
          <div className="section-container py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-nm-blue dark:hover:text-nm-sky transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#unterstuetzen"
              onClick={() => setMobileOpen(false)}
              className="mt-2 btn-primary text-center"
            >
              Unterstützer werden
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
