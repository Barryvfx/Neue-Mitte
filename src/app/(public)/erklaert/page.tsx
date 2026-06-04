'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

interface Artikel {
  id: string
  title: string
  slug: string
  summary: string
  topic: string
  createdAt: string
}

const TOPIC_COLORS: Record<string, string> = {
  'Wirtschaft':    'bg-blue-100 text-blue-700',
  'Finanzen':      'bg-indigo-100 text-indigo-700',
  'Soziales':      'bg-rose-100 text-rose-700',
  'Migration':     'bg-orange-100 text-orange-700',
  'Bildung':       'bg-green-100 text-green-700',
  'Energie':       'bg-yellow-100 text-yellow-700',
  'Sicherheit':    'bg-red-100 text-red-700',
  'Allgemein':     'bg-gray-100 text-gray-700',
}

export default function ErklaertPage() {
  const [items, setItems] = useState<Artikel[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('alle')

  useEffect(() => {
    fetch('/api/erklaert').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const topics = [...new Set(items.map(i => i.topic))]
  const visible = filter === 'alle' ? items : items.filter(i => i.topic === filter)

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Politische Bildung</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Politik erklärt</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Was ist die Schuldenbremse? Wie funktioniert das Asylsystem? Sachlich, verständlich, ohne Parteibuch.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        <div className="flex flex-wrap gap-2 mb-6">
          {['alle', ...topics].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${filter === t ? 'bg-nm-blue text-white border-nm-blue' : 'border-nm-line text-nm-muted hover:border-nm-blue hover:text-nm-blue'}`}>
              {t === 'alle' ? `Alle (${items.length})` : t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-nm-muted">Wird geladen…</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-12 w-12 text-nm-line mx-auto mb-3" />
            <p className="text-nm-muted">Noch keine Artikel veröffentlicht.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
            {visible.map(item => {
              const color = TOPIC_COLORS[item.topic] ?? TOPIC_COLORS['Allgemein']
              return (
                <Link key={item.id} href={`/erklaert/${item.slug}`} className="nm-card rounded-xl p-5 block group">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${color}`}>{item.topic}</span>
                    <span className="text-xs text-nm-muted">{new Date(item.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}</span>
                  </div>
                  <h2 className="font-black text-nm-blue text-base leading-snug mb-2 group-hover:underline decoration-nm-blue/30">{item.title}</h2>
                  <p className="text-nm-muted text-sm leading-relaxed line-clamp-3">{item.summary}</p>
                  <div className="mt-3 text-xs font-semibold text-nm-blue">Lesen →</div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
