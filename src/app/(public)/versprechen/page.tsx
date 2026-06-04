'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, TrendingUp, XCircle, Target } from 'lucide-react'

interface Versprechen {
  id: string
  title: string
  description?: string
  status: string
  category: string
}

const STATUS: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  gefordert:   { label: 'Gefordert',        icon: <Target className="h-4 w-4" />,       color: 'text-nm-blue',    bg: 'bg-nm-blue/10' },
  diskussion:  { label: 'In Diskussion',    icon: <Clock className="h-4 w-4" />,         color: 'text-amber-600',  bg: 'bg-amber-50' },
  umgesetzt:   { label: 'Umgesetzt',        icon: <CheckCircle2 className="h-4 w-4" />,  color: 'text-green-600',  bg: 'bg-green-50' },
  abgelehnt:   { label: 'Abgelehnt',        icon: <XCircle className="h-4 w-4" />,       color: 'text-red-500',    bg: 'bg-red-50' },
}

export default function VersprechenPage() {
  const [items, setItems] = useState<Versprechen[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('alle')

  useEffect(() => {
    fetch('/api/versprechen').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const byStatus = {
    gefordert:  items.filter(i => i.status === 'gefordert').length,
    diskussion: items.filter(i => i.status === 'diskussion').length,
    umgesetzt:  items.filter(i => i.status === 'umgesetzt').length,
    abgelehnt:  items.filter(i => i.status === 'abgelehnt').length,
  }

  const visible = filter === 'alle' ? items : items.filter(i => i.status === filter)
  const categories = [...new Set(items.map(i => i.category))]

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Transparenz</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Versprechen-Tracker</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Wir halten fest, was wir fordern – und ob es umgesetzt wird. Volle Transparenz, kein Kleingedrucktes.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {Object.entries(STATUS).map(([key, s]) => (
            <button
              key={key}
              onClick={() => setFilter(filter === key ? 'alle' : key)}
              className={`border rounded-xl p-4 text-left transition-all ${filter === key ? 'border-nm-blue shadow-sm' : 'border-nm-line hover:border-nm-blue/40'}`}
            >
              <div className={`flex items-center gap-1.5 mb-2 ${s.color}`}>{s.icon}<span className="text-xs font-bold">{s.label}</span></div>
              <div className="text-2xl font-black text-nm-blue">{byStatus[key as keyof typeof byStatus]}</div>
            </button>
          ))}
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilter('alle')} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${filter === 'alle' ? 'bg-nm-blue text-white border-nm-blue' : 'border-nm-line text-nm-muted hover:border-nm-blue hover:text-nm-blue'}`}>
            Alle ({items.length})
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${filter === cat ? 'bg-nm-blue text-white border-nm-blue' : 'border-nm-line text-nm-muted hover:border-nm-blue hover:text-nm-blue'}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? <div className="text-center py-20 text-nm-muted">Wird geladen…</div> : (
          <div className="space-y-3 max-w-3xl">
            {visible.map(item => {
              const s = STATUS[item.status] ?? STATUS['gefordert']
              return (
                <div key={item.id} className="border border-nm-line rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0 ${s.bg} ${s.color}`}>
                      {s.icon}
                      <span className="text-[11px] font-bold">{s.label}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-nm-blue leading-snug">{item.title}</p>
                      {item.description && <p className="text-nm-muted text-sm mt-1.5 leading-relaxed">{item.description}</p>}
                      <span className="text-[11px] text-nm-muted mt-1.5 block">{item.category}</span>
                    </div>
                  </div>
                </div>
              )
            })}
            {visible.length === 0 && <div className="text-center py-16 text-nm-muted">Keine Einträge in dieser Kategorie.</div>}
          </div>
        )}
      </div>
    </div>
  )
}
