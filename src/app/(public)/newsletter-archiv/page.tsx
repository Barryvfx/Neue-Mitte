'use client'

import { useState, useEffect } from 'react'
import { Mail, ChevronDown, ChevronUp, Users, Calendar } from 'lucide-react'

interface NewsletterItem {
  id: string
  subject: string
  previewText?: string
  recipientCount: number
  createdAt: string
}

interface NewsletterFull extends NewsletterItem {
  html: string
}

export default function NewsletterArchivPage() {
  const [items, setItems] = useState<NewsletterItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [fullContent, setFullContent] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/newsletter/archive')
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function toggle(id: string) {
    if (expanded === id) { setExpanded(null); return }
    setExpanded(id)
    if (!fullContent[id]) {
      try {
        const res = await fetch(`/api/newsletter/archive/${id}`)
        const data: NewsletterFull = await res.json()
        setFullContent(prev => ({ ...prev, [id]: data.html }))
      } catch {}
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Neue Mitte</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Newsletter-Archiv</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Alle bisher versendeten Newsletter der Neuen Mitte.
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
        {loading ? (
          <div className="text-center py-20 text-nm-muted">Wird geladen…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="h-12 w-12 text-nm-line mx-auto mb-3" />
            <p className="text-nm-muted">Noch keine Newsletter veröffentlicht.</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-3">
            {items.map(item => (
              <div key={item.id} className="border border-nm-line rounded-xl overflow-hidden">
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-nm-gray/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-nm-blue text-base truncate">{item.subject}</div>
                    {item.previewText && (
                      <div className="text-sm text-nm-muted mt-1 truncate">{item.previewText}</div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-nm-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {item.recipientCount} Empfänger
                      </span>
                    </div>
                  </div>
                  {expanded === item.id ? <ChevronUp className="h-4 w-4 text-nm-muted flex-shrink-0 mt-1" /> : <ChevronDown className="h-4 w-4 text-nm-muted flex-shrink-0 mt-1" />}
                </button>

                {expanded === item.id && (
                  <div className="border-t border-nm-line">
                    {fullContent[item.id] ? (
                      <iframe
                        srcDoc={fullContent[item.id]}
                        className="w-full"
                        style={{ height: '500px', border: 'none' }}
                        title={item.subject}
                        sandbox="allow-same-origin"
                      />
                    ) : (
                      <div className="p-6 text-center text-nm-muted text-sm">Wird geladen…</div>
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
