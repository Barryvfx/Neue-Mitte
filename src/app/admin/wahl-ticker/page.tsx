'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Plus, Trash2, Radio, Star } from 'lucide-react'

interface Item { id: string; text: string; important: boolean; createdAt: string }
interface Ticker { id: string; title: string; active: boolean; items: Item[] }

export default function AdminWahlTickerPage() {
  const [tickers, setTickers] = useState<Ticker[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newText, setNewText] = useState('')
  const [important, setImportant] = useState(false)
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    fetch('/api/admin/wahl-ticker').then(r => r.json()).then(d => { const arr = Array.isArray(d) ? d : []; setTickers(arr); if (arr.length > 0) setSelected(arr[0].id) }).catch(() => {})
  }, [])

  async function createTicker() {
    if (!newTitle.trim()) return
    const res = await fetch('/api/admin/wahl-ticker', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newTitle }) })
    const t = await res.json()
    setTickers(prev => [{ ...t, items: [] }, ...prev])
    setSelected(t.id); setNewTitle('')
  }

  async function toggleActive(t: Ticker) {
    await fetch(`/api/admin/wahl-ticker/${t.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !t.active }) })
    setTickers(prev => prev.map(x => x.id === t.id ? { ...x, active: !x.active } : x))
  }

  async function deleteTicker(id: string) {
    if (!confirm('Ticker löschen?')) return
    await fetch(`/api/admin/wahl-ticker/${id}`, { method: 'DELETE' })
    setTickers(prev => prev.filter(x => x.id !== id))
    if (selected === id) setSelected(tickers[0]?.id ?? null)
  }

  async function postItem() {
    if (!newText.trim() || !selected) return
    setPosting(true)
    const res = await fetch(`/api/admin/wahl-ticker/${selected}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText, important }),
    })
    const item = await res.json()
    setTickers(prev => prev.map(t => t.id === selected ? { ...t, items: [item, ...t.items] } : t))
    setNewText(''); setImportant(false); setPosting(false)
  }

  const activeTicker = tickers.find(t => t.id === selected)

  return (
    <AdminShell active="wahl-ticker">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Live-Ticker</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Echtzeit-Updates für Wahlen und wichtige Ereignisse</p>
        </div>

        {/* Create ticker */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 mb-5 flex gap-3">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && createTicker()} placeholder="Neuen Ticker erstellen (z. B. Bundestagswahl 2025)" className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30" />
          <button onClick={createTicker} disabled={!newTitle.trim()} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-nm-blue text-white rounded-xl hover:bg-nm-blue/90 disabled:opacity-40">
            <Plus className="h-4 w-4" /> Erstellen
          </button>
        </div>

        {/* Ticker list */}
        {tickers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {tickers.map(t => (
              <button key={t.id} onClick={() => setSelected(t.id)} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${selected === t.id ? 'bg-nm-blue text-white border-nm-blue' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                {t.active && <Radio className="h-3 w-3 text-red-400" />}
                {t.title}
              </button>
            ))}
          </div>
        )}

        {activeTicker && (
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 dark:text-white text-sm">{activeTicker.title}</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(activeTicker)} className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${activeTicker.active ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                    {activeTicker.active ? '● LIVE' : '○ Offline'}
                  </button>
                  <button onClick={() => deleteTicker(activeTicker.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
              <textarea value={newText} onChange={e => setNewText(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl resize-none dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 mb-3" placeholder="Update-Text eingeben…" />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  <input type="checkbox" checked={important} onChange={e => setImportant(e.target.checked)} className="rounded border-gray-300 text-nm-blue" />
                  <Star className="h-3.5 w-3.5 text-amber-400" /> Wichtig
                </label>
                <button onClick={postItem} disabled={posting || !newText.trim()} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-nm-blue text-white rounded-xl hover:bg-nm-blue/90 disabled:opacity-40">
                  {posting ? 'Posten…' : 'Posten'}
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 max-h-96 overflow-y-auto">
              <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Updates ({activeTicker.items.length})</h2>
              <div className="space-y-2">
                {activeTicker.items.map(item => (
                  <div key={item.id} className={`p-3 rounded-lg text-sm ${item.important ? 'bg-nm-blue/5 border border-nm-blue/20' : 'bg-gray-50 dark:bg-gray-700'}`}>
                    {item.important && <Star className="h-3 w-3 text-amber-400 mb-1" />}
                    <p className="text-gray-800 dark:text-gray-200">{item.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</p>
                  </div>
                ))}
                {activeTicker.items.length === 0 && <p className="text-xs text-gray-400 text-center py-4">Noch keine Updates.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
