'use client'

import { useEffect, useState } from 'react'
import { BarChart2 } from 'lucide-react'

interface Option {
  id: string
  text: string
  votes: number
}

interface Poll {
  id: string
  question: string
  options: Option[]
  total: number
}

export default function PollWidget() {
  const [poll, setPoll] = useState<Poll | null>(null)
  const [voted, setVoted] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/polls')
      .then((r) => r.json())
      .then((data) => { if (data) setPoll(data) })
      .catch(() => {})
  }, [])

  async function vote() {
    if (!poll || !selected || loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId: selected }),
      })
      const json = await res.json()
      if (res.ok) {
        setPoll((p) => p ? { ...p, options: json.options, total: json.total } : p)
        setVoted(true)
      } else if (res.status === 409) {
        setVoted(true)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }

  if (!poll) return null

  return (
    <div className="bg-nm-gray border border-nm-line p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4 text-nm-blue flex-shrink-0" />
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-nm-blue">Abstimmung</p>
      </div>
      <p className="font-black text-nm-blue text-base leading-snug mb-5">{poll.question}</p>

      {voted ? (
        <div className="space-y-3">
          {poll.options.map((opt) => {
            const pct = poll.total > 0 ? Math.round((opt.votes / poll.total) * 100) : 0
            const isSelected = opt.id === selected
            return (
              <div key={opt.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={`font-medium ${isSelected ? 'text-nm-blue font-bold' : 'text-nm-muted'}`}>{opt.text}</span>
                  <span className="text-nm-muted font-mono text-xs">{pct}%</span>
                </div>
                <div className="h-2 bg-white border border-nm-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-nm-blue transition-all duration-700 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
          <p className="text-xs text-nm-muted mt-2">{poll.total} {poll.total === 1 ? 'Stimme' : 'Stimmen'}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {poll.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`w-full text-left px-4 py-3 text-sm border transition-colors ${
                selected === opt.id
                  ? 'border-nm-blue bg-nm-blue text-white font-semibold'
                  : 'border-nm-line bg-white text-nm-muted hover:border-nm-blue hover:text-nm-blue'
              }`}
            >
              {opt.text}
            </button>
          ))}
          <button
            onClick={vote}
            disabled={!selected || loading}
            className="mt-1 btn-primary w-full justify-center disabled:opacity-40"
          >
            {loading ? 'Wird gespeichert…' : 'Abstimmen'}
          </button>
        </div>
      )}
    </div>
  )
}
