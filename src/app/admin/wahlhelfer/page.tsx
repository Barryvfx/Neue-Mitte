'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Plus, Trash2, Eye, EyeOff, MapPin, Minus, Users } from 'lucide-react'

interface Wahlhelfer {
  id: string
  district: string
  city: string
  state: string
  needed: number
  filled: number
  contact: string
  active: boolean
  createdAt: string
}

const GERMAN_STATES = [
  'Bayern', 'Baden-Württemberg', 'Berlin', 'Brandenburg', 'Bremen',
  'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
  'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
  'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen',
]

export default function AdminWahlhelferPage() {
  const [items, setItems] = useState<Wahlhelfer[]>([])
  const [showForm, setShowForm] = useState(false)
  const [district, setDistrict] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Bayern')
  const [needed, setNeeded] = useState(5)
  const [contact, setContact] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<Wahlhelfer | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/wahlhelfer')
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : []
        setItems(arr)
        if (arr.length > 0) setPreview(arr[0])
      })
      .catch(() => {})
  }, [])

  function resetForm() {
    setDistrict(''); setCity(''); setState('Bayern'); setNeeded(5); setContact(''); setError('')
  }

  async function create() {
    if (!district.trim() || !city.trim() || !contact.trim()) {
      setError('Bezirk, Stadt und Kontakt sind Pflicht'); return
    }
    setSaving(true); setError('')
    const res = await fetch('/api/admin/wahlhelfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ district, city, state, needed, contact }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Fehler'); setSaving(false); return }
    setItems(prev => [json, ...prev])
    setPreview(json)
    resetForm(); setShowForm(false); setSaving(false)
  }

  async function updateFilled(item: Wahlhelfer, delta: number) {
    const filled = Math.max(0, Math.min(item.needed, item.filled + delta))
    if (filled === item.filled) return
    setUpdatingId(item.id)
    await fetch(`/api/admin/wahlhelfer/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filled }),
    })
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, filled } : x))
    if (preview?.id === item.id) setPreview(p => p ? { ...p, filled } : p)
    setUpdatingId(null)
  }

  async function toggleActive(item: Wahlhelfer) {
    const active = !item.active
    await fetch(`/api/admin/wahlhelfer/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    })
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, active } : x))
    if (preview?.id === item.id) setPreview(p => p ? { ...p, active } : p)
  }

  async function del(id: string) {
    if (!confirm('Wahlhelfer-Stelle löschen?')) return
    await fetch(`/api/admin/wahlhelfer/${id}`, { method: 'DELETE' })
    setItems(prev => {
      const next = prev.filter(x => x.id !== id)
      if (preview?.id === id) setPreview(next[0] ?? null)
      return next
    })
  }

  function progressColor(filled: number, needed: number) {
    const pct = needed > 0 ? filled / needed : 0
    if (pct >= 1) return 'bg-green-500'
    if (pct >= 0.5) return 'bg-nm-blue'
    return 'bg-amber-500'
  }

  const totalNeeded = items.reduce((s, i) => s + i.needed, 0)
  const totalFilled = items.reduce((s, i) => s + i.filled, 0)

  return (
    <AdminShell active="wahlhelfer">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-white">Wahlhelfer</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {items.length} Bezirke · {totalFilled}/{totalNeeded} besetzt · {items.filter(i => i.active).length} aktiv
            </p>
          </div>
          <button
            onClick={() => { setShowForm(f => !f); if (showForm) resetForm() }}
            className="flex items-center gap-2 text-sm font-bold bg-nm-blue text-white px-4 py-2 rounded-xl hover:bg-nm-blue/90 transition-all"
          >
            <Plus className="h-4 w-4" /> Neuer Bezirk
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: list + form */}
          <div className="lg:col-span-3 space-y-4">
            {/* Create form */}
            {showForm && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-3">
                <h2 className="text-sm font-bold text-white">Neuer Wahlhelfer-Bezirk</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Bezirk / Wahlkreis *</label>
                    <input
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                      placeholder="z. B. Mitte"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Stadt *</label>
                    <input
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                      placeholder="z. B. Berlin"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Bundesland</label>
                    <select
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    >
                      {GERMAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Benötigt (Anzahl)</label>
                    <input
                      type="number"
                      min={1}
                      value={needed}
                      onChange={e => setNeeded(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Kontakt (E-Mail) *</label>
                    <input
                      value={contact}
                      onChange={e => setContact(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                      placeholder="wahlhelfer@neue-mitte.de"
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
              {items.map(item => {
                const pct = item.needed > 0 ? Math.round((item.filled / item.needed) * 100) : 0
                return (
                  <div
                    key={item.id}
                    onClick={() => setPreview(item)}
                    className={`bg-gray-800 border rounded-xl p-4 cursor-pointer transition-all ${preview?.id === item.id ? 'border-nm-blue/60' : 'border-gray-700 hover:border-gray-500'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                            {item.state}
                          </span>
                          {!item.active && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-700 text-gray-500">Inaktiv</span>
                          )}
                          {pct >= 100 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-900/40 text-green-400">Voll besetzt</span>
                          )}
                        </div>
                        <p className="font-bold text-white text-sm leading-snug">{item.district} — {item.city}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{item.filled} von {item.needed} besetzt</span>
                            <span className="font-bold">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${progressColor(item.filled, item.needed)}`} style={{ width: `${Math.min(100, pct)}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                        {/* +/- filled */}
                        <div className="flex items-center gap-1 bg-gray-700 rounded-lg px-1">
                          <button
                            onClick={() => updateFilled(item, -1)}
                            disabled={item.filled <= 0 || updatingId === item.id}
                            className="p-1 hover:text-white text-gray-400 disabled:opacity-30"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-xs font-bold text-white w-5 text-center">{item.filled}</span>
                          <button
                            onClick={() => updateFilled(item, 1)}
                            disabled={item.filled >= item.needed || updatingId === item.id}
                            className="p-1 hover:text-white text-gray-400 disabled:opacity-30"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => toggleActive(item)}
                          className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                          title={item.active ? 'Deaktivieren' : 'Aktivieren'}
                        >
                          {item.active
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
                <div className="text-center py-12 text-gray-500 text-sm">Noch keine Bezirke angelegt.</div>
              )}
            </div>
          </div>

          {/* Right: preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sticky top-24">
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Vorschau — Public Card</p>
              {preview ? (() => {
                const pct = preview.needed > 0 ? Math.round((preview.filled / preview.needed) * 100) : 0
                const remaining = Math.max(0, preview.needed - preview.filled)
                return (
                  <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                    <div className="px-4 pt-4 pb-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-nm-blue/20 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-4 w-4 text-nm-blue" />
                        </div>
                        <div>
                          <p className="font-black text-white text-sm leading-tight">{preview.district}</p>
                          <p className="text-[10px] text-gray-500">{preview.city} · {preview.state}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 flex items-center gap-1"><Users className="h-3 w-3" /> Helfer benötigt</span>
                          <span className="font-bold text-white">{preview.filled}/{preview.needed}</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${progressColor(preview.filled, preview.needed)}`} style={{ width: `${Math.min(100, pct)}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-500 text-right">
                          {remaining > 0 ? `Noch ${remaining} Plätze frei` : 'Vollständig besetzt'}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 pb-4 pt-2 border-t border-gray-700/50">
                      <button className="w-full py-2 text-xs font-bold bg-nm-blue text-white rounded-lg opacity-70 cursor-default">
                        Als Wahlhelfer registrieren
                      </button>
                    </div>
                  </div>
                )
              })() : (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 text-center text-gray-600 text-xs">
                  Wähle einen Bezirk aus der Liste.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
