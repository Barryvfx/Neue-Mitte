'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react'

interface Artikel { id: string; title: string; slug: string; summary: string; content: string; topic: string; published: boolean; createdAt: string }

const TOPICS = ['Allgemein', 'Wirtschaft', 'Finanzen', 'Soziales', 'Migration', 'Bildung', 'Energie', 'Sicherheit', 'Digitalisierung']

export default function AdminErklaertPage() {
  const [items, setItems] = useState<Artikel[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [topic, setTopic] = useState('Allgemein')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/erklaert').then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function create() {
    if (!title.trim() || !summary.trim() || !content.trim()) return
    setSaving(true); setError('')
    const res = await fetch('/api/admin/erklaert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug: slug || autoSlug(title), summary, content, topic }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Fehler'); setSaving(false); return }
    setItems(prev => [json, ...prev])
    setTitle(''); setSlug(''); setSummary(''); setContent(''); setShowForm(false); setSaving(false)
  }

  async function patch(id: string, data: Partial<Artikel>) {
    await fetch(`/api/admin/erklaert/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setItems(prev => prev.map(x => x.id === id ? { ...x, ...data } : x))
  }

  async function del(id: string) {
    if (!confirm('Löschen?')) return
    await fetch(`/api/admin/erklaert/${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(x => x.id !== id))
  }

  return (
    <AdminShell active="erklaert">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">Politik erklärt</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{items.length} Artikel</p>
          </div>
          <button onClick={() => setShowForm(f => !f)} className="flex items-center gap-2 text-sm font-bold bg-nm-blue text-white px-4 py-2 rounded-xl hover:bg-nm-blue/90 transition-all">
            <Plus className="h-4 w-4" /> Neuer Artikel
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 mb-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Titel *</label>
                <input value={title} onChange={e => { setTitle(e.target.value); if (!slug) setSlug(autoSlug(e.target.value)) }} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30" placeholder="z. B. Was ist die Schuldenbremse?" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Thema</label>
                <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30">
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Kurzzusammenfassung *</label>
              <input value={summary} onChange={e => setSummary(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30" placeholder="Ein Satz, was der Artikel erklärt" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Inhalt *</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-nm-blue/30 font-mono" placeholder="Erklärender Text… (Absätze mit Leerzeilen trennen)" />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button onClick={create} disabled={saving} className="px-4 py-2 text-sm font-bold bg-nm-blue text-white rounded-xl hover:bg-nm-blue/90 disabled:opacity-40">{saving ? 'Speichern…' : 'Veröffentlichen'}</button>
              <button onClick={() => setShowForm(false)} className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600">Abbrechen</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{item.topic}</span>
                  {!item.published && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Entwurf</span>}
                </div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.summary}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => patch(item.id, { published: !item.published })} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  {item.published ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                </button>
                <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">Noch keine Artikel.</div>}
        </div>
      </div>
    </AdminShell>
  )
}
