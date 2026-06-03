'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, LayoutDashboard, Users, Newspaper, Mail, HelpCircle, Settings } from 'lucide-react'

interface Supporter {
  id: string
  firstName: string
  lastName: string
  email: string
  city: string
}

interface StaticLink {
  type: 'link'
  label: string
  href: string
  icon: React.ReactNode
}

interface SupporterResult {
  type: 'supporter'
  id: string
  label: string
  sublabel: string
  href: string
}

type Result = StaticLink | SupporterResult

const STATIC_LINKS: StaticLink[] = [
  { type: 'link', label: 'Dashboard',    href: '/admin/dashboard',  icon: <LayoutDashboard className="h-4 w-4" /> },
  { type: 'link', label: 'Unterstützer', href: '/admin/supporters', icon: <Users className="h-4 w-4" /> },
  { type: 'link', label: 'Meldungen',    href: '/admin/news',       icon: <Newspaper className="h-4 w-4" /> },
  { type: 'link', label: 'Kontakt',      href: '/admin/kontakt',    icon: <Mail className="h-4 w-4" /> },
  { type: 'link', label: 'FAQ',          href: '/admin/faq',        icon: <HelpCircle className="h-4 w-4" /> },
  { type: 'link', label: 'Einstellungen',href: '/admin/settings',   icon: <Settings className="h-4 w-4" /> },
]

export default function QuickSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>(STATIC_LINKS)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Open on Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults(STATIC_LINKS)
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(STATIC_LINKS)
      setActiveIndex(0)
      return
    }

    // Filter static links by query
    const filteredLinks = STATIC_LINKS.filter((l) =>
      l.label.toLowerCase().includes(q.toLowerCase())
    )

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/supporters?q=${encodeURIComponent(q)}&limit=5`)
      if (res.ok) {
        const json = await res.json()
        const supporterResults: SupporterResult[] = (json.supporters ?? []).map((s: Supporter) => ({
          type: 'supporter' as const,
          id: s.id,
          label: `${s.firstName} ${s.lastName}`,
          sublabel: s.email + (s.city ? ` · ${s.city}` : ''),
          href: `/admin/supporters?highlight=${s.id}`,
        }))
        setResults([...supporterResults, ...filteredLinks])
      }
    } catch {
      setResults(filteredLinks)
    } finally {
      setLoading(false)
      setActiveIndex(0)
    }
  }, [])

  // Debounced search on query change
  useEffect(() => {
    if (!open) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, open, search])

  const navigate = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[activeIndex]) navigate(results[activeIndex].href)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Schnellsuche"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
          {loading
            ? <div className="h-4 w-4 border-2 border-nm-blue border-t-transparent rounded-full animate-spin flex-shrink-0" />
            : <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          }
          <input
            ref={inputRef}
            type="text"
            placeholder="Suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none"
          />
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Schließen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              Keine Ergebnisse gefunden.
            </p>
          ) : (
            results.map((result, i) => (
              <button
                key={result.type === 'supporter' ? result.id : result.href}
                onClick={() => navigate(result.href)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === activeIndex
                    ? 'bg-nm-blue/8 dark:bg-nm-blue/15'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}
              >
                {result.type === 'link' ? (
                  <>
                    <span className="flex-shrink-0 text-gray-400 dark:text-gray-500">
                      {result.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {result.label}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-nm-blue/10 dark:bg-nm-blue/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-nm-blue dark:text-blue-400">
                        {result.label.charAt(0)}
                      </span>
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {result.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {result.sublabel}
                      </p>
                    </div>
                  </>
                )}
                {i === activeIndex && (
                  <span className="ml-auto flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 font-mono">
                    ↵
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span><kbd className="font-mono">↑↓</kbd> navigieren</span>
          <span><kbd className="font-mono">↵</kbd> öffnen</span>
          <span><kbd className="font-mono">Esc</kbd> schließen</span>
        </div>
      </div>
    </div>
  )
}
