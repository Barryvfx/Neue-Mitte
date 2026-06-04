'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldCheck, Loader2 } from 'lucide-react'

interface FaktencheckItem {
  id: string
  slug: string
  claim: string
  person?: string
  rating: 'wahr' | 'halb-wahr' | 'falsch' | 'nicht-prüfbar'
  analysisExcerpt?: string
  analysis?: string
  createdAt: string
}

const RATING_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  'wahr':           { label: 'Wahr',           bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300' },
  'halb-wahr':      { label: 'Halb wahr',       bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  'falsch':         { label: 'Falsch',          bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300' },
  'nicht-prüfbar':  { label: 'Nicht prüfbar',  bg: 'bg-gray-100',   text: 'text-gray-700',   border: 'border-gray-300' },
}

function RatingBadge({ rating }: { rating: string }) {
  const cfg = RATING_CONFIG[rating] ?? RATING_CONFIG['nicht-prüfbar']
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {cfg.label}
    </span>
  )
}

export default function FaktencheckPage() {
  const [items, setItems] = useState<FaktencheckItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('alle')

  useEffect(() => {
    fetch('/api/faktencheck')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const ratings = ['alle', 'wahr', 'halb-wahr', 'falsch', 'nicht-prüfbar']
  const visible = filter === 'alle' ? items : items.filter(i => i.rating === filter)

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Transparenz</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Faktencheck</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Wir prüfen politische Aussagen auf ihren Wahrheitsgehalt — sachlich und unparteiisch.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ratings.map(r => {
            const cfg = r !== 'alle' ? RATING_CONFIG[r] : null
            const count = r === 'alle' ? items.length : items.filter(i => i.rating === r).length
            return (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  filter === r
                    ? 'bg-nm-blue text-white border-nm-blue'
                    : 'border-nm-line text-nm-muted hover:border-nm-blue hover:text-nm-blue'
                }`}
              >
                {r === 'alle' ? `Alle (${count})` : `${cfg?.label} (${count})`}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-2 text-nm-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Wird geladen…</span>
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24">
            <ShieldCheck className="h-14 w-14 text-nm-line mx-auto mb-4" />
            <p className="text-nm-muted text-lg font-semibold mb-1">Keine Faktenchecks gefunden</p>
            <p className="text-nm-muted text-sm">Faktenchecks werden laufend veröffentlicht.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
            {visible.map(item => {
              const cfg = RATING_CONFIG[item.rating] ?? RATING_CONFIG['nicht-prüfbar']
              const excerpt = item.analysisExcerpt ?? item.analysis?.slice(0, 140)
              return (
                <Link
                  key={item.id}
                  href={`/faktencheck/${item.slug || item.id}`}
                  className="nm-card rounded-xl p-5 block group"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <RatingBadge rating={item.rating} />
                    <span className="text-xs text-nm-muted flex-shrink-0">
                      {new Date(item.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <blockquote className={`text-sm font-semibold leading-snug text-nm-text mb-3 border-l-4 pl-3 ${cfg.border}`}>
                    &ldquo;{item.claim}&rdquo;
                  </blockquote>

                  {item.person && (
                    <p className="text-xs text-nm-muted mb-3 font-medium">— {item.person}</p>
                  )}

                  {excerpt && (
                    <p className="text-nm-muted text-xs leading-relaxed line-clamp-3">{excerpt}</p>
                  )}

                  <div className="mt-4 text-xs font-semibold text-nm-blue group-hover:underline">
                    Vollständige Analyse →
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
