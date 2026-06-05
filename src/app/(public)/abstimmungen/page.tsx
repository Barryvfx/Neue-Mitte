'use client'

import { useState, useEffect } from 'react'
import { Vote, CheckCircle } from 'lucide-react'

interface AbstimmungItem {
  id: string
  question: string
  context: string
  category: string
  ja: number
  nein: number
  enthaltung: number
  total: number
}

const POSITION_CONFIG = {
  ja: { label: 'Ja', color: 'bg-green-500', text: 'text-green-700', border: 'border-green-300 bg-green-50 hover:bg-green-100' },
  nein: { label: 'Nein', color: 'bg-red-500', text: 'text-red-700', border: 'border-red-300 bg-red-50 hover:bg-red-100' },
  enthaltung: { label: 'Enthaltung', color: 'bg-gray-400', text: 'text-gray-600', border: 'border-gray-300 bg-gray-50 hover:bg-gray-100' },
}

function ResultBar({ ja, nein, enthaltung, total }: { ja: number; nein: number; enthaltung: number; total: number }) {
  if (total === 0) return <div className="h-2 bg-nm-gray rounded-full" />
  const pJa = Math.round((ja / total) * 100)
  const pNein = Math.round((nein / total) * 100)
  const pEnt = 100 - pJa - pNein
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {pJa > 0 && <div className="bg-green-500 transition-all duration-700" style={{ width: `${pJa}%` }} />}
        {pNein > 0 && <div className="bg-red-500 transition-all duration-700" style={{ width: `${pNein}%` }} />}
        {pEnt > 0 && <div className="bg-gray-300 transition-all duration-700" style={{ width: `${pEnt}%` }} />}
      </div>
      <div className="flex justify-between text-[10px] text-nm-muted mt-1">
        <span className="text-green-700 font-bold">Ja {pJa}%</span>
        <span className="text-nm-muted">{total} Stimmen</span>
        <span className="text-red-600 font-bold">Nein {pNein}%</span>
      </div>
    </div>
  )
}

export default function AbstimmungenPage() {
  const [items, setItems] = useState<AbstimmungItem[]>([])
  const [loading, setLoading] = useState(true)
  const [voted, setVoted] = useState<Record<string, string>>({})
  const [voting, setVoting] = useState<string | null>(null)

  async function fetchItems() {
    const res = await fetch('/api/abstimmung')
    if (res.ok) setItems(await res.json())
  }

  useEffect(() => {
    fetchItems().then(() => setLoading(false))
  }, [])

  async function vote(abstimmungId: string, position: string) {
    if (voted[abstimmungId] || voting) return
    setVoting(abstimmungId)
    const res = await fetch('/api/abstimmung', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ abstimmungId, position }),
    })
    if (res.ok || res.status === 409) {
      setVoted(v => ({ ...v, [abstimmungId]: position }))
      await fetchItems()
    }
    setVoting(null)
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Demokratie</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 flex items-center gap-3">
            <Vote className="h-8 w-8 opacity-80" /> Bürgervoting
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Stimme zu aktuellen politischen Fragen ab und sieh, wie Deutschland denkt.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        {loading ? (
          <div className="text-center py-20 text-nm-muted">Wird geladen…</div>
        ) : (
          <div className="max-w-2xl space-y-6">
            {items.map(item => {
              const hasVoted = !!voted[item.id]
              return (
                <div key={item.id} className="border border-nm-line rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2 py-0.5 text-[10px] font-black bg-nm-blue/10 text-nm-blue rounded-full">{item.category}</span>
                    {hasVoted && (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                        <CheckCircle className="h-3.5 w-3.5" /> Abgestimmt
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-nm-text text-base mb-2">{item.question}</h3>
                  <p className="text-xs text-nm-muted leading-relaxed mb-4">{item.context}</p>

                  {!hasVoted ? (
                    <div className="flex gap-2">
                      {(['ja', 'nein', 'enthaltung'] as const).map(pos => {
                        const cfg = POSITION_CONFIG[pos]
                        return (
                          <button key={pos} onClick={() => vote(item.id, pos)}
                            disabled={voting === item.id}
                            className={`flex-1 py-2.5 text-sm font-black rounded-xl border transition-all ${cfg.border} ${voting === item.id ? 'opacity-50' : ''}`}>
                            <span className={cfg.text}>{cfg.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <ResultBar ja={item.ja} nein={item.nein} enthaltung={item.enthaltung} total={item.total} />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
