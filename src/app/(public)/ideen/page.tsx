'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, Lightbulb, CheckCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

interface Idee {
  id: string
  title: string
  description: string
  authorName?: string
  votes: number
  status: string
  createdAt: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  eingereicht:  { label: 'Eingereicht',  color: 'bg-gray-100 text-gray-600' },
  geprüft:      { label: 'Geprüft',      color: 'bg-blue-100 text-blue-700' },
  angenommen:   { label: 'Angenommen',   color: 'bg-green-100 text-green-700' },
  abgelehnt:    { label: 'Abgelehnt',    color: 'bg-red-100 text-red-700' },
}

export default function IdeenPage() {
  const [items, setItems] = useState<Idee[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [voted, setVoted] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/ideen').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
    const stored = localStorage.getItem('idee_voted')
    if (stored) setVoted(new Set(JSON.parse(stored)))
  }, [])

  async function vote(id: string) {
    if (voted.has(id)) return
    const res = await fetch(`/api/ideen/${id}/vote`, { method: 'POST' })
    if (res.ok) {
      const { votes } = await res.json()
      setItems(prev => prev.map(x => x.id === id ? { ...x, votes } : x).sort((a, b) => b.votes - a.votes))
      const next = new Set(voted).add(id)
      setVoted(next)
      localStorage.setItem('idee_voted', JSON.stringify([...next]))
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return
    setSubmitting(true)
    const res = await fetch('/api/ideen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, authorName: authorName || undefined }),
    })
    setSubmitting(false)
    if (res.ok) { setSubmitted(true); setShowForm(false); setTitle(''); setDescription(''); setAuthorName('') }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Mitgestalten</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Ideen-Plattform</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Schlagen Sie Programmpunkte vor. Die beliebtesten Ideen fließen in das Schattenprogramm der Neuen Mitte ein.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-nm-muted">
            {items.filter(i => i.status === 'angenommen').length} angenommen · {items.length} Ideen gesamt
          </p>
          <button onClick={() => setShowForm(f => !f)} className="btn-primary text-sm px-5 py-2.5">
            <Lightbulb className="h-4 w-4" /> Idee einreichen
          </button>
        </div>

        {submitted && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm">
            <CheckCircle className="h-4 w-4" /> Ihre Idee wurde eingereicht. Vielen Dank!
          </div>
        )}

        {showForm && (
          <form onSubmit={submit} className="bg-nm-gray border border-nm-line rounded-xl p-5 mb-6 space-y-3">
            <div>
              <label className="nm-label">Titel der Idee *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="nm-input" placeholder="z. B. Digitales Behördenportal für alle Anträge" required maxLength={150} />
            </div>
            <div>
              <label className="nm-label">Beschreibung *</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} maxLength={1000} className="nm-input" placeholder="Beschreiben Sie Ihre Idee genauer…" required />
            </div>
            <div>
              <label className="nm-label">Ihr Name <span className="font-normal normal-case text-nm-muted">(optional)</span></label>
              <input value={authorName} onChange={e => setAuthorName(e.target.value)} className="nm-input" placeholder="Anonym oder Ihr Name" maxLength={80} />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={submitting} className="btn-primary text-sm px-5 py-2">
                {submitting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Senden…</> : 'Idee einreichen'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-nm-muted hover:text-nm-blue transition-colors px-3">Abbrechen</button>
            </div>
          </form>
        )}

        {loading ? <div className="text-center py-20 text-nm-muted">Wird geladen…</div> : (
          <div className="space-y-3 max-w-3xl">
            {items.map(item => {
              const s = STATUS_CONFIG[item.status] ?? STATUS_CONFIG['eingereicht']
              return (
                <div key={item.id} className="border border-nm-line rounded-xl overflow-hidden">
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
                      <div className="flex items-start gap-2 mb-1">
                        <p className="font-bold text-nm-blue leading-snug flex-1">{item.title}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${s.color}`}>{s.label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-nm-muted">
                        {item.authorName && <span>{item.authorName}</span>}
                        <span>{new Date(item.createdAt).toLocaleDateString('de-DE')}</span>
                      </div>
                    </div>
                    <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="flex-shrink-0 text-nm-muted hover:text-nm-blue transition-colors">
                      {expanded === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                  {expanded === item.id && (
                    <div className="border-t border-nm-line bg-nm-gray/50 px-4 py-3">
                      <p className="text-nm-muted text-sm leading-relaxed">{item.description}</p>
                    </div>
                  )}
                </div>
              )
            })}
            {items.length === 0 && <div className="text-center py-16 text-nm-muted">Noch keine Ideen. Reichen Sie die erste ein!</div>}
          </div>
        )}
      </div>
    </div>
  )
}
