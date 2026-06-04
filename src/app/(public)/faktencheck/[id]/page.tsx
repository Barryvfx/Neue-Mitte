'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ExternalLink, Loader2, ShieldCheck } from 'lucide-react'

interface FaktencheckDetail {
  id: string
  slug: string
  claim: string
  person?: string
  rating: 'wahr' | 'halb-wahr' | 'falsch' | 'nicht-prüfbar'
  analysis: string
  sources?: string[]
  createdAt: string
}

const RATING_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; leftBorder: string }> = {
  'wahr':           { label: 'Wahr',          bg: 'bg-green-50',   text: 'text-green-800',  border: 'border-green-200', leftBorder: 'border-green-500' },
  'halb-wahr':      { label: 'Halb wahr',      bg: 'bg-yellow-50',  text: 'text-yellow-800', border: 'border-yellow-200', leftBorder: 'border-yellow-500' },
  'falsch':         { label: 'Falsch',         bg: 'bg-red-50',     text: 'text-red-800',    border: 'border-red-200',   leftBorder: 'border-red-500' },
  'nicht-prüfbar':  { label: 'Nicht prüfbar', bg: 'bg-gray-50',    text: 'text-gray-700',   border: 'border-gray-200',  leftBorder: 'border-gray-400' },
}

export default function FaktencheckDetailPage() {
  const params = useParams()
  const slug = params.id as string

  const [item, setItem] = useState<FaktencheckDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/faktencheck?slug=${slug}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then(d => { if (d) { setItem(d); setLoading(false) } })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [slug])

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-nm-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Wird geladen…</span>
        </div>
      </div>
    )
  }

  if (notFound || !item) {
    return (
      <div className="bg-white min-h-screen">
        <div className="nm-container py-20 text-center">
          <ShieldCheck className="h-14 w-14 text-nm-line mx-auto mb-4" />
          <p className="text-nm-muted text-lg mb-6">Faktencheck nicht gefunden.</p>
          <Link href="/faktencheck" className="btn-primary">Zur Übersicht</Link>
        </div>
      </div>
    )
  }

  const cfg = RATING_CONFIG[item.rating] ?? RATING_CONFIG['nicht-prüfbar']

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-14 sm:py-16">
          <Link
            href="/faktencheck"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-5 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Alle Faktenchecks
          </Link>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">Faktencheck</p>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border mb-4 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.label}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 max-w-3xl">
            &ldquo;{item.claim}&rdquo;
          </h1>
          {item.person && (
            <p className="text-white/60 text-sm mt-3">— {item.person}</p>
          )}
        </div>
      </div>

      <div className="nm-container py-10">
        <div className="max-w-3xl">
          {/* Rating banner */}
          <div className={`border-l-4 ${cfg.leftBorder} ${cfg.bg} ${cfg.border} border rounded-r-xl p-5 mb-8`}>
            <p className={`text-xs font-black uppercase tracking-wider mb-1 ${cfg.text}`}>Unser Urteil</p>
            <p className={`text-2xl font-black ${cfg.text}`}>{cfg.label}</p>
          </div>

          {/* Analysis */}
          <div className="mb-10">
            <h2 className="text-lg font-black text-nm-blue mb-4">Analyse</h2>
            <div className="prose prose-sm max-w-none">
              {item.analysis.split('\n\n').map((para, i) => (
                <p key={i} className="text-nm-text leading-relaxed mb-4">{para}</p>
              ))}
            </div>
          </div>

          {/* Sources */}
          {item.sources && item.sources.length > 0 && (
            <div className="border border-nm-line rounded-xl p-5">
              <h3 className="text-sm font-black text-nm-blue mb-3 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" /> Quellen
              </h3>
              <ol className="space-y-2">
                {item.sources.map((source, i) => (
                  <li key={i} className="flex gap-2 text-sm text-nm-muted">
                    <span className="flex-shrink-0 font-bold text-nm-blue">{i + 1}.</span>
                    {source.startsWith('http') ? (
                      <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-blue break-all"
                      >
                        {source}
                      </a>
                    ) : (
                      <span>{source}</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-nm-line">
            <p className="text-xs text-nm-muted">
              Veröffentlicht am {new Date(item.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="mt-6">
            <Link href="/faktencheck" className="btn-outline">
              <ChevronLeft className="h-4 w-4" /> Alle Faktenchecks
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
