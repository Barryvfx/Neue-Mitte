'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Copy, Check, Link2, MousePointerClick, UserCheck } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'

interface ReferralLink {
  id: string
  token: string
  label: string
  clicks: number
  conversions: number
  createdAt: string
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://neue-mitte.org'

export default function AdminReferralPage() {
  const [links, setLinks] = useState<ReferralLink[]>([])
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/referral').then(r => r.json()).then(d => setLinks(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  async function create() {
    if (!label.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label }),
      })
      const r = await res.json()
      setLinks(prev => [r, ...prev])
      setLabel('')
    } finally { setSaving(false) }
  }

  async function del(id: string) {
    if (!confirm('Link löschen?')) return
    await fetch(`/api/admin/referral/${id}`, { method: 'DELETE' })
    setLinks(prev => prev.filter(x => x.id !== id))
  }

  function copy(token: string) {
    navigator.clipboard.writeText(`${APP_URL}/r/${token}`)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <AdminShell active="referral">
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900 dark:text-white">Referral-Links</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Verfolgen Sie, über welche Kanäle Unterstützer kommen.</p>
      </div>

      {/* Create */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Neuen Link erstellen</h2>
        <div className="flex gap-3">
          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && create()}
            placeholder="z. B. Instagram, Flyer Q3, Partnerwebsite"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30"
          />
          <button onClick={create} disabled={saving || !label.trim()} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-nm-blue text-white rounded-xl hover:bg-nm-blue/90 disabled:opacity-40 transition-all">
            <Plus className="h-4 w-4" /> Erstellen
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {links.map(link => {
          const url = `${APP_URL}/r/${link.token}`
          const convRate = link.clicks > 0 ? Math.round((link.conversions / link.clicks) * 100) : 0
          return (
            <div key={link.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link2 className="h-4 w-4 text-nm-muted flex-shrink-0" />
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{link.label}</span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono truncate mb-3">{url}</div>
                  <div className="flex items-center gap-5 text-xs">
                    <span className="flex items-center gap-1 text-gray-500">
                      <MousePointerClick className="h-3.5 w-3.5" />
                      {link.clicks} Klicks
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <UserCheck className="h-3.5 w-3.5" />
                      {link.conversions} Unterstützer
                    </span>
                    <span className="text-gray-400">Conv: {convRate}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => copy(link.token)} className="flex items-center gap-1.5 text-xs font-medium text-nm-blue border border-nm-blue/30 rounded-lg px-2.5 py-1.5 hover:bg-nm-blue hover:text-white transition-all">
                    {copied === link.token ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied === link.token ? 'Kopiert!' : 'Kopieren'}
                  </button>
                  <button onClick={() => del(link.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {links.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">Noch keine Referral-Links erstellt.</div>
        )}
      </div>
    </div>
    </AdminShell>
  )
}
