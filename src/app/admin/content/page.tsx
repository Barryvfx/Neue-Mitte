'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, XCircle, AlertTriangle, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
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

const TEXT_FIELDS: Array<{ key: keyof ContentFields; label: string; multiline?: boolean }> = [
  { key: 'hero_title', label: 'Hero-Titel' },
  { key: 'hero_subtitle', label: 'Hero-Untertitel', multiline: true },
  { key: 'hero_cta1', label: 'Primärer Button (CTA 1)' },
  { key: 'hero_cta2', label: 'Sekundärer Button (CTA 2)' },
  { key: 'footer_text', label: 'Footer-Text', multiline: true },
  { key: 'social_instagram', label: 'Instagram URL' },
  { key: 'social_tiktok', label: 'TikTok URL' },
  { key: 'social_twitter', label: 'Twitter/X URL' },
]

function Toggle({
  label,
  description,
  checked,
  onChange,
  danger,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (val: boolean) => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full text-left group"
    >
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
      <div
        className={`relative ml-4 flex-shrink-0 w-11 h-6 rounded-full transition-colors ${
          checked
            ? danger
              ? 'bg-red-500'
              : 'bg-nm-blue'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  )
}

interface PollOption { id: string; text: string; votes: number }
interface Poll { id: string; question: string; active: boolean; options: PollOption[] }

function PollsSection() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [question, setQuestion] = useState('')
  const [optionTexts, setOptionTexts] = useState(['', '', ''])
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetch('/api/admin/polls').then((r) => r.json()).then((d) => { if (Array.isArray(d)) setPolls(d) }).finally(() => setLoading(false))
  }, [])

  async function createPoll() {
    const opts = optionTexts.filter((o) => o.trim())
    if (!question.trim() || opts.length < 2) return
    setCreating(true)
    const res = await fetch('/api/admin/polls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question.trim(), options: opts }),
    })
    const data = await res.json()
    if (res.ok) { setPolls((p) => [data, ...p]); setQuestion(''); setOptionTexts(['', '', '']) }
    setCreating(false)
  }

  async function toggleActive(poll: Poll) {
    const res = await fetch(`/api/admin/polls/${poll.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !poll.active }),
    })
    if (res.ok) setPolls((p) => p.map((x) => x.id === poll.id ? { ...x, active: !x.active } : x))
  }

  async function deletePoll(id: string) {
    if (!confirm('Umfrage wirklich löschen?')) return
    const res = await fetch(`/api/admin/polls/${id}`, { method: 'DELETE' })
    if (res.ok) setPolls((p) => p.filter((x) => x.id !== id))
  }

  return (
    <section className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Abstimmungen</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Nur die aktive Umfrage wird auf der Website angezeigt</p>

      {/* Create form */}
      <div className="space-y-3 mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Frage eingeben…"
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue transition-colors"
        />
        {optionTexts.map((opt, i) => (
          <input
            key={i}
            type="text"
            value={opt}
            onChange={(e) => setOptionTexts((prev) => prev.map((o, j) => j === i ? e.target.value : o))}
            placeholder={`Option ${i + 1}…`}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue transition-colors"
          />
        ))}
        <div className="flex gap-2">
          <Button size="sm" loading={creating} onClick={createPoll}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Erstellen
          </Button>
          <button
            onClick={() => setOptionTexts((p) => [...p, ''])}
            className="text-xs text-gray-400 hover:text-nm-blue transition-colors"
          >
            + Option hinzufügen
          </button>
        </div>
      </div>

      {/* Poll list */}
      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
      ) : polls.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">Noch keine Umfragen.</p>
      ) : (
        <div className="space-y-3">
          {polls.map((poll) => {
            const total = poll.options.reduce((s, o) => s + o.votes, 0)
            return (
              <div key={poll.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{poll.question}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{total} Stimmen</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(poll)} title={poll.active ? 'Deaktivieren' : 'Aktivieren'}>
                      {poll.active
                        ? <ToggleRight className="w-5 h-5 text-nm-blue" />
                        : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                    </button>
                    <button onClick={() => deletePoll(poll.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {poll.options.map((opt) => {
                    const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0
                    return (
                      <div key={opt.id} className="flex items-center gap-2 text-xs">
                        <span className="w-32 truncate text-gray-600 dark:text-gray-400">{opt.text}</span>
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-nm-blue rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-gray-400">{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

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
    banner_active: 'false',
    banner_text: '',
    maintenance_mode: 'false',
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  const saveField = async (key: keyof ContentFields, value?: string) => {
    const val = value ?? fields[key]
    setSaving(key)
    setSaveStatus((prev) => { const next = { ...prev }; delete next[key]; return next })
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: val }),
      })
      const data = await res.json()
      setSaveStatus((prev) => ({
        ...prev,
        [key]: { ok: res.ok, msg: res.ok ? 'Gespeichert' : (data.error ?? 'Fehler') },
      }))
    } finally {
      setSaving(null)
    }
  }

  const handleToggle = (key: 'banner_active' | 'maintenance_mode', val: boolean) => {
    const strVal = val ? 'true' : 'false'
    setFields((prev) => ({ ...prev, [key]: strVal }))
    saveField(key, strVal)
  }

  const saveAll = async () => {
    for (const { key } of TEXT_FIELDS) {
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
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Homepage-Inhalte und Website-Einstellungen</p>
      </div>

      <div className="max-w-2xl space-y-6">

        {/* Banner & Wartungsmodus */}
        <section className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Ankündigungen & Wartung</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Sofort wirksam — kein Neustart nötig</p>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-5">
              <Toggle
                label="Ankündigungs-Banner"
                description="Zeigt einen farbigen Hinweisbalken oben auf der Website"
                checked={fields.banner_active === 'true'}
                onChange={(val) => handleToggle('banner_active', val)}
              />
              {saveStatus.banner_active && (
                <span className={`flex items-center gap-1 text-xs ${saveStatus.banner_active.ok ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {saveStatus.banner_active.ok ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                  {saveStatus.banner_active.msg}
                </span>
              )}

              {fields.banner_active === 'true' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    Banner-Text
                  </label>
                  <input
                    type="text"
                    value={fields.banner_text}
                    onChange={(e) => setFields((prev) => ({ ...prev, banner_text: e.target.value }))}
                    placeholder="z.B. Neue Mitte jetzt auch in Berlin aktiv!"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue transition-colors"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" variant="outline" loading={saving === 'banner_text'} onClick={() => saveField('banner_text')}>
                      Speichern
                    </Button>
                    {saveStatus.banner_text && (
                      <span className={`flex items-center gap-1 text-xs ${saveStatus.banner_text.ok ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                        {saveStatus.banner_text.ok ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        {saveStatus.banner_text.msg}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
                <Toggle
                  label="Wartungsmodus"
                  description="Alle öffentlichen Seiten zeigen eine Wartungsseite. Admin-Panel bleibt erreichbar."
                  checked={fields.maintenance_mode === 'true'}
                  onChange={(val) => handleToggle('maintenance_mode', val)}
                  danger
                />
                {fields.maintenance_mode === 'true' && (
                  <div className="mt-3 flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-700 dark:text-red-400">
                      <strong>Wartungsmodus ist aktiv.</strong> Besucher sehen jetzt eine Wartungsseite. Nur Admins haben Zugriff auf das Panel.
                    </p>
                  </div>
                )}
                {saveStatus.maintenance_mode && (
                  <span className={`mt-2 flex items-center gap-1 text-xs ${saveStatus.maintenance_mode.ok ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                    {saveStatus.maintenance_mode.ok ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    {saveStatus.maintenance_mode.msg}
                  </span>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Text fields */}
        <section className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Texte & Social Media</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-5">
              {TEXT_FIELDS.map(({ key, label, multiline }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    {label}
                  </label>
                  {multiline ? (
                    <textarea
                      value={fields[key]}
                      onChange={(e) => setFields((prev) => ({ ...prev, [key]: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={fields[key]}
                      onChange={(e) => setFields((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue transition-colors"
                    />
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" variant="outline" loading={saving === key} onClick={() => saveField(key)}>
                      Speichern
                    </Button>
                    {saveStatus[key] && (
                      <span className={`flex items-center gap-1 text-xs ${saveStatus[key].ok ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                        {saveStatus[key].ok ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        {saveStatus[key].msg}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button size="sm" loading={saving !== null} onClick={saveAll}>
                  Alle speichern
                </Button>
              </div>
            </div>
          )}
        </section>
        <PollsSection />
      </div>
    </AdminShell>
  )
}
