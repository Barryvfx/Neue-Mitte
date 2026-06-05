'use client'

import { useState, useEffect } from 'react'
import { Quote, Copy, Check } from 'lucide-react'

interface ZitatItem {
  id: string
  text: string
  author: string
  year: number | null
  context: string | null
  category: string
}

const CATEGORIES = ['Alle', 'Demokratie', 'Freiheit', 'Politik', 'Bildung', 'Wandel', 'Werte', 'Mut', 'Engagement', 'Wirtschaft', 'Verantwortung']

const CAT_COLORS: Record<string, string> = {
  'Demokratie': 'bg-blue-100 text-blue-800',
  'Freiheit': 'bg-green-100 text-green-800',
  'Politik': 'bg-purple-100 text-purple-800',
  'Bildung': 'bg-yellow-100 text-yellow-800',
  'Wandel': 'bg-orange-100 text-orange-800',
  'Werte': 'bg-red-100 text-red-800',
  'Mut': 'bg-pink-100 text-pink-800',
  'Engagement': 'bg-indigo-100 text-indigo-800',
  'Wirtschaft': 'bg-teal-100 text-teal-800',
}

export default function ZitatePage() {
  const [items, setItems] = useState<ZitatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('Alle')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/zitate')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  function copy(item: ZitatItem) {
    const text = `„${item.text}" – ${item.author}${item.year ? ` (${item.year})` : ''}`
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(item.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const visible = category === 'Alle' ? items : items.filter(i => i.category === category)

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Inspiration</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 flex items-center gap-3">
            <Quote className="h-8 w-8 opacity-80" /> Zitate-Galerie
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Kluge Worte über Demokratie, Freiheit und politische Verantwortung.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${category === c ? 'bg-nm-blue text-white border-nm-blue' : 'border-nm-line text-nm-muted hover:border-nm-blue'}`}>
              {c} {c !== 'Alle' && <span className="opacity-60">({items.filter(i => i.category === c).length})</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-nm-muted">Wird geladen…</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map(item => (
              <div key={item.id} className="border border-nm-line rounded-xl p-5 flex flex-col justify-between hover:border-nm-blue/30 transition-colors group">
                <div>
                  <Quote className="h-6 w-6 text-nm-blue/20 mb-3" />
                  <blockquote className="text-nm-text text-sm leading-relaxed font-medium mb-4">
                    „{item.text}"
                  </blockquote>
                </div>
                <div className="flex items-end justify-between gap-2 mt-auto pt-3 border-t border-nm-line">
                  <div>
                    <p className="text-xs font-black text-nm-blue">{item.author}</p>
                    {item.year && <p className="text-[10px] text-nm-muted">{item.year}</p>}
                    {item.context && <p className="text-[10px] text-nm-muted italic line-clamp-1">{item.context}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${CAT_COLORS[item.category] ?? 'bg-nm-gray text-nm-muted'}`}>{item.category}</span>
                    <button onClick={() => copy(item)}
                      className="p-1.5 rounded-lg text-nm-muted hover:text-nm-blue hover:bg-nm-gray transition-colors">
                      {copied === item.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
