'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Loader2, Users } from 'lucide-react'

interface Stats { count: number; goal: number }

export default function PetitionPage() {
  const [stats, setStats] = useState<Stats>({ count: 0, goal: 10000 })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/petition').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  const percent = Math.min(100, Math.round((stats.count / stats.goal) * 100))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim()) { setError('Bitte Name und E-Mail ausfüllen.'); return }
    setStatus('loading')
    try {
      const res = await fetch('/api/petition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), city: city.trim() || undefined }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Fehler.'); setStatus('error'); return }
      setStatus('done')
      setStats(s => ({ ...s, count: s.count + 1 }))
    } catch {
      setError('Verbindungsfehler.')
      setStatus('error')
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Mitmachen</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Petition: Deutschland braucht eine Neue Mitte
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Unterzeichnen Sie jetzt und zeigen Sie: Deutschland braucht eine pragmatische, glaubwürdige politische Mitte.
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* Left: info + progress */}
          <div>
            <div className="bg-nm-gray border border-nm-line rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-5 w-5 text-nm-blue" />
                <span className="font-bold text-nm-blue text-lg">{stats.count.toLocaleString('de-DE')} Unterzeichner</span>
              </div>
              <div className="progress-track mb-2">
                <div className="progress-fill" style={{ width: `${percent}%` }} />
              </div>
              <div className="flex justify-between text-xs text-nm-muted mt-1">
                <span>{percent}% erreicht</span>
                <span>Ziel: {stats.goal.toLocaleString('de-DE')}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-black text-nm-blue mb-3">Warum diese Petition?</h2>
              <p className="text-nm-muted leading-relaxed mb-4">
                Deutschland steckt in einer politischen Krise. Extreme Parteien gewinnen, während die Mitte schweigt.
                Wir fordern eine neue politische Kraft, die pragmatisch handelt, Bürokratie abbaut und echte Lösungen liefert –
                statt ideologischer Debatten.
              </p>
              <h3 className="text-base font-bold text-nm-blue mb-2">Unsere Kernforderungen:</h3>
              <ul className="space-y-2 text-nm-muted">
                {[
                  'Schnellere, digitale Behörden',
                  'Weniger Bürokratie für Unternehmen und Bürger',
                  'Moderne Schulen und bessere Bildung',
                  'Ein Staat, der Probleme löst statt verwaltet',
                ].map(f => (
                  <li key={f} className="flex gap-2"><span className="text-nm-blue font-bold mt-0.5">—</span>{f}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: form */}
          <div>
            {status === 'done' ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-green-800 mb-2">Vielen Dank!</h3>
                <p className="text-green-700 text-sm">Ihre Unterschrift wurde erfolgreich aufgezeichnet.</p>
              </div>
            ) : (
              <div className="bg-white border border-nm-line rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-black text-nm-blue mb-5">Jetzt unterzeichnen</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="nm-label">Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="nm-input"
                      placeholder="Ihr vollständiger Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="nm-label">E-Mail *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="nm-input"
                      placeholder="ihre@email.de"
                      required
                    />
                  </div>
                  <div>
                    <label className="nm-label">Wohnort <span className="font-normal normal-case">(optional)</span></label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="nm-input"
                      placeholder="z. B. Berlin"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full justify-center"
                  >
                    {status === 'loading' ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Wird gesendet…</>
                    ) : (
                      'Jetzt unterzeichnen'
                    )}
                  </button>
                  <p className="text-[11px] text-nm-muted text-center leading-relaxed">
                    Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
