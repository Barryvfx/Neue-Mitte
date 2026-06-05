'use client'

import { useState, useEffect } from 'react'
import { Search, BookOpen } from 'lucide-react'

interface GlossarItem {
  id: string
  term: string
  definition: string
  category: string
  letter: string
}

const LETTERS = ['Alle', 'A', 'B', 'D', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'O', 'P', 'R', 'S', 'Ü', 'V', 'W', 'Z']
const CATEGORIES = ['Alle', 'Grundbegriffe', 'Verfassung', 'Parlament', 'Wahlen', 'Regierung', 'Bürgerrechte', 'Finanzen', 'Geschichte', 'Politik']

export default function GlossarPage() {
  const [items, setItems] = useState<GlossarItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [letter, setLetter] = useState('Alle')
  const [category, setCategory] = useState('Alle')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/glossar')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  const visible = items.filter(i => {
    const matchLetter = letter === 'Alle' || i.letter === letter
    const matchCat = category === 'Alle' || i.category === category
    const matchSearch = !search || i.term.toLowerCase().includes(search.toLowerCase()) || i.definition.toLowerCase().includes(search.toLowerCase())
    return matchLetter && matchCat && matchSearch
  })

  // Group by letter
  const grouped: Record<string, GlossarItem[]> = {}
  for (const item of visible) {
    if (!grouped[item.letter]) grouped[item.letter] = []
    grouped[item.letter].push(item)
  }
  const sortedLetters = Object.keys(grouped).sort()

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Wissen</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 opacity-80" /> Politisches Glossar
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Über 35 politische Begriffe einfach erklärt – von Abstimmung bis Zweitstimme.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-nm-muted" />
          <input
            type="text"
            placeholder="Begriff suchen…"
            value={search}
            onChange={e => { setSearch(e.target.value); setLetter('Alle') }}
            className="nm-input pl-10 max-w-md"
          />
        </div>

        {/* Letter filter */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {LETTERS.map(l => (
            <button key={l} onClick={() => { setLetter(l); setSearch('') }}
              className={`min-w-[2rem] px-2.5 py-1 text-xs font-black rounded border transition-colors ${letter === l ? 'bg-nm-blue text-white border-nm-blue' : 'border-nm-line text-nm-muted hover:border-nm-blue hover:text-nm-blue'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${category === c ? 'bg-nm-blue text-white border-nm-blue' : 'border-nm-line text-nm-muted hover:border-nm-blue'}`}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-nm-muted">Wird geladen…</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-12 w-12 text-nm-line mx-auto mb-4" />
            <p className="text-nm-muted">Kein Begriff gefunden.</p>
          </div>
        ) : (
          <div className="space-y-8 max-w-3xl">
            {sortedLetters.map(l => (
              <div key={l}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-black text-nm-blue w-10">{l}</span>
                  <div className="flex-1 h-px bg-nm-line" />
                </div>
                <div className="space-y-2">
                  {grouped[l].map(item => (
                    <div key={item.id}
                      className="border border-nm-line rounded-xl overflow-hidden cursor-pointer hover:border-nm-blue/40 transition-colors"
                      onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                      <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-nm-text">{item.term}</span>
                          <span className="px-2 py-0.5 bg-nm-gray text-nm-muted text-[10px] font-semibold rounded-full">{item.category}</span>
                        </div>
                        <span className={`text-nm-muted text-lg transition-transform duration-200 ${expanded === item.id ? 'rotate-45' : ''}`}>+</span>
                      </div>
                      {expanded === item.id && (
                        <div className="px-5 pb-4 border-t border-nm-line bg-nm-gray/30">
                          <p className="text-nm-text text-sm leading-relaxed pt-3">{item.definition}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
