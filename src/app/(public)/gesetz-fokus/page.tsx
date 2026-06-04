'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Scale, Loader2 } from 'lucide-react'

interface GesetzFokus {
  id: string
  title: string
  lawName: string
  summary: string
  createdAt: string
}

export default function GesetzFokusPage() {
  const [items, setItems] = useState<GesetzFokus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/gesetz-fokus')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Recht &amp; Gesetz</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Gesetze einfach erklärt
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Komplizierte Gesetze verständlich erklärt — ohne Juristendeutsch.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-2 text-nm-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Wird geladen…</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Scale className="h-14 w-14 text-nm-line mx-auto mb-4" />
            <p className="text-nm-muted text-lg font-semibold mb-1">Noch keine Artikel</p>
            <p className="text-nm-muted text-sm">Gesetzerklärungen werden bald veröffentlicht.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
            {items.map(item => (
              <Link
                key={item.id}
                href={`/gesetz-fokus/${item.id}`}
                className="nm-card rounded-xl p-5 block group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-nm-blue/10 text-nm-blue uppercase tracking-wide">
                    {item.lawName}
                  </span>
                  <span className="text-xs text-nm-muted flex-shrink-0">
                    {new Date(item.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
                <h2 className="font-black text-nm-blue text-base leading-snug mb-2 group-hover:underline decoration-nm-blue/30">
                  {item.title}
                </h2>
                <p className="text-nm-muted text-sm leading-relaxed line-clamp-3">{item.summary}</p>
                <div className="mt-4 text-xs font-semibold text-nm-blue">Mehr lesen →</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
