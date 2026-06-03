'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'
import Button from '@/components/ui/Button'

interface ContentFields {
  hero_title: string
  hero_subtitle: string
  hero_cta1: string
  hero_cta2: string
  footer_text: string
  social_instagram: string
  social_tiktok: string
  social_twitter: string
  banner_active: string
  banner_text: string
  maintenance_mode: string
}

type SaveStatus = Record<string, { ok: boolean; msg: string }>

const FIELDS: Array<{ key: keyof ContentFields; label: string; multiline?: boolean }> = [
  { key: 'hero_title', label: 'Hero-Titel' },
  { key: 'hero_subtitle', label: 'Hero-Untertitel', multiline: true },
  { key: 'hero_cta1', label: 'Primärer Button (CTA 1)' },
  { key: 'hero_cta2', label: 'Sekundärer Button (CTA 2)' },
  { key: 'footer_text', label: 'Footer-Text', multiline: true },
  { key: 'social_instagram', label: 'Instagram URL' },
  { key: 'social_tiktok', label: 'TikTok URL' },
  { key: 'social_twitter', label: 'Twitter/X URL' },
]

const FIELDS_BANNER: Array<{ key: keyof ContentFields; label: string; multiline?: boolean }> = [
  { key: 'banner_active', label: 'Banner aktiv (true/false)' },
  { key: 'banner_text', label: 'Banner-Text' },
  { key: 'maintenance_mode', label: 'Wartungsmodus (true/false)' },
]

export default function AdminContentPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({})

  const [fields, setFields] = useState<ContentFields>({
    hero_title: '',
    hero_subtitle: '',
    hero_cta1: '',
    hero_cta2: '',
    footer_text: '',
    social_instagram: '',
    social_tiktok: '',
    social_twitter: '',
    banner_active: '',
    banner_text: '',
    maintenance_mode: '',
  })

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
        const map: Partial<ContentFields> = {}
        for (const b of blocks) {
          if (b.key in fields) {
            (map as Record<string, string>)[b.key] = b.value
          }
        }
        setFields((prev) => ({ ...prev, ...map }))
      })
      .finally(() => setLoading(false))
  }, [authed])

  const saveField = async (key: keyof ContentFields) => {
    setSaving(key)
    setSaveStatus((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: fields[key] }),
      })
      const data = await res.json()
      if (res.ok) {
        setSaveStatus((prev) => ({ ...prev, [key]: { ok: true, msg: 'Gespeichert' } }))
      } else {
        setSaveStatus((prev) => ({ ...prev, [key]: { ok: false, msg: data.error ?? 'Fehler' } }))
      }
    } finally {
      setSaving(null)
    }
  }

  const saveAll = async () => {
    for (const { key } of [...FIELDS, ...FIELDS_BANNER]) {
      await saveField(key)
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
    <AdminShell active="content">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Inhalte</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Homepage-Inhalte bearbeiten</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <section className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Hero-Bereich</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-5">
              {FIELDS.map(({ key, label, multiline }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    {label}
                  </label>
                  {multiline ? (
                    <textarea
                      value={fields[key]}
                      onChange={(e) => setFields((prev) => ({ ...prev, [key]: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue dark:focus:border-blue-400 transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={fields[key]}
                      onChange={(e) => setFields((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue dark:focus:border-blue-400 transition-colors"
                    />
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      loading={saving === key}
                      onClick={() => saveField(key)}
                    >
                      Speichern
                    </Button>
                    {saveStatus[key] && (
                      <span className={`flex items-center gap-1 text-xs ${saveStatus[key].ok ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {saveStatus[key].ok
                          ? <CheckCircle className="h-3.5 w-3.5" />
                          : <XCircle className="h-3.5 w-3.5" />}
                        {saveStatus[key].msg}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button
                  size="sm"
                  loading={saving !== null}
                  onClick={saveAll}
                >
                  Alle speichern
                </Button>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Ankündigung & Wartung</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-5">
              {FIELDS_BANNER.map(({ key, label, multiline }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    {label}
                  </label>
                  {multiline ? (
                    <textarea
                      value={fields[key]}
                      onChange={(e) => setFields((prev) => ({ ...prev, [key]: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue dark:focus:border-blue-400 transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={fields[key]}
                      onChange={(e) => setFields((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue dark:focus:border-blue-400 transition-colors"
                    />
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      loading={saving === key}
                      onClick={() => saveField(key)}
                    >
                      Speichern
                    </Button>
                    {saveStatus[key] && (
                      <span className={`flex items-center gap-1 text-xs ${saveStatus[key].ok ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {saveStatus[key].ok
                          ? <CheckCircle className="h-3.5 w-3.5" />
                          : <XCircle className="h-3.5 w-3.5" />}
                        {saveStatus[key].msg}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  )
}
