'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Plus, Trash2, Eye, EyeOff, ExternalLink, BookOpen } from 'lucide-react'

interface GesetzFokus {
  id: string
  title: string
  lawName: string
  summary: string
  content: string
  link: string
  published: boolean
  createdAt: string
}

export default function AdminGesetzFokusPage() {
  const [items, setItems] = useState<GesetzFokus[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [lawName, setLawName] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [link, setLink] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<GesetzFokus | null>(null)

  useEffect(() => {
    fetch('/api/admin/gesetz-fokus')
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : []
        setItems(arr)
        if (arr.length > 0) setPreview(arr[0])
      })
      .catch(() => {})
  }, [])

  function resetForm() {
    setTitle(''); setLawName(''); setSummary(''); setContent(''); setLink(''); setError('')
  }

  async function create() {
    if (!title.trim() || !lawName.trim() || !summary.trim() || !content.trim()) {
      setError('Titel, Gesetzesname, Zusammenfassung und Inhalt sind Pflicht'); return
    }
    setSaving(true); setError('')
    const res = await fetch('/api/admin/gesetz-fokus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, lawName, summary, content, link }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Fehler'); setSaving(false); return }
    setItems(prev => [json, ...prev])
    setPreview(json)
    resetForm(); setShowForm(false); setSaving(false)
  }

  async function togglePublished(item: GesetzFokus) {
    const published = !item.published
    await fetch(`/api/admin/gesetz-fokus/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published }),
    })
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, published } : x))
    if (preview?.id === item.id) setPreview(p => p ? { ...p, published } : p)
  }

  async function del(id: string) {
    if (!confirm('Gesetz-Fokus-Eintrag löschen?')) return
    await fetch(`/api/admin/gesetz-fokus/${id}`, { method: 'DELETE' })
    setItems(prev => {
      const next = prev.filter(x => x.id !== id)
      if (preview?.id === id) setPreview(next[0] ?? null)
      return next
    })
  }

  return (
    <AdminShell active="gesetz-fokus">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-white">Gesetz im Fokus</h1>
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
                <h2 className="text-sm font-bold text-white">Neuer Gesetz-Eintrag</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Titel *</label>
                    <input
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                      placeholder="z. B. Was ändert sich 2025?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Offizieller Gesetzesname *</label>
                    <input
                      value={lawName}
                      onChange={e => setLawName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                      placeholder="z. B. Bürgergeldbefähigungsgesetz"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Zusammenfassung (ein Satz) *</label>
                  <input
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    placeholder="Ein Satz, der das Gesetz verständlich erklärt."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Inhalt (ausführlich) *</label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white resize-none focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    placeholder="Ausführliche Erklärung des Gesetzes…"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Offizieller Link (optional)</label>
                  <input
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    placeholder="https://www.gesetze-im-internet.de/…"
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
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-nm-blue/20 text-blue-300">
                          {item.lawName}
                        </span>
                        {!item.published && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-700 text-gray-500">Entwurf</span>
                        )}
                      </div>
                      <p className="font-bold text-white text-sm leading-snug">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.summary}</p>
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
                <div className="text-center py-12 text-gray-500 text-sm">Noch keine Einträge. Erstelle den ersten!</div>
              )}
            </div>
          </div>

          {/* Right: preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sticky top-24">
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Vorschau — Public Card</p>
              {preview ? (
                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                  <div className="px-4 pt-4 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-nm-blue/20 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-4 w-4 text-nm-blue" />
                      </div>
                      <span className="text-[10px] font-bold text-nm-blue truncate">{preview.lawName}</span>
                    </div>
                    <h3 className="font-black text-white text-sm leading-snug mb-1">{preview.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{preview.summary}</p>
                  </div>
                  <div className="px-4 pb-4 pt-2 border-t border-gray-700/50">
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{preview.content}</p>
                  </div>
                  {preview.link && (
                    <div className="px-4 py-2 border-t border-gray-700/50">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-nm-blue">
                        <ExternalLink className="h-3 w-3" /> Offizieller Text
                      </span>
                    </div>
                  )}
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
