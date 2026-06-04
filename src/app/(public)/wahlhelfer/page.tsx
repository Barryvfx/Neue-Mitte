'use client'

import { useState, useEffect, useMemo } from 'react'
import { Vote, Mail, Phone, Loader2, Users } from 'lucide-react'

interface WahlhelferDistrict {
  id: string
  district: string
  city: string
  state: string
  needed: number
  filled: number
  contactEmail?: string
  contactPhone?: string
  contactName?: string
}

export default function WahlhelferPage() {
  const [items, setItems] = useState<WahlhelferDistrict[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/wahlhelfer')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const grouped = useMemo(() => {
    const map: Record<string, WahlhelferDistrict[]> = {}
    for (const item of items) {
      if (!map[item.state]) map[item.state] = []
      map[item.state].push(item)
    }
    return map
  }, [items])

  const states = Object.keys(grouped).sort()
  const totalNeeded = items.reduce((a, b) => a + b.needed, 0)
  const totalFilled = items.reduce((a, b) => a + b.filled, 0)

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Demokratie</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Wahlhelfer gesucht
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Helfen Sie, Demokratie zu sichern. Als Wahlhelfer leisten Sie einen unverzichtbaren
            Beitrag zu freien und fairen Wahlen in Deutschland.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        {/* Summary stats */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 max-w-2xl">
            <div className="border border-nm-line rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-nm-blue">{totalNeeded}</p>
              <p className="text-xs text-nm-muted mt-0.5">Stellen gesamt</p>
            </div>
            <div className="border border-nm-line rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-green-600">{totalFilled}</p>
              <p className="text-xs text-nm-muted mt-0.5">Besetzt</p>
            </div>
            <div className="border border-nm-line rounded-xl p-4 text-center col-span-2 sm:col-span-1">
              <p className="text-2xl font-black text-orange-500">{totalNeeded - totalFilled}</p>
              <p className="text-xs text-nm-muted mt-0.5">Noch gesucht</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-2 text-nm-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Wird geladen…</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Vote className="h-14 w-14 text-nm-line mx-auto mb-4" />
            <p className="text-nm-muted text-lg font-semibold mb-1">Aktuell keine offenen Stellen</p>
            <p className="text-nm-muted text-sm">Wahlhelferstellen werden vor Wahlen veröffentlicht.</p>
          </div>
        ) : (
          <div className="space-y-10 max-w-4xl">
            {states.map(state => (
              <div key={state}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-black text-nm-blue">{state}</h2>
                  <div className="flex-1 h-px bg-nm-line" />
                  <span className="text-xs text-nm-muted">{grouped[state].length} Bezirk{grouped[state].length !== 1 ? 'e' : ''}</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {grouped[state].map(item => {
                    const pct = item.needed > 0 ? Math.min(100, Math.round((item.filled / item.needed) * 100)) : 0
                    const open = item.needed - item.filled
                    const isFull = open <= 0

                    return (
                      <div
                        key={item.id}
                        className={`border rounded-xl p-5 ${isFull ? 'border-green-200 bg-green-50/50' : open > 5 ? 'border-orange-200 bg-orange-50/30' : 'border-nm-line'}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-black text-nm-blue text-sm">{item.district}</h3>
                          {isFull ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-800">Besetzt</span>
                          ) : open > 5 ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">{open} gesucht</span>
                          ) : (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">{open} gesucht</span>
                          )}
                        </div>
                        <p className="text-xs text-nm-muted mb-3">{item.city}</p>

                        {/* Progress bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-nm-muted mb-1">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {item.filled} / {item.needed}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="progress-track">
                            <div
                              className={`h-full transition-all duration-700 rounded-full ${isFull ? 'bg-green-500' : pct > 60 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        {/* Contact */}
                        {(item.contactEmail || item.contactPhone) && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.contactEmail && (
                              <a
                                href={`mailto:${item.contactEmail}`}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-nm-blue border border-nm-blue/30 rounded-lg px-3 py-1.5 hover:bg-nm-blue hover:text-white transition-all"
                              >
                                <Mail className="h-3 w-3" /> Kontakt aufnehmen
                              </a>
                            )}
                            {item.contactPhone && (
                              <a
                                href={`tel:${item.contactPhone}`}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-nm-muted border border-nm-line rounded-lg px-3 py-1.5 hover:border-nm-blue hover:text-nm-blue transition-all"
                              >
                                <Phone className="h-3 w-3" /> {item.contactPhone}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
