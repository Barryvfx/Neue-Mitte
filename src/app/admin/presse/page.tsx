'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Eye, EyeOff, FileText } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'

interface Release {
  id: string
  title: string
  excerpt: string
  fileUrl?: string
  published: boolean
  date: string
}

export default function AdminPressePage() {
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/presse').then(r => r.json()).then(d => { setReleases(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  async function create() {
    if (!title.trim() || !excerpt.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/presse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, fileUrl: fileUrl || null, published: true, date }),
      })
      const r = await res.json()
      setReleases(prev => [r, ...prev])
      setTitle(''); setExcerpt(''); setFileUrl(''); setShowForm(false)
    } finally { setSaving(false) }
  }

  async function togglePublished(r: Release) {
    await fetch(`/api/admin/presse/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !r.published }),
    })
    setReleases(prev => prev.map(x => x.id === r.id ? { ...x, published: !x.published } : x))
  }

  async function del(id: string) {
    if (!confirm('Löschen?')) return
    await fetch(`/api/admin/presse/${id}`, { method: 'DELETE' })
    setReleases(prev => prev.filter(x => x.id !== id))
  }

  return (
    <AdminShell active="presse">
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Pressemitteilungen</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{releases.length} Mitteilungen</p>
        </div>
        <button onClick={() => setShowForm(f => !f)} className="flex items-center gap-2 text-sm font-bold bg-nm-blue text-white px-4 py-2 rounded-xl hover:bg-nm-blue/90 transition-all">
          <Plus className="h-4 w-4" /> Neue Mitteilung
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 mb-6 space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Neue Pressemitteilung</h2>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Titel *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30" placeholder="Titel der Pressemitteilung" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Inhalt / Zusammenfassung *</label>
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={4} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 resize-none" placeholder="Kurze Zusammenfassung oder vollständiger Text…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">PDF-Link (optional)</label>
              <input value={fileUrl} onChange={e => setFileUrl(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30" placeholder="/presse/datei.pdf oder externe URL" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Datum</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={create} disabled={saving || !title.trim() || !excerpt.trim()} className="px-4 py-2 text-sm font-bold bg-nm-blue text-white rounded-xl hover:bg-nm-blue/90 disabled:opacity-40 transition-all">
              {saving ? 'Speichern…' : 'Veröffentlichen'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400">Wird geladen…</div>
      ) : (
        <div className="space-y-3">
          {releases.map(r => (
            <div key={r.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-start gap-4">
              <FileText className="h-5 w-5 text-nm-muted flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 dark:text-white text-sm">{r.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{new Date(r.date).toLocaleDateString('de-DE')} · {r.published ? <span className="text-green-600">Veröffentlicht</span> : <span className="text-amber-500">Entwurf</span>}</div>
                <div className="text-xs text-gray-400 mt-1 line-clamp-2">{r.excerpt}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublished(r)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title={r.published ? 'Verstecken' : 'Veröffentlichen'}>
                  {r.published ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                </button>
                <button onClick={() => del(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
          {releases.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">Noch keine Pressemitteilungen.</div>
          )}
        </div>
      )}
    </div>
    </AdminShell>
  )
}
