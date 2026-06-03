'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'

interface LoginAttempt {
  id: string
  email: string
  ip: string
  success: boolean
  createdAt: string
}

export default function LoginLogPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [attempts, setAttempts] = useState<LoginAttempt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => {
        if (r.status === 401) { router.push('/admin'); return null }
        setAuthed(true)
        return r
      })
      .finally(() => setAuthChecking(false))
  }, [router])

  useEffect(() => {
    if (!authed) return
    fetch('/api/admin/login-attempts')
      .then((r) => r.json())
      .then((data) => setAttempts(Array.isArray(data) ? data : data.attempts ?? []))
      .finally(() => setLoading(false))
  }, [authed])

  if (authChecking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-nm-blue dark:text-blue-400" />
      </div>
    )
  }

  if (!authed) return null

  return (
    <AdminShell active="login-log">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Login-Verlauf</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Alle Admin-Login-Versuche</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Datum/Zeit</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">E-Mail</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">IP-Adresse</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-nm-blue mx-auto" />
                  </td>
                </tr>
              ) : attempts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-500 dark:text-gray-400">
                    Keine Login-Versuche vorhanden.
                  </td>
                </tr>
              ) : (
                attempts.map((attempt) => (
                  <tr
                    key={attempt.id}
                    className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {new Date(attempt.createdAt).toLocaleString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{attempt.email}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">{attempt.ip}</td>
                    <td className="px-4 py-3">
                      {attempt.success ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400">
                          Erfolgreich
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400">
                          Fehlgeschlagen
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
