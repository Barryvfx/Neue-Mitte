'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Plus, Trash2, Eye, EyeOff, MapPin, Calendar, Mail } from 'lucide-react'

type EhrenamtKategorie = 'Wahlkampf' | 'Veranstaltung' | 'Verwaltung' | 'Kommunikation' | 'Bildung' | 'Sonstiges'

interface EhrenamtStelle {
  id: string
  title: string
  description: string
  location: string
  date: string
  category: EhrenamtKategorie
  contact: string
  active: boolean
  createdAt: string
}

const CATEGORIES: EhrenamtKategorie[] = ['Wahlkampf', 'Veranstaltung', 'Verwaltung', 'Kommunikation', 'Bildung', 'Sonstiges']

const CATEGORY_COLOR: Record<EhrenamtKategorie, string> = {
  Wahlkampf: 'bg-nm-blue/20 text-blue-300',
  Veranstaltung: 'bg-purple-900/40 text-purple-300',
  Verwaltung: 'bg-amber-900/40 text-amber-300',
  Kommunikation: 'bg-cyan-900/40 text-cyan-300',
  Bildung: 'bg-green-900/40 text-green-300',
  Sonstiges: 'bg-gray-700 text-gray-300',
}

export default function AdminEhrenamtPage() {
  const [items, setItems] = useState<EhrenamtStelle[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState<EhrenamtKategorie>('Wahlkampf')
  const [contact, setContact] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<EhrenamtStelle | null>(null)

  useEffect(() => {
    fetch('/api/admin/ehrenamt')
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : []
        setItems(arr)
        if (arr.length > 0) setPreview(arr[0])
      })
      .catch(() => {})
  }, [])

  function resetForm() {
    setTitle(''); setDescription(''); setLocation(''); setDate(''); setCategory('Wahlkampf'); setContact(''); setError('')
  }

  async function create() {
    if (!title.trim() || !description.trim() || !contact.trim()) {
      setError('Titel, Beschreibung und Kontakt sind Pflicht'); return
    }
    setSaving(true); setError('')
    const res = await fetch('/api/admin/ehrenamt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, location, date, category, contact }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Fehler'); setSaving(false); return }
    setItems(prev => [json, ...prev])
    setPreview(json)
    resetForm(); setShowForm(false); setSaving(false)
  }

  async function toggleActive(item: EhrenamtStelle) {
    const active = !item.active
    await fetch(`/api/admin/ehrenamt/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    })
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, active } : x))
    if (preview?.id === item.id) setPreview(p => p ? { ...p, active } : p)
  }

  async function del(id: string) {
    if (!confirm('Ehrenamtsstelle löschen?')) return
    await fetch(`/api/admin/ehrenamt/${id}`, { method: 'DELETE' })
    setItems(prev => {
      const next = prev.filter(x => x.id !== id)
      if (preview?.id === id) setPreview(next[0] ?? null)
      return next
    })
  }

  function formatDate(str: string) {
    if (!str) return null
    try { return new Date(str).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
    catch { return str }
  }

  return (
    <AdminShell active="ehrenamt">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-white">Ehrenamt</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {items.length} Stellen · {items.filter(i => i.active).length} aktiv
            </p>
          </div>
          <button
            onClick={() => { setShowForm(f => !f); if (showForm) resetForm() }}
            className="flex items-center gap-2 text-sm font-bold bg-nm-blue text-white px-4 py-2 rounded-xl hover:bg-nm-blue/90 transition-all"
          >
            <Plus className="h-4 w-4" /> Neue Stelle
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: list + form */}
          <div className="lg:col-span-3 space-y-4">
            {/* Create form */}
            {showForm && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-3">
                <h2 className="text-sm font-bold text-white">Neue Ehrenamtsstelle</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Titel *</label>
                    <input
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                      placeholder="z. B. Wahlkampfhelfer gesucht"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Kategorie</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as EhrenamtKategorie)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Ort (optional)</label>
                    <input
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                      placeholder="z. B. Berlin"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Datum (optional)</label>
                    <input
                      type="datetime-local"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Beschreibung *</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white resize-none focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                      placeholder="Was wird gemacht? Was wird gebraucht?"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Kontakt (E-Mail) *</label>
                    <input
                      value={contact}
                      onChange={e => setContact(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-600 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                      placeholder="ehrenamt@neue-mitte.de"
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
              {items.map(item => (
                <div
                  key={item.id}
                  onClick={() => setPreview(item)}
                  className={`bg-gray-800 border rounded-xl p-4 cursor-pointer transition-all ${preview?.id === item.id ? 'border-nm-blue/60' : 'border-gray-700 hover:border-gray-500'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[item.category]}`}>
                          {item.category}
                        </span>
                        {!item.active && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-700 text-gray-500">Inaktiv</span>
                        )}
                      </div>
                      <p className="font-bold text-white text-sm leading-snug">{item.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                        {item.location && (
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {item.location}</span>
                        )}
                        {item.date && (
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(item.date)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
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
              ))}
              {items.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">Noch keine Stellen ausgeschrieben.</div>
              )}
            </div>
          </div>

          {/* Right: preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sticky top-24">
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Vorschau — Public Card</p>
              {preview ? (
                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                  <div className="px-4 pt-4 pb-3 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[preview.category]}`}>
                        {preview.category}
                      </span>
                      {preview.active
                        ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-900/40 text-green-400">Aktiv</span>
                        : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-700 text-gray-500">Inaktiv</span>
                      }
                    </div>
                    <h3 className="font-black text-white text-sm leading-snug">{preview.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{preview.description}</p>
                  </div>
                  <div className="px-4 py-3 border-t border-gray-700/50 space-y-1.5">
                    {preview.location && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                        {preview.location}
                      </div>
                    )}
                    {preview.date && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                        {formatDate(preview.date)}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Mail className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                      {preview.contact}
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-2">
                    <button className="w-full py-2 text-xs font-bold bg-nm-blue text-white rounded-lg opacity-70 cursor-default">
                      Jetzt mitmachen
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 text-center text-gray-600 text-xs">
                  Wähle eine Stelle aus der Liste.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
