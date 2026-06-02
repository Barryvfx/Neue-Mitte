'use client'

import { useState } from 'react'
import { Trash2, Loader2, Plus, Shield } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Admin {
  id: string
  email: string
  createdAt: string
}

interface Props {
  initialAdmins: Admin[]
  currentEmail: string
}

export default function AdminsClient({ initialAdmins, currentEmail }: Props) {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const [createStatus, setCreateStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const deleteAdmin = async (id: string, email: string) => {
    if (!confirm(`Admin "${email}" wirklich löschen?`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/admins/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAdmins((prev) => prev.filter((a) => a.id !== id))
      } else {
        const data = await res.json()
        alert(data.error ?? 'Fehler beim Löschen')
      }
    } finally {
      setDeletingId(null)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setCreateStatus(null)
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        setAdmins((prev) => [...prev, data])
        setNewEmail('')
        setNewPassword('')
        setCreateStatus({ ok: true, msg: 'Admin erfolgreich angelegt' })
      } else {
        setCreateStatus({ ok: false, msg: data.error ?? 'Fehler beim Anlegen' })
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <section className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">E-Mail</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Angelegt</th>
                <th className="px-4 py-3 w-16" />
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                >
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-nm-blue dark:text-blue-400 flex-shrink-0" />
                      {admin.email}
                      {admin.email === currentEmail && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">(du)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(admin.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {admin.email !== currentEmail && (
                      <button
                        onClick={() => deleteAdmin(admin.id, admin.email)}
                        disabled={deletingId === admin.id}
                        title="Löschen"
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
                      >
                        {deletingId === admin.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4" />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Neuen Admin anlegen
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              autoComplete="off"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue dark:focus:border-blue-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              Passwort
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue dark:focus:border-blue-400 transition-colors"
            />
          </div>
          {createStatus && (
            <p className={`text-sm ${createStatus.ok ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {createStatus.msg}
            </p>
          )}
          <Button type="submit" size="sm" loading={creating}>
            Admin anlegen
          </Button>
        </form>
      </section>
    </div>
  )
}
