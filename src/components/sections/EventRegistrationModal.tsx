'use client'

import { useState } from 'react'
import { X, CalendarCheck, Loader2 } from 'lucide-react'

interface Props {
  eventId: string
  eventTitle: string
  onClose: () => void
}

export default function EventRegistrationModal({ eventId, eventTitle, onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setStatus('sending')
    setError('')
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Fehler bei der Anmeldung.'); setStatus('error'); return }
      setStatus('done')
    } catch {
      setError('Verbindungsfehler.')
      setStatus('error')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-md w-full p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-nm-muted hover:text-nm-blue">
          <X className="w-5 h-5" />
        </button>

        {status === 'done' ? (
          <div className="text-center py-6">
            <CalendarCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-black text-nm-blue text-xl mb-2">Anmeldung bestätigt!</h3>
            <p className="text-nm-muted text-sm">Sie sind jetzt für <strong>{eventTitle}</strong> angemeldet.</p>
            <button onClick={onClose} className="mt-5 btn-primary w-full justify-center">Schließen</button>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-nm-blue mb-1">Anmeldung</p>
            <h3 className="font-black text-nm-blue text-lg leading-snug mb-5">{eventTitle}</h3>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="nm-label">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="nm-input"
                  placeholder="Max Mustermann"
                />
              </div>
              <div>
                <label className="nm-label">E-Mail *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="nm-input"
                  placeholder="max@beispiel.de"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full justify-center"
              >
                {status === 'sending' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Wird angemeldet…</>
                ) : (
                  'Jetzt anmelden'
                )}
              </button>
              <p className="text-[11px] text-nm-muted text-center">
                Kostenlos und unverbindlich.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
