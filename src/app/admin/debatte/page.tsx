'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Plus, Trash2, ToggleLeft, ToggleRight, ThumbsUp, ThumbsDown } from 'lucide-react'

interface Debatte {
  id: string
  title: string
  topic: string
  status: 'offen' | 'geschlossen'
  proCount: number
  contraCount: number
  createdAt: string
}

const TOPICS = [
  'Allgemein', 'Wirtschaft', 'Finanzen', 'Soziales', 'Migration',
  'Bildung', 'Energie', 'Sicherheit', 'Digitalisierung', 'Umwelt',
]

const TOPIC_COLOR: Record<string, string> = {
  Wirtschaft: 'bg-amber-900/40 text-amber-300',
  Finanzen: 'bg-green-900/40 text-green-300',
  Soziales: 'bg-purple-900/40 text-purple-300',
  Migration: 'bg-orange-900/40 text-orange-300',
  Bildung: 'bg-blue-900/40 text-blue-300',
  Energie: 'bg-yellow-900/40 text-yellow-300',
  Sicherheit: 'bg-red-900/40 text-red-300',
  Digitalisierung: 'bg-cyan-900/40 text-cyan-300',
  Umwelt: 'bg-emerald-900/40 text-emerald-300',
  Allgemein: 'bg-gray-700 text-gray-300',
}

export default function AdminDebattePage() {
  const [items, setItems] = useState<Debatte[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('Allgemein')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<Debatte | null>(null)

  useEffect(() => {
    fetch('/api/admin/debatte')
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : []
        setItems(arr)
        if (arr.length > 0) setPreview(arr[0])
      })
      .catch(() => {})
  }, [])

  async function create() {
    if (!title.trim()) return
    setSaving(true); setError('')
    const res = await fetch('/api/admin/debatte', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, topic }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Fehler'); setSaving(false); return }
    setItems(prev => [json, ...prev])
    setPreview(json)
    setTitle(''); setShowForm(false); setSaving(false)
  }

  async function toggleStatus(item: Debatte) {
    const newStatus = item.status === 'offen' ? 'geschlossen' : 'offen'
    await fetch(`/api/admin/debatte/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, status: newStatus } : x))
    if (preview?.id === item.id) setPreview(p => p ? { ...p, status: newStatus } : p)
  }

  async function del(id: string) {
    if (!confirm('Debatte löschen?')) return
    await fetch(`/api/admin/debatte/${id}`, { method: 'DELETE' })
    setItems(prev => {
      const next = prev.filter(x => x.id !== id)
      if (preview?.id === id) setPreview(next[0] ?? null)
      return next
    })
  }

  const previewItem = preview ?? (items.length > 0 ? items[0] : null)

  return (
    <AdminShell active="debatte">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-white">Debatten</h1>
            <p className="text-sm text-gray-400 mt-0.5">{items.length} Debatten · {items.filter(i => i.status === 'offen').length} offen</p>
          </div>
          <button
            onClick={() => setShowForm(f => !f)}
            className="flex items-center gap-2 text-sm font-bold bg-nm-blue text-white px-4 py-2 rounded-xl hover:bg-nm-blue/90 transition-all"
          >
            <Plus className="h-4 w-4" /> Neue Debatte
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: list + form */}
          <div className="lg:col-span-3 space-y-4">
            {/* Create form */}
            {showForm && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-3">
                <h2 className="text-sm font-bold text-white">Neue Debatte erstellen</h2>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Titel *</label>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    placeholder="z. B. Soll Deutschland die Schuldenbremse abschaffen?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Thema</label>
                  <select
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                  >
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={create}
                    disabled={saving || !title.trim()}
                    className="px-4 py-2 text-sm font-bold bg-nm-blue text-white rounded-xl hover:bg-nm-blue/90 disabled:opacity-40 transition-all"
                  >
                    {saving ? 'Erstellen…' : 'Erstellen'}
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-3 py-2 text-sm text-gray-400 hover:text-gray-200">
                    Abbrechen
                  </button>
                </div>
              </div>
            )}

            {/* List */}
            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  onClick={() => setPreview(item)}
                  className={`bg-gray-800 border rounded-xl p-4 cursor-pointer transition-all ${preview?.id === item.id ? 'border-nm-blue/60' : 'border-gray-700 hover:border-gray-500'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TOPIC_COLOR[item.topic] ?? TOPIC_COLOR['Allgemein']}`}>
                          {item.topic}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'offen' ? 'bg-green-900/40 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="font-bold text-white text-sm leading-snug">{item.title}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3 text-green-500" /> {item.proCount ?? 0} Pro</span>
                        <span className="flex items-center gap-1"><ThumbsDown className="h-3 w-3 text-red-400" /> {item.contraCount ?? 0} Contra</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => toggleStatus(item)}
                        className={`p-1.5 rounded-lg transition-colors ${item.status === 'offen' ? 'hover:bg-green-900/30 text-green-400' : 'hover:bg-gray-700 text-gray-500'}`}
                        title={item.status === 'offen' ? 'Schließen' : 'Öffnen'}
                      >
                        {item.status === 'offen'
                          ? <ToggleRight className="h-5 w-5" />
                          : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => del(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">
                  Noch keine Debatten. Erstelle die erste!
                </div>
              )}
            </div>
          </div>

          {/* Right: preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sticky top-24">
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Vorschau — Public Card</p>
              {previewItem ? (
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TOPIC_COLOR[previewItem.topic] ?? TOPIC_COLOR['Allgemein']}`}>
                      {previewItem.topic}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${previewItem.status === 'offen' ? 'bg-green-900/40 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
                      {previewItem.status === 'offen' ? 'Offen' : 'Geschlossen'}
                    </span>
                  </div>
                  <h3 className="font-black text-white text-sm leading-snug mb-4">{previewItem.title}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-950/60 border border-green-800/40 rounded-lg p-3 text-center">
                      <ThumbsUp className="h-5 w-5 text-green-400 mx-auto mb-1" />
                      <p className="text-xs font-bold text-green-400">Pro</p>
                      <p className="text-lg font-black text-green-300">{previewItem.proCount ?? 0}</p>
                      <p className="text-[10px] text-green-600">Argumente</p>
                    </div>
                    <div className="bg-red-950/60 border border-red-800/40 rounded-lg p-3 text-center">
                      <ThumbsDown className="h-5 w-5 text-red-400 mx-auto mb-1" />
                      <p className="text-xs font-bold text-red-400">Contra</p>
                      <p className="text-lg font-black text-red-300">{previewItem.contraCount ?? 0}</p>
                      <p className="text-[10px] text-red-600">Argumente</p>
                    </div>
                  </div>
                  {previewItem.status === 'offen' && (
                    <button className="w-full mt-3 py-2 text-xs font-bold bg-nm-blue text-white rounded-lg opacity-70 cursor-default">
                      Argument einbringen
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 text-center text-gray-600 text-xs">
                  Wähle eine Debatte aus der Liste, um sie hier zu sehen.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
