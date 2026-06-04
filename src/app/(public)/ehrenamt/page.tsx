'use client'

import { useState, useEffect } from 'react'
import { Heart, MapPin, Calendar, Mail, Phone, Loader2 } from 'lucide-react'

interface EhrenamtItem {
  id: string
  title: string
  description: string
  location?: string
  date?: string
  category: string
  contactEmail?: string
  contactPhone?: string
  contactName?: string
}

const CATEGORY_COLORS: Record<string, string> = {
  'Wahlhelfer':     'bg-blue-100 text-blue-800',
  'Veranstaltung':  'bg-purple-100 text-purple-800',
  'Bildung':        'bg-green-100 text-green-800',
  'Soziales':       'bg-rose-100 text-rose-800',
  'Umwelt':         'bg-emerald-100 text-emerald-800',
  'Sonstiges':      'bg-gray-100 text-gray-700',
}

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS['Sonstiges']
}

export default function EhrenamtPage() {
  const [items, setItems] = useState<EhrenamtItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('alle')

  useEffect(() => {
    fetch('/api/ehrenamt')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const categories = [...new Set(items.map(i => i.category))]
  const visible = filter === 'alle' ? items : items.filter(i => i.category === filter)

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Engagement</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Ehrenamt &amp; Mitmachen
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Engagieren Sie sich für eine bessere Politik. Finden Sie eine ehrenamtliche Tätigkeit in Ihrer Nähe.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['alle', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                filter === cat
                  ? 'bg-nm-blue text-white border-nm-blue'
                  : 'border-nm-line text-nm-muted hover:border-nm-blue hover:text-nm-blue'
              }`}
            >
              {cat === 'alle' ? `Alle (${items.length})` : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-2 text-nm-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Wird geladen…</span>
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="h-14 w-14 text-nm-line mx-auto mb-4" />
            <p className="text-nm-muted text-lg font-semibold mb-1">Keine Stellen gefunden</p>
            <p className="text-nm-muted text-sm">Aktuell sind keine Ehrenamtsstellen in dieser Kategorie ausgeschrieben.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
            {visible.map(item => (
              <div key={item.id} className="nm-card rounded-xl p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>

                <h2 className="font-black text-nm-blue text-base leading-snug mb-2">{item.title}</h2>
                <p className="text-nm-muted text-sm leading-relaxed mb-4 line-clamp-3">{item.description}</p>

                <div className="space-y-1.5 text-xs text-nm-muted mb-4">
                  {item.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-nm-blue" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  {item.date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-nm-blue" />
                      <span>
                        {new Date(item.date).toLocaleDateString('de-DE', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {(item.contactEmail || item.contactPhone || item.contactName) && (
                  <div className="border-t border-nm-line pt-3 mt-3 space-y-1.5">
                    {item.contactName && (
                      <p className="text-xs font-semibold text-nm-text">{item.contactName}</p>
                    )}
                    {item.contactEmail && (
                      <a
                        href={`mailto:${item.contactEmail}`}
                        className="flex items-center gap-1.5 text-xs text-nm-blue hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {item.contactEmail}
                      </a>
                    )}
                    {item.contactPhone && (
                      <a
                        href={`tel:${item.contactPhone}`}
                        className="flex items-center gap-1.5 text-xs text-nm-muted hover:text-nm-blue"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {item.contactPhone}
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
