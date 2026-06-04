'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Plus, Trash2, Eye, EyeOff, Calendar } from 'lucide-react'

type TransparenzKategorie = 'Entscheidung' | 'Finanzen' | 'Personal' | 'Programm' | 'Sonstiges'

interface TransparenzEintrag {
  id: string
  title: string
  content: string
  category: TransparenzKategorie
  published: boolean
  createdAt: string
}

const CATEGORY_COLOR: Record<TransparenzKategorie, string> = {
  Entscheidung: 'bg-nm-blue/20 text-blue-300',
  Finanzen: 'bg-green-900/40 text-green-300',
  Personal: 'bg-purple-900/40 text-purple-300',
  Programm: 'bg-amber-900/40 text-amber-300',
  Sonstiges: 'bg-gray-700 text-gray-300',
}

const CATEGORIES: TransparenzKategorie[] = ['Entscheidung', 'Finanzen', 'Personal', 'Programm', 'Sonstiges']

export default function AdminTransparenzPage() {
  const [items, setItems] = useState<TransparenzEintrag[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<TransparenzKategorie>('Entscheidung')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<TransparenzEintrag | null>(null)

  useEffect(() => {
    fetch('/api/admin/transparenz')
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : []
        setItems(arr)
        if (arr.length > 0) setPreview(arr[0])
      })
      .catch(() => {})
  }, [])

  function resetForm() {
    setTitle(''); setContent(''); setCategory('Entscheidung'); setError('')
  }

  async function create() {
    if (!title.trim() || !content.trim()) { setError('Titel und Inhalt sind Pflicht'); return }
    setSaving(true); setError('')
    const res = await fetch('/api/admin/transparenz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, category }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Fehler'); setSaving(false); return }
    setItems(prev => [json, ...prev])
    setPreview(json)
    resetForm(); setShowForm(false); setSaving(false)
  }

  async function togglePublished(item: TransparenzEintrag) {
    const published = !item.published
    await fetch(`/api/admin/transparenz/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published }),
    })
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, published } : x))
    if (preview?.id === item.id) setPreview(p => p ? { ...p, published } : p)
  }

  async function del(id: string) {
    if (!confirm('Eintrag löschen?')) return
    await fetch(`/api/admin/transparenz/${id}`, { method: 'DELETE' })
    setItems(prev => {
      const next = prev.filter(x => x.id !== id)
      if (preview?.id === id) setPreview(next[0] ?? null)
      return next
    })
  }

  function formatDate(str: string) {
    try { return new Date(str).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }) }
    catch { return str }
  }

  return (
    <AdminShell active="transparenz">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-white">Transparenz</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {items.length} Einträge · {items.filter(i => i.published).length} veröffentlicht
            </p>
          </div>
          <button
            onClick={() => { setShowForm(f => !f); if (showForm) resetForm() }}
            className="flex items-center gap-2 text-sm font-bold bg-nm-blue text-white px-4 py-2 rounded-xl hover:bg-nm-blue/90 transition-all"
          >
            <Plus className="h-4 w-4" /> Neuer Eintrag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: list + form */}
          <div className="lg:col-span-3 space-y-4">
            {/* Create form */}
            {showForm && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-3">
                <h2 className="text-sm font-bold text-white">Neuer Transparenz-Eintrag</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Titel *</label>
                    <input
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                      placeholder="z. B. Beschluss Vorstand März 2025"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Kategorie</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as TransparenzKategorie)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Inhalt *</label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white resize-none focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    placeholder="Detaillierte Beschreibung des Vorgangs…"
                  />
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={create}
                    disabled={saving}
                    className="px-4 py-2 text-sm font-bold bg-nm-blue text-white rounded-xl hover:bg-nm-blue/90 disabled:opacity-40 transition-all"
                  >
                    {saving ? 'Speichern…' : 'Erstellen'}
                  </button>
                  <button onClick={() => { setShowForm(false); resetForm() }} className="px-3 py-2 text-sm text-gray-400 hover:text-gray-200">
                    Abbrechen
                  </button>
                </div>
              </div>
            )}

            {/* Timeline list */}
            <div className="relative">
              {items.length > 0 && (
                <div className="absolute left-5 top-4 bottom-4 w-px bg-gray-700" />
              )}
              <div className="space-y-3">
                {items.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setPreview(item)}
                    className={`relative bg-gray-800 border rounded-xl p-4 pl-12 cursor-pointer transition-all ${preview?.id === item.id ? 'border-nm-blue/60' : 'border-gray-700 hover:border-gray-500'}`}
                  >
                    <div className="absolute left-3.5 top-4 w-3 h-3 rounded-full border-2 bg-gray-800 flex-shrink-0 z-10"
                      style={{ borderColor: preview?.id === item.id ? 'rgb(59, 130, 246)' : 'rgb(75, 85, 99)' }}
                    />
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[item.category]}`}>
                            {item.category}
                          </span>
                          {!item.published && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-700 text-gray-500">Entwurf</span>
                          )}
                        </div>
                        <p className="font-bold text-white text-sm leading-snug">{item.title}</p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => togglePublished(item)}
                          className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                          title={item.published ? 'Verstecken' : 'Veröffentlichen'}
                        >
                          {item.published
                            ? <Eye className="h-4 w-4 text-green-400" />
                            : <EyeOff className="h-4 w-4 text-gray-500" />}
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
                  <div className="text-center py-12 text-gray-500 text-sm">Noch keine Einträge.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right: preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sticky top-24">
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Vorschau — Timeline-Karte</p>
              {preview ? (
                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-700" />
                  <div className="absolute left-[-4px] top-3 w-2.5 h-2.5 rounded-full bg-nm-blue border-2 border-gray-900" />
                  <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[preview.category]}`}>
                        {preview.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Calendar className="h-3 w-3" /> {formatDate(preview.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-black text-white text-sm leading-snug">{preview.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-5">{preview.content}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 text-center text-gray-600 text-xs">
                  Wähle einen Eintrag aus der Liste.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
