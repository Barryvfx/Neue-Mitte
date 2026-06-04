'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, MessageSquarePlus, CheckCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

interface Frage {
  id: string
  question: string
  authorName: string
  votes: number
  answered: boolean
  answer?: string
  createdAt: string
}

export default function BuergerFragenPage() {
  const [items, setItems] = useState<Frage[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [question, setQuestion] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [voted, setVoted] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/buergerfragen').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
    const stored = localStorage.getItem('bf_voted')
    if (stored) setVoted(new Set(JSON.parse(stored)))
  }, [])

  async function vote(id: string) {
    if (voted.has(id)) return
    const res = await fetch(`/api/buergerfragen/${id}/vote`, { method: 'POST' })
    if (res.ok) {
      const { votes } = await res.json()
      setItems(prev => prev.map(x => x.id === id ? { ...x, votes } : x).sort((a, b) => b.votes - a.votes))
      const next = new Set(voted).add(id)
      setVoted(next)
      localStorage.setItem('bf_voted', JSON.stringify([...next]))
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || !authorName.trim()) return
    setSubmitting(true)
    const res = await fetch('/api/buergerfragen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, authorName }),
    })
    setSubmitting(false)
    if (res.ok) { setSubmitted(true); setShowForm(false) }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Bürgernähe</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Bürgerfragen</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Stellen Sie Ihre Frage an die Neue Mitte. Die meistgevoteteten Fragen werden öffentlich beantwortet.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-nm-muted">{items.filter(i => i.answered).length} beantwortet · {items.length} Fragen insgesamt</p>
          <button onClick={() => setShowForm(f => !f)} className="btn-primary text-sm px-5 py-2.5">
            <MessageSquarePlus className="h-4 w-4" /> Frage stellen
          </button>
        </div>

        {submitted && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm">
            <CheckCircle className="h-4 w-4" /> Ihre Frage wurde eingereicht und wird nach Prüfung veröffentlicht.
          </div>
        )}

        {showForm && (
          <form onSubmit={submit} className="bg-nm-gray border border-nm-line rounded-xl p-5 mb-6 space-y-3">
            <div>
              <label className="nm-label">Ihre Frage *</label>
              <textarea value={question} onChange={e => setQuestion(e.target.value)} rows={3} maxLength={500} className="nm-input" placeholder="Was möchten Sie die Neue Mitte fragen?" required />
            </div>
            <div>
              <label className="nm-label">Ihr Name *</label>
              <input value={authorName} onChange={e => setAuthorName(e.target.value)} className="nm-input" placeholder="Vor- und Nachname oder Pseudonym" required maxLength={80} />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={submitting} className="btn-primary text-sm px-5 py-2">
                {submitting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Senden…</> : 'Frage einreichen'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-nm-muted hover:text-nm-blue transition-colors px-3">Abbrechen</button>
            </div>
          </form>
        )}

        {loading ? <div className="text-center py-20 text-nm-muted">Wird geladen…</div> : (
          <div className="space-y-3 max-w-3xl">
            {items.map(item => (
              <div key={item.id} className={`border rounded-xl overflow-hidden transition-all ${item.answered ? 'border-nm-blue/30 bg-nm-blue/[0.02]' : 'border-nm-line'}`}>
                <div className="flex items-start gap-4 p-4">
                  <button
                    onClick={() => vote(item.id)}
                    disabled={voted.has(item.id)}
                    className={`flex flex-col items-center gap-0.5 flex-shrink-0 pt-0.5 ${voted.has(item.id) ? 'text-nm-blue' : 'text-nm-muted hover:text-nm-blue'} transition-colors`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-xs font-bold tabular-nums">{item.votes}</span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-nm-text leading-snug mb-1">{item.question}</p>
                    <div className="flex items-center gap-3 text-xs text-nm-muted">
                      <span>{item.authorName}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString('de-DE')}</span>
                      {item.answered && <span className="text-nm-blue font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Beantwortet</span>}
                    </div>
                  </div>
                  {item.answered && (
                    <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="flex-shrink-0 text-nm-blue hover:opacity-70 transition-opacity">
                      {expanded === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                {item.answered && expanded === item.id && item.answer && (
                  <div className="border-t border-nm-blue/20 bg-nm-blue/5 px-4 py-4">
                    <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-nm-blue mb-2">Antwort der Neuen Mitte</p>
                    <p className="text-nm-text text-sm leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
            {items.length === 0 && <div className="text-center py-16 text-nm-muted">Noch keine Fragen. Seien Sie der Erste!</div>}
          </div>
        )}
      </div>
    </div>
  )
}
