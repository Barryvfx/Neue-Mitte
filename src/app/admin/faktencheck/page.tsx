'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Plus, Trash2, Eye, EyeOff, CheckCircle, XCircle, HelpCircle, AlertTriangle } from 'lucide-react'

type Rating = 'wahr' | 'halb-wahr' | 'falsch' | 'nicht-prüfbar'

interface Faktencheck {
  id: string
  claim: string
  person: string
  rating: Rating
  analysis: string
  sources: string[]
  published: boolean
  createdAt: string
}

const RATING_CONFIG: Record<Rating, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  'wahr': { label: 'Wahr', color: 'text-green-400', bg: 'bg-green-900/40 border-green-800/40', icon: CheckCircle },
  'halb-wahr': { label: 'Halb-wahr', color: 'text-yellow-400', bg: 'bg-yellow-900/40 border-yellow-800/40', icon: AlertTriangle },
  'falsch': { label: 'Falsch', color: 'text-red-400', bg: 'bg-red-900/40 border-red-800/40', icon: XCircle },
  'nicht-prüfbar': { label: 'Nicht prüfbar', color: 'text-gray-400', bg: 'bg-gray-700/40 border-gray-600/40', icon: HelpCircle },
}

export default function AdminFaktencheckPage() {
  const [items, setItems] = useState<Faktencheck[]>([])
  const [showForm, setShowForm] = useState(false)
  const [claim, setClaim] = useState('')
  const [person, setPerson] = useState('')
  const [rating, setRating] = useState<Rating>('wahr')
  const [analysis, setAnalysis] = useState('')
  const [sources, setSources] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<Faktencheck | null>(null)

  useEffect(() => {
    fetch('/api/admin/faktencheck')
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : []
        setItems(arr)
        if (arr.length > 0) setPreview(arr[0])
      })
      .catch(() => {})
  }, [])

  function resetForm() {
    setClaim(''); setPerson(''); setRating('wahr'); setAnalysis(''); setSources(''); setError('')
  }

  async function create() {
    if (!claim.trim() || !analysis.trim()) { setError('Behauptung und Analyse sind Pflicht'); return }
    setSaving(true); setError('')
    const sourcesArr = sources.split('\n').map(s => s.trim()).filter(Boolean)
    const res = await fetch('/api/admin/faktencheck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claim, person, rating, analysis, sources: sourcesArr }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Fehler'); setSaving(false); return }
    setItems(prev => [json, ...prev])
    setPreview(json)
    resetForm(); setShowForm(false); setSaving(false)
  }

  async function togglePublished(item: Faktencheck) {
    const published = !item.published
    await fetch(`/api/admin/faktencheck/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published }),
    })
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, published } : x))
    if (preview?.id === item.id) setPreview(p => p ? { ...p, published } : p)
  }

  async function del(id: string) {
    if (!confirm('Faktencheck löschen?')) return
    await fetch(`/api/admin/faktencheck/${id}`, { method: 'DELETE' })
    setItems(prev => {
      const next = prev.filter(x => x.id !== id)
      if (preview?.id === id) setPreview(next[0] ?? null)
      return next
    })
  }

  return (
    <AdminShell active="faktencheck">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-white">Faktencheck</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {items.length} Einträge · {items.filter(i => i.published).length} veröffentlicht
            </p>
          </div>
          <button
            onClick={() => { setShowForm(f => !f); if (showForm) resetForm() }}
            className="flex items-center gap-2 text-sm font-bold bg-nm-blue text-white px-4 py-2 rounded-xl hover:bg-nm-blue/90 transition-all"
          >
            <Plus className="h-4 w-4" /> Neuer Faktencheck
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: list + form */}
          <div className="lg:col-span-3 space-y-4">
            {/* Create form */}
            {showForm && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-3">
                <h2 className="text-sm font-bold text-white">Neuer Faktencheck</h2>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Behauptung *</label>
                  <textarea
                    value={claim}
                    onChange={e => setClaim(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white resize-none focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    placeholder="Die Behauptung im Wortlaut…"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Person / Quelle</label>
                    <input
                      value={person}
                      onChange={e => setPerson(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                      placeholder="z. B. Max Mustermann"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Bewertung *</label>
                    <select
                      value={rating}
                      onChange={e => setRating(e.target.value as Rating)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    >
                      <option value="wahr">Wahr</option>
                      <option value="halb-wahr">Halb-wahr</option>
                      <option value="falsch">Falsch</option>
                      <option value="nicht-prüfbar">Nicht prüfbar</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Analyse *</label>
                  <textarea
                    value={analysis}
                    onChange={e => setAnalysis(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white resize-none focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    placeholder="Detaillierte Analyse der Behauptung…"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Quellen (eine pro Zeile, optional)</label>
                  <textarea
                    value={sources}
                    onChange={e => setSources(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white resize-none focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    placeholder="https://example.com/quelle1&#10;https://example.com/quelle2"
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
              {items.map(item => {
                const cfg = RATING_CONFIG[item.rating]
                const Icon = cfg.icon
                return (
                  <div
                    key={item.id}
                    onClick={() => setPreview(item)}
                    className={`bg-gray-800 border rounded-xl p-4 cursor-pointer transition-all ${preview?.id === item.id ? 'border-nm-blue/60' : 'border-gray-700 hover:border-gray-500'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                            <Icon className="h-3 w-3" /> {cfg.label}
                          </span>
                          {item.person && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                              {item.person}
                            </span>
                          )}
                          {!item.published && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-700 text-gray-500">Entwurf</span>
                          )}
                        </div>
                        <p className="font-bold text-white text-sm leading-snug line-clamp-2">{item.claim}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.analysis}</p>
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
                )
              })}
              {items.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">Noch keine Faktenchecks.</div>
              )}
            </div>
          </div>

          {/* Right: preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sticky top-24">
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Vorschau — Public Card</p>
              {preview ? (() => {
                const cfg = RATING_CONFIG[preview.rating]
                const Icon = cfg.icon
                return (
                  <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                    <div className={`px-4 py-3 border-b ${cfg.bg}`}>
                      <div className={`inline-flex items-center gap-1.5 text-xs font-black ${cfg.color}`}>
                        <Icon className="h-4 w-4" />
                        {cfg.label.toUpperCase()}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {preview.person && (
                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{preview.person}</p>
                      )}
                      <blockquote className="text-sm font-bold text-white leading-snug border-l-2 border-gray-600 pl-3 line-clamp-3">
                        &ldquo;{preview.claim}&rdquo;
                      </blockquote>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-4">{preview.analysis}</p>
                      {preview.sources && preview.sources.length > 0 && (
                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-[10px] font-semibold text-gray-500 mb-1">{preview.sources.length} Quelle(n)</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })() : (
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
