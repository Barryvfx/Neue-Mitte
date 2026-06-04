'use client'

import { useState, useEffect } from 'react'
import { Eye, Loader2 } from 'lucide-react'

interface TransparenzEntry {
  id: string
  date: string
  title: string
  content: string
  category: 'Entscheidung' | 'Finanzen' | 'Personal' | 'Sonstiges'
}

const CATEGORY_CONFIG: Record<string, { bg: string; text: string }> = {
  'Entscheidung': { bg: 'bg-blue-100',   text: 'text-blue-800' },
  'Finanzen':     { bg: 'bg-green-100',  text: 'text-green-800' },
  'Personal':     { bg: 'bg-purple-100', text: 'text-purple-800' },
  'Sonstiges':    { bg: 'bg-gray-100',   text: 'text-gray-700' },
}

function CategoryBadge({ category }: { category: string }) {
  const cfg = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG['Sonstiges']
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
      {category}
    </span>
  )
}

export default function TransparenzPage() {
  const [items, setItems] = useState<TransparenzEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/transparenz')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Offenheit</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Transparenz</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Wir veröffentlichen alle relevanten Entscheidungen, Finanzen und Personalfragen offen und nachvollziehbar.
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
            <Eye className="h-14 w-14 text-nm-line mx-auto mb-4" />
            <p className="text-nm-muted text-lg font-semibold mb-1">Noch keine Einträge</p>
            <p className="text-nm-muted text-sm">Transparenzberichte werden regelmäßig veröffentlicht.</p>
          </div>
        ) : (
          <div className="max-w-3xl">
            <div className="relative">
              {/* Timeline vertical line */}
              <div className="absolute left-[5.5rem] sm:left-28 top-0 bottom-0 w-px bg-nm-line hidden sm:block" />

              <div className="space-y-0">
                {items.map((item, idx) => (
                  <div key={item.id} className="relative flex gap-4 sm:gap-8 pb-8">
                    {/* Date */}
                    <div className="flex-shrink-0 w-20 sm:w-24 text-right pt-1">
                      <time className="text-xs text-nm-muted font-semibold leading-tight block">
                        {new Date(item.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                      </time>
                      <span className="text-[10px] text-nm-muted/70">
                        {new Date(item.date).getFullYear()}
                      </span>
                    </div>

                    {/* Timeline dot */}
                    <div className="hidden sm:flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-nm-blue border-2 border-white ring-2 ring-nm-blue/20 flex-shrink-0 mt-1" />
                    </div>

                    {/* Content */}
                    <div className={`flex-1 min-w-0 border border-nm-line rounded-xl p-4 sm:p-5 ${idx === 0 ? 'border-nm-blue/30 bg-nm-blue/[0.02]' : 'bg-white'}`}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-black text-nm-blue text-sm sm:text-base leading-snug">
                          {item.title}
                        </h3>
                        <CategoryBadge category={item.category} />
                      </div>
                      <p className="text-nm-muted text-sm leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
