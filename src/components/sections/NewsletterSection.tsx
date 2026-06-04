'use client'

import { useState } from 'react'

const TOPIC_OPTIONS = ['Wirtschaft', 'Soziales', 'Bildung', 'Energie', 'Migration', 'Sicherheit', 'Digitalisierung', 'Europa']

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'topics'>('email')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [honeypot, setHoneypot] = useState('')

  function toggleTopic(t: string) {
    setSelectedTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStep('topics')
  }

  async function handleSubmit() {
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, topics: selectedTopics.join(','), website: honeypot }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Ein Fehler ist aufgetreten.'); setStatus('error'); return }
      setStatus('success')
    } catch {
      setError('Verbindungsfehler. Bitte erneut versuchen.')
      setStatus('error')
    }
  }

  return (
    <section className="bg-nm-blue">
      <div className="nm-container py-12">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">Newsletter</p>
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Informiert bleiben</h2>
          <p className="text-white/70 text-sm mb-6">Erhalten Sie Neuigkeiten der Neuen Mitte direkt in Ihr Postfach.</p>

          {/* honeypot */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <input type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>

          {status === 'success' ? (
            <p className="text-white font-semibold border border-white/30 px-6 py-3 inline-block rounded-lg">
              Sie sind angemeldet. Danke!
            </p>
          ) : step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="flex gap-0 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Ihre E-Mail-Adresse"
                required
                className="flex-1 px-4 py-2.5 text-sm bg-white text-nm-blue placeholder-nm-blue/40 border-0 focus:outline-none rounded-l-lg"
              />
              <button type="submit" className="bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-5 py-2.5 transition-colors whitespace-nowrap border border-white/20 rounded-r-lg">
                Weiter →
              </button>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <p className="text-white/80 text-sm mb-4">Welche Themen interessieren Sie? (optional)</p>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {TOPIC_OPTIONS.map(t => (
                  <button
                    key={t}
                    onClick={() => toggleTopic(t)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                      selectedTopics.includes(t)
                        ? 'bg-white text-nm-blue border-white'
                        : 'border-white/30 text-white/70 hover:border-white hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 justify-center">
                <button onClick={() => setStep('email')} className="text-sm text-white/50 hover:text-white px-3 py-2">
                  ← Zurück
                </button>
                <button onClick={handleSubmit} disabled={status === 'loading'} className="bg-white text-nm-blue text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-white/90 disabled:opacity-50">
                  {status === 'loading' ? '…' : 'Anmelden'}
                </button>
              </div>
            </div>
          )}
          {error && <p className="text-red-300 text-xs mt-2">{error}</p>}
        </div>
      </div>
    </section>
  )
}
