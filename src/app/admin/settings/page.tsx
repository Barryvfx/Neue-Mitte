'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'
import Button from '@/components/ui/Button'

interface ContentMap {
  maintenance_mode: string
  banner_text: string
  banner_active: string
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwStatus, setPwStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const [content, setContent] = useState<ContentMap>({
    maintenance_mode: 'false',
    banner_text: '',
    banner_active: 'false',
  })
  const [contentLoading, setContentLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<Record<string, { ok: boolean; msg: string }>>({})

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
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((blocks: Array<{ key: string; value: string }>) => {
        const map: Partial<ContentMap> = {}
        for (const b of blocks) {
          if (b.key in content) {
            (map as Record<string, string>)[b.key] = b.value
          }
        }
        setContent((prev) => ({ ...prev, ...map }))
      })
      .finally(() => setContentLoading(false))
  }, [authed])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPwStatus({ ok: false, msg: 'Passwörter stimmen nicht überein' })
      return
    }
    setPwLoading(true)
    setPwStatus(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        setPwStatus({ ok: true, msg: 'Passwort erfolgreich geändert' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPwStatus({ ok: false, msg: data.error ?? 'Fehler beim Speichern' })
      }
    } finally {
      setPwLoading(false)
    }
  }

  const saveContentKey = async (key: keyof ContentMap, value: string) => {
    setSavingKey(key)
    setSaveStatus((prev) => ({ ...prev, [key]: undefined as unknown as { ok: boolean; msg: string } }))
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      const data = await res.json()
      if (res.ok) {
        setSaveStatus((prev) => ({ ...prev, [key]: { ok: true, msg: 'Gespeichert' } }))
      } else {
        setSaveStatus((prev) => ({ ...prev, [key]: { ok: false, msg: data.error ?? 'Fehler' } }))
      }
    } finally {
      setSavingKey(null)
    }
  }

  if (authChecking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-nm-blue dark:text-blue-400" />
      </div>
    )
  }

  if (!authed) return null

  return (
    <AdminShell active="settings">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Einstellungen</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Passwort, Wartungsmodus und Banner verwalten</p>
      </div>

      <div className="space-y-8 max-w-2xl">
        {/* Password */}
        <section className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Passwort ändern</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                Aktuelles Passwort
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue dark:focus:border-blue-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                Neues Passwort
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue dark:focus:border-blue-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                Neues Passwort bestätigen
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue dark:focus:border-blue-400 transition-colors"
              />
            </div>
            {pwStatus && (
              <div className={`flex items-center gap-2 text-sm ${pwStatus.ok ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {pwStatus.ok
                  ? <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  : <XCircle className="h-4 w-4 flex-shrink-0" />}
                {pwStatus.msg}
              </div>
            )}
            <Button type="submit" size="sm" loading={pwLoading}>
              Passwort speichern
            </Button>
          </form>
        </section>

        {/* Maintenance */}
        <section className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">Wartungsmodus</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Wenn aktiv, wird die Website für Besucher deaktiviert.
          </p>
          {contentLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : (
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={content.maintenance_mode === 'true'}
                    onChange={(e) => {
                      const val = e.target.checked ? 'true' : 'false'
                      setContent((prev) => ({ ...prev, maintenance_mode: val }))
                      saveContentKey('maintenance_mode', val)
                    }}
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${content.maintenance_mode === 'true' ? 'bg-nm-blue' : 'bg-gray-200 dark:bg-gray-600'}`} />
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${content.maintenance_mode === 'true' ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {content.maintenance_mode === 'true' ? 'Aktiv' : 'Inaktiv'}
                </span>
              </label>
              {savingKey === 'maintenance_mode' && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
              {saveStatus.maintenance_mode && (
                <span className={`text-xs ${saveStatus.maintenance_mode.ok ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {saveStatus.maintenance_mode.msg}
                </span>
              )}
            </div>
          )}
        </section>

        {/* Banner */}
        <section className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">Banner</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Zeige einen Hinweis-Banner oben auf der Website an.
          </p>
          {contentLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Banner-Text
                </label>
                <textarea
                  value={content.banner_text}
                  onChange={(e) => setContent((prev) => ({ ...prev, banner_text: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue dark:focus:border-blue-400 transition-colors resize-none"
                />
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    loading={savingKey === 'banner_text'}
                    onClick={() => saveContentKey('banner_text', content.banner_text)}
                  >
                    Speichern
                  </Button>
                  {saveStatus.banner_text && (
                    <span className={`text-xs ${saveStatus.banner_text.ok ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {saveStatus.banner_text.msg}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={content.banner_active === 'true'}
                      onChange={(e) => {
                        const val = e.target.checked ? 'true' : 'false'
                        setContent((prev) => ({ ...prev, banner_active: val }))
                        saveContentKey('banner_active', val)
                      }}
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${content.banner_active === 'true' ? 'bg-nm-blue' : 'bg-gray-200 dark:bg-gray-600'}`} />
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${content.banner_active === 'true' ? 'translate-x-5' : ''}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Banner {content.banner_active === 'true' ? 'aktiv' : 'inaktiv'}
                  </span>
                </label>
                {savingKey === 'banner_active' && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                {saveStatus.banner_active && (
                  <span className={`text-xs ${saveStatus.banner_active.ok ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {saveStatus.banner_active.msg}
                  </span>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  )
}
