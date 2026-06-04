'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Trash2 } from 'lucide-react'

interface Idee { id: string; title: string; description: string; authorName?: string; votes: number; status: string; createdAt: string }

const STATUSES = ['eingereicht', 'geprüft', 'angenommen', 'abgelehnt']

export default function AdminIdeenPage() {
  const [items, setItems] = useState<Idee[]>([])

  useEffect(() => {
    fetch('/api/admin/ideen').then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  async function patch(id: string, data: Partial<Idee>) {
    await fetch(`/api/admin/ideen/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setItems(prev => prev.map(x => x.id === id ? { ...x, ...data } : x))
  }

  async function del(id: string) {
    if (!confirm('Löschen?')) return
    await fetch(`/api/admin/ideen/${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(x => x.id !== id))
  }

  const STATUS_COLOR: Record<string, string> = { eingereicht: 'bg-gray-100 text-gray-600', geprüft: 'bg-blue-100 text-blue-700', angenommen: 'bg-green-100 text-green-700', abgelehnt: 'bg-red-100 text-red-700' }

  return (
    <AdminShell active="ideen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Ideen-Plattform</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{items.length} Ideen · {items.filter(i => i.status === 'angenommen').length} angenommen</p>
        </div>

        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold text-nm-blue">{item.votes} Votes</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[item.status] ?? STATUS_COLOR['eingereicht']}`}>{item.status}</span>
                  </div>
                  <p className="font-bold text-nm-blue text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">{item.description}</p>
                  {item.authorName && <p className="text-xs text-gray-400">{item.authorName} · {new Date(item.createdAt).toLocaleDateString('de-DE')}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={item.status}
                    onChange={e => patch(item.id, { status: e.target.value })}
                    className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">Noch keine Ideen eingereicht.</div>}
        </div>
      </div>
    </AdminShell>
  )
}
