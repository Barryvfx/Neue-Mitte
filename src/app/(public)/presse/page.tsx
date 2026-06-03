'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Calendar } from 'lucide-react'

interface PressRelease {
  id: string
  title: string
  excerpt: string
  fileUrl?: string
  date: string
}

export default function PressePage() {
  const [releases, setReleases] = useState<PressRelease[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/presse')
      .then(r => r.json())
      .then(data => { setReleases(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Medien</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Pressemitteilungen</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Offizielle Mitteilungen und Stellungnahmen der Neuen Mitte für Medienvertreter.
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
        {loading ? (
          <div className="text-center py-20 text-nm-muted">Wird geladen…</div>
        ) : releases.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-12 w-12 text-nm-line mx-auto mb-3" />
            <p className="text-nm-muted">Noch keine Pressemitteilungen veröffentlicht.</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {releases.map(r => (
              <div key={r.id} className="nm-card rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 text-xs text-nm-muted">
                      <Calendar className="h-3 w-3" />
                      {new Date(r.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <h2 className="font-bold text-nm-blue text-lg mb-2">{r.title}</h2>
                    <p className="text-nm-muted text-sm leading-relaxed">{r.excerpt}</p>
                  </div>
                  {r.fileUrl && (
                    <a
                      href={r.fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-2 text-xs font-semibold text-nm-blue border border-nm-blue/30 rounded-lg px-3 py-2 hover:bg-nm-blue hover:text-white transition-all"
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="max-w-3xl mx-auto mt-10 p-6 bg-nm-gray border border-nm-line rounded-xl">
          <h2 className="font-bold text-nm-blue mb-2">Pressekontakt</h2>
          <p className="text-nm-muted text-sm leading-relaxed">
            Für Presseanfragen und Interviews stehen wir gerne zur Verfügung.
            Bitte nutzen Sie unser{' '}
            <a href="/kontakt" className="text-nm-blue hover:underline">Kontaktformular</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
