'use client'

import { useState } from 'react'
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react'

export default function ZusammenfassungPage() {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function summarize() {
    if (text.length < 50) { setError('Bitte geben Sie mindestens 50 Zeichen ein.'); return }
    setLoading(true); setError(''); setSummary('')
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Fehler'); return }
      setSummary(data.summary)
    } catch {
      setError('Verbindungsfehler.')
    }
    setLoading(false)
  }

  async function copy() {
    await navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">KI-Tool</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Texte einfach zusammengefasst
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Fügen Sie einen politischen Text, ein Gesetz oder eine Pressemitteilung ein — die KI erstellt eine präzise 3-Satz-Zusammenfassung.
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
      <div className="max-w-2xl mx-auto">

        <div className="space-y-4">
          <div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={10}
              placeholder="Fügen Sie hier Ihren Text ein… (min. 50 Zeichen)"
              className="w-full px-4 py-3 text-sm border border-nm-line rounded-xl focus:outline-none focus:ring-2 focus:ring-nm-blue/30 resize-none font-mono"
            />
            <p className="text-xs text-nm-muted mt-1 text-right">{text.length} Zeichen</p>
          </div>

          <button
            onClick={summarize}
            disabled={loading || text.length < 50}
            className="w-full flex items-center justify-center gap-2 py-3 bg-nm-blue text-white font-bold rounded-xl hover:bg-nm-blue/90 disabled:opacity-40 transition-all"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? 'Wird zusammengefasst…' : 'Zusammenfassen'}
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {summary && (
            <div className="bg-nm-blue/5 border border-nm-blue/20 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <h2 className="font-bold text-nm-blue text-sm">Zusammenfassung</h2>
                <button onClick={copy} className="flex items-center gap-1.5 text-xs text-nm-muted hover:text-nm-blue transition-colors">
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Kopiert' : 'Kopieren'}
                </button>
              </div>
              <p className="text-nm-text text-sm leading-relaxed">{summary}</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
