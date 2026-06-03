'use client'

import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [honeypot, setHoneypot] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: honeypot }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Ein Fehler ist aufgetreten.')
        setStatus('error')
        return
      }
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
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">
            Newsletter
          </p>
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
            Informiert bleiben
          </h2>
          <p className="text-white/70 text-sm mb-6">
            Erhalten Sie Neuigkeiten der Neuen Mitte direkt in Ihr Postfach.
          </p>

          {status === 'success' ? (
            <p className="text-white font-semibold border border-white/30 px-6 py-3 inline-block">
              Sie sind angemeldet. Danke!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-0 max-w-sm mx-auto">
              {/* honeypot – must stay empty */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ihre E-Mail-Adresse"
                required
                className="flex-1 px-4 py-2.5 text-sm bg-white text-nm-blue placeholder-nm-blue/40 border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-5 py-2.5 transition-colors whitespace-nowrap border border-white/20"
              >
                {status === 'loading' ? '…' : 'Anmelden'}
              </button>
            </form>
          )}
          {error && <p className="text-red-300 text-xs mt-2">{error}</p>}
        </div>
      </div>
    </section>
  )
}
