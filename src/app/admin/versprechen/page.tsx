'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Plus, Trash2 } from 'lucide-react'

interface Versprechen { id: string; title: string; description?: string; status: string; category: string }

const STATUSES = ['gefordert', 'diskussion', 'umgesetzt', 'abgelehnt']
const CATEGORIES = ['Allgemein', 'Wirtschaft', 'Bildung', 'Migration', 'Energie', 'Soziales', 'Sicherheit', 'Digitalisierung']
const STATUS_COLOR: Record<string, string> = { gefordert: 'text-nm-blue', diskussion: 'text-amber-600', umgesetzt: 'text-green-600', abgelehnt: 'text-red-500' }

export default function AdminVersprechenPage() {
  const [items, setItems] = useState<Versprechen[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('gefordert')
  const [category, setCategory] = useState('Allgemein')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/versprechen').then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  async function create() {
    if (!title.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/versprechen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: description || null, status, category }),
    })
    const item = await res.json()
    setItems(prev => [...prev, item])
    setTitle(''); setDescription(''); setShowForm(false)
    setSaving(false)
  }

  async function patch(id: string, data: Partial<Versprechen>) {
    await fetch(`/api/admin/versprechen/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setItems(prev => prev.map(x => x.id === id ? { ...x, ...data } : x))
  }

  async function del(id: string) {
    if (!confirm('Löschen?')) return
    await fetch(`/api/admin/versprechen/${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(x => x.id !== id))
  }

  return (
    <AdminShell active="versprechen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">Versprechen-Tracker</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{items.length} Einträge</p>
          </div>
          <button onClick={() => setShowForm(f => !f)} className="flex items-center gap-2 text-sm font-bold bg-nm-blue text-white px-4 py-2 rounded-xl hover:bg-nm-blue/90 transition-all">
            <Plus className="h-4 w-4" /> Neu
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 mb-5 space-y-3">
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30" placeholder="Titel der Forderung *" />
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl resize-none dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30" placeholder="Beschreibung (optional)" />
            <div className="grid grid-cols-2 gap-3">
              <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={create} disabled={saving || !title.trim()} className="px-4 py-2 text-sm font-bold bg-nm-blue text-white rounded-xl hover:bg-nm-blue/90 disabled:opacity-40">{saving ? 'Speichern…' : 'Erstellen'}</button>
              <button onClick={() => setShowForm(false)} className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600">Abbrechen</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</p>
                {item.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>}
                <p className="text-xs text-gray-400 mt-1">{item.category}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <select value={item.status} onChange={e => patch(item.id, { status: e.target.value })} className={`text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-900 font-bold focus:outline-none ${STATUS_COLOR[item.status]}`}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">Noch keine Einträge.</div>}
        </div>
      </div>
    </AdminShell>
  )
}
