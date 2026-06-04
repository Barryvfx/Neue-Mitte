'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ThumbsUp, Loader2, ChevronLeft, Send } from 'lucide-react'

interface DebatteArg {
  id: string
  text: string
  seite: 'pro' | 'contra'
  votes: number
}

interface Debatte {
  id: string
  title: string
  topic: string
  argumente: DebatteArg[]
}

export default function DebatteDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [debatte, setDebatte] = useState<Debatte | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [seite, setSeite] = useState<'pro' | 'contra'>('pro')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/debatte?id=${id}`)
      .then(r => r.json())
      .then(d => { setDebatte(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

  async function vote(argId: string) {
    if (voting) return
    setVoting(argId)
    await fetch(`/api/debatte/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ argId }),
    })
    setVoting(null)
    load()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    const res = await fetch('/api/debatte', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ debatteId: id, text, seite }),
    })
    setSubmitting(false)
    if (res.ok) {
      setSubmitted(true)
      setText('')
      load()
    }
  }

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-nm-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Wird geladen…</span>
        </div>
      </div>
    )
  }

  if (!debatte) {
    return (
      <div className="bg-white min-h-screen">
        <div className="nm-container py-20 text-center">
          <p className="text-nm-muted text-lg">Debatte nicht gefunden.</p>
          <Link href="/debatte" className="btn-primary mt-6">Zurück zur Übersicht</Link>
        </div>
      </div>
    )
  }

  const pro = debatte.argumente.filter(a => a.seite === 'pro')
  const contra = debatte.argumente.filter(a => a.seite === 'contra')

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-14 sm:py-16">
          <Link href="/debatte" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-5 transition-colors">
            <ChevronLeft className="h-4 w-4" /> Alle Debatten
          </Link>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white/80 mb-4 inline-block">
            {debatte.topic}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mt-3">{debatte.title}</h1>
        </div>
      </div>

      <div className="nm-container py-10">
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* PRO */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              <h2 className="text-base font-black text-green-700 uppercase tracking-wide">Pro</h2>
              <span className="text-xs text-nm-muted">({pro.length})</span>
            </div>
            <div className="space-y-3">
              {pro.map(arg => (
                <ArgCard key={arg.id} arg={arg} onVote={vote} voting={voting} />
              ))}
              {pro.length === 0 && (
                <p className="text-nm-muted text-sm border border-dashed border-nm-line rounded-xl p-5 text-center">
                  Noch keine Pro-Argumente.
                </p>
              )}
            </div>
          </div>

          {/* CONTRA */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <h2 className="text-base font-black text-red-600 uppercase tracking-wide">Contra</h2>
              <span className="text-xs text-nm-muted">({contra.length})</span>
            </div>
            <div className="space-y-3">
              {contra.map(arg => (
                <ArgCard key={arg.id} arg={arg} onVote={vote} voting={voting} />
              ))}
              {contra.length === 0 && (
                <p className="text-nm-muted text-sm border border-dashed border-nm-line rounded-xl p-5 text-center">
                  Noch keine Contra-Argumente.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Add argument form */}
        <div className="border border-nm-line rounded-xl p-6 max-w-2xl">
          <h3 className="font-black text-nm-blue text-lg mb-4">Argument hinzufügen</h3>

          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">
              Ihr Argument wurde eingereicht. Vielen Dank!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="nm-label">Ihr Argument *</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={3}
                maxLength={500}
                className="nm-input"
                placeholder="Begründen Sie Ihre Position…"
                required
              />
            </div>
            <div>
              <label className="nm-label">Position *</label>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center justify-center gap-2 border-2 rounded-lg py-2.5 cursor-pointer transition-all text-sm font-semibold ${seite === 'pro' ? 'border-green-500 bg-green-50 text-green-700' : 'border-nm-line text-nm-muted hover:border-green-300'}`}>
                  <input type="radio" name="seite" value="pro" checked={seite === 'pro'} onChange={() => setSeite('pro')} className="sr-only" />
                  <ThumbsUp className="h-4 w-4" /> Pro
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 border-2 rounded-lg py-2.5 cursor-pointer transition-all text-sm font-semibold ${seite === 'contra' ? 'border-red-500 bg-red-50 text-red-600' : 'border-nm-line text-nm-muted hover:border-red-300'}`}>
                  <input type="radio" name="seite" value="contra" checked={seite === 'contra'} onChange={() => setSeite('contra')} className="sr-only" />
                  Contra
                </label>
              </div>
            </div>
            <button type="submit" disabled={submitting || !text.trim()} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Einreichen…</> : <><Send className="h-4 w-4" /> Argument einreichen</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function ArgCard({ arg, onVote, voting }: { arg: DebatteArg; onVote: (id: string) => void; voting: string | null }) {
  const isVoting = voting === arg.id
  const border = arg.seite === 'pro' ? 'border-l-green-400' : 'border-l-red-400'
  return (
    <div className={`border border-nm-line border-l-4 ${border} rounded-xl p-4 flex gap-3`}>
      <div className="flex-1 min-w-0">
        <p className="text-nm-text text-sm leading-relaxed">{arg.text}</p>
      </div>
      <button
        onClick={() => onVote(arg.id)}
        disabled={isVoting}
        className="flex-shrink-0 flex flex-col items-center gap-0.5 text-nm-muted hover:text-nm-blue transition-colors"
      >
        {isVoting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
        <span className="text-xs font-bold tabular-nums">{arg.votes}</span>
      </button>
    </div>
  )
}
