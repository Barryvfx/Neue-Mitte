'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Plus, Trash2, Eye, EyeOff, Lock, FileText, Star } from 'lucide-react'

type MitgliederTyp = 'dokument' | 'entwurf' | 'exklusiv'

interface MitgliederInhalt {
  id: string
  title: string
  content: string
  type: MitgliederTyp
  order: number
  published: boolean
  createdAt: string
}

const TYPE_CONFIG: Record<MitgliederTyp, { label: string; color: string; icon: React.ElementType }> = {
  dokument: { label: 'Dokument', color: 'bg-nm-blue/20 text-blue-300', icon: FileText },
  entwurf: { label: 'Entwurf', color: 'bg-amber-900/40 text-amber-300', icon: FileText },
  exklusiv: { label: 'Exklusiv', color: 'bg-purple-900/40 text-purple-300', icon: Star },
}

export default function AdminMitgliederPage() {
  const [items, setItems] = useState<MitgliederInhalt[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<MitgliederTyp>('dokument')
  const [order, setOrder] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<MitgliederInhalt | null>(null)

  useEffect(() => {
    fetch('/api/admin/mitglieder')
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : []
        const sorted = arr.sort((a: MitgliederInhalt, b: MitgliederInhalt) => a.order - b.order)
        setItems(sorted)
        if (sorted.length > 0) setPreview(sorted[0])
      })
      .catch(() => {})
  }, [])

  function resetForm() {
    setTitle(''); setContent(''); setType('dokument')
    setOrder(items.length > 0 ? Math.max(...items.map(i => i.order)) + 1 : 0)
    setError('')
  }

  async function create() {
    if (!title.trim() || !content.trim()) { setError('Titel und Inhalt sind Pflicht'); return }
    setSaving(true); setError('')
    const res = await fetch('/api/admin/mitglieder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, type, order }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Fehler'); setSaving(false); return }
    setItems(prev => [...prev, json].sort((a, b) => a.order - b.order))
    setPreview(json)
    resetForm(); setShowForm(false); setSaving(false)
  }

  async function updateOrder(item: MitgliederInhalt, newOrder: number) {
    await fetch(`/api/admin/mitglieder/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrder }),
    })
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, order: newOrder } : x).sort((a, b) => a.order - b.order))
    if (preview?.id === item.id) setPreview(p => p ? { ...p, order: newOrder } : p)
  }

  async function togglePublished(item: MitgliederInhalt) {
    const published = !item.published
    await fetch(`/api/admin/mitglieder/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published }),
    })
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, published } : x))
    if (preview?.id === item.id) setPreview(p => p ? { ...p, published } : p)
  }

  async function del(id: string) {
    if (!confirm('Inhalt löschen?')) return
    await fetch(`/api/admin/mitglieder/${id}`, { method: 'DELETE' })
    setItems(prev => {
      const next = prev.filter(x => x.id !== id)
      if (preview?.id === id) setPreview(next[0] ?? null)
      return next
    })
  }

  return (
    <AdminShell active="mitglieder">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-white">Mitgliederbereich</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {items.length} Inhalte · {items.filter(i => i.published).length} veröffentlicht
            </p>
          </div>
          <button
            onClick={() => { setShowForm(f => !f); if (showForm) resetForm() }}
            className="flex items-center gap-2 text-sm font-bold bg-nm-blue text-white px-4 py-2 rounded-xl hover:bg-nm-blue/90 transition-all"
          >
            <Plus className="h-4 w-4" /> Neuer Inhalt
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: list + form */}
          <div className="lg:col-span-3 space-y-4">
            {/* Create form */}
            {showForm && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-3">
                <h2 className="text-sm font-bold text-white">Neuer Mitglieder-Inhalt</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Titel *</label>
                    <input
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                      placeholder="z. B. Satzung 2025"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Typ</label>
                    <select
                      value={type}
                      onChange={e => setType(e.target.value as MitgliederTyp)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    >
                      <option value="dokument">Dokument</option>
                      <option value="entwurf">Entwurf</option>
                      <option value="exklusiv">Exklusiv</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Reihenfolge</label>
                    <input
                      type="number"
                      value={order}
                      onChange={e => setOrder(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Inhalt *</label>
                    <textarea
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white resize-none focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                      placeholder="Inhalt des Dokuments oder der Information…"
                    />
                  </div>
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
              {items.map((item) => {
                const cfg = TYPE_CONFIG[item.type]
                const Icon = cfg.icon
                return (
                  <div
                    key={item.id}
                    onClick={() => setPreview(item)}
                    className={`bg-gray-800 border rounded-xl p-4 cursor-pointer transition-all ${preview?.id === item.id ? 'border-nm-blue/60' : 'border-gray-700 hover:border-gray-500'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-700 text-gray-400 flex-shrink-0 text-sm font-black">
                        {item.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
                            <Icon className="h-3 w-3" /> {cfg.label}
                          </span>
                          {!item.published && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-700 text-gray-500">Unveröffentlicht</span>
                          )}
                        </div>
                        <p className="font-bold text-white text-sm leading-snug">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.content}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                        {/* order input */}
                        <input
                          type="number"
                          value={item.order}
                          onChange={e => updateOrder(item, parseInt(e.target.value) || 0)}
                          onClick={e => e.stopPropagation()}
                          className="w-14 px-2 py-1 text-xs border border-gray-600 rounded-lg bg-gray-900 text-white text-center focus:outline-none focus:ring-1 focus:ring-nm-blue/30"
                          title="Reihenfolge"
                        />
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
                )
              })}
              {items.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">Noch keine Mitglieder-Inhalte.</div>
              )}
            </div>
          </div>

          {/* Right: preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sticky top-24">
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Vorschau — Mitgliederbereich</p>
              {preview ? (() => {
                const cfg = TYPE_CONFIG[preview.type]
                const Icon = cfg.icon
                return (
                  <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                    {/* locked header strip */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-nm-blue/10 border-b border-nm-blue/20">
                      <Lock className="h-3.5 w-3.5 text-nm-blue flex-shrink-0" />
                      <span className="text-[10px] font-bold text-nm-blue uppercase tracking-wider">Nur für Mitglieder</span>
                    </div>
                    <div className="px-4 py-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
                          <Icon className="h-3.5 w-3.5" /> {cfg.label}
                        </div>
                        <span className="text-[10px] text-gray-600">#{preview.order}</span>
                      </div>
                      <h3 className="font-black text-white text-sm leading-snug">{preview.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-5">{preview.content}</p>
                      <button className="w-full mt-2 py-2 text-xs font-bold border border-nm-blue/40 text-nm-blue rounded-lg opacity-70 cursor-default">
                        Herunterladen / Ansehen
                      </button>
                    </div>
                  </div>
                )
              })() : (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 text-center text-gray-600 text-xs">
                  Wähle einen Inhalt aus der Liste.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
