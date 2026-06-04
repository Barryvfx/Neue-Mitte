'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ExternalLink, Loader2, Scale } from 'lucide-react'

interface GesetzFokusDetail {
  id: string
  title: string
  lawName: string
  content: string
  summary?: string
  externalUrl?: string
  createdAt: string
}

export default function GesetzFokusDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [item, setItem] = useState<GesetzFokusDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/gesetz-fokus?id=${id}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then(d => { if (d) { setItem(d); setLoading(false) } })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [id])

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
          <Scale className="h-14 w-14 text-nm-line mx-auto mb-4" />
          <p className="text-nm-muted text-lg mb-6">Artikel nicht gefunden.</p>
          <Link href="/gesetz-fokus" className="btn-primary">Zur Übersicht</Link>
        </div>
      </div>
    )
  }

  const paragraphs = item.content.split('\n\n').filter(Boolean)

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-14 sm:py-16">
          <Link
            href="/gesetz-fokus"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-5 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Alle Gesetze
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white/80 text-[10px] font-black uppercase tracking-wider mb-4">
            <Scale className="h-3 w-3" /> {item.lawName}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mt-3 max-w-3xl">
            {item.title}
          </h1>
        </div>
      </div>

      <div className="nm-container py-10">
        <div className="max-w-3xl">
          {item.summary && (
            <div className="bg-nm-gray border border-nm-line rounded-xl p-5 mb-8">
              <p className="text-[11px] font-black uppercase tracking-wider text-nm-muted mb-2">Zusammenfassung</p>
              <p className="text-nm-text font-semibold leading-relaxed">{item.summary}</p>
            </div>
          )}

          <div className="editorial-content mb-10">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-nm-text leading-relaxed mb-5">{para}</p>
            ))}
          </div>

          {item.externalUrl && (
            <div className="mb-8">
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" /> Offiziellen Gesetzestext lesen
              </a>
            </div>
          )}

          <div className="pt-6 border-t border-nm-line flex items-center justify-between">
            <p className="text-xs text-nm-muted">
              Veröffentlicht am {new Date(item.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <Link href="/gesetz-fokus" className="btn-ghost">
              <ChevronLeft className="h-4 w-4" /> Zurück
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
