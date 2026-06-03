'use client'

import { useState, useEffect } from 'react'
import { Users, Download } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'

interface Signature {
  id: string
  name: string
  email: string
  city?: string
  createdAt: string
}

interface Data {
  signatures: Signature[]
  count: number
  goal: number
}

export default function AdminPetitionPage() {
  const [data, setData] = useState<Data | null>(null)

  useEffect(() => {
    fetch('/api/admin/petition').then(r => r.json()).then(setData).catch(() => {})
  }, [])

  function downloadCsv() {
    if (!data) return
    const header = 'Name,E-Mail,Ort,Datum\n'
    const rows = data.signatures.map(s =>
      `"${s.name}","${s.email}","${s.city ?? ''}","${new Date(s.createdAt).toLocaleDateString('de-DE')}"`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `petition_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!data) return <AdminShell active="petition"><div className="p-8 text-gray-500">Wird geladen…</div></AdminShell>

  const percent = Math.min(100, Math.round((data.count / data.goal) * 100))

  return (
    <AdminShell active="petition">
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Petition</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Unterzeichner verwalten</p>
        </div>
        <button onClick={downloadCsv} className="flex items-center gap-2 text-sm font-medium text-nm-blue border border-nm-blue/30 rounded-lg px-3 py-2 hover:bg-nm-blue hover:text-white transition-all">
          <Download className="h-4 w-4" /> CSV Export
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-1"><Users className="h-4 w-4" /> Unterzeichner</div>
          <div className="text-3xl font-black text-nm-blue">{data.count.toLocaleString('de-DE')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ziel</div>
          <div className="text-3xl font-black text-gray-900 dark:text-white">{data.goal.toLocaleString('de-DE')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Fortschritt</div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-nm-blue rounded-full transition-all" style={{ width: `${percent}%` }} />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percent}%</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Unterzeichner</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full nm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Ort</th>
                <th>Datum</th>
              </tr>
            </thead>
            <tbody>
              {data.signatures.map(s => (
                <tr key={s.id}>
                  <td className="font-medium">{s.name}</td>
                  <td className="text-nm-muted">{s.email}</td>
                  <td className="text-nm-muted">{s.city ?? '—'}</td>
                  <td className="text-nm-muted">{new Date(s.createdAt).toLocaleDateString('de-DE')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.signatures.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">Noch keine Unterzeichner.</div>
          )}
        </div>
      </div>
    </div>
    </AdminShell>
  )
}
