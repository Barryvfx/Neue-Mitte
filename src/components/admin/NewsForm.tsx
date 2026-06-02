'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface NewsFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
  scheduledAt: string
}

interface Props {
  initialData?: Omit<NewsFormData, 'scheduledAt'> & { id: string; scheduledAt?: string | null }
  mode: 'create' | 'edit'
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function NewsForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<NewsFormData>({
    title: initialData?.title ?? '',
    slug: initialData?.slug ?? '',
    excerpt: initialData?.excerpt ?? '',
    content: initialData?.content ?? '',
    published: initialData?.published ?? false,
    scheduledAt: initialData?.scheduledAt ?? '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [slugManual, setSlugManual] = useState(mode === 'edit')
  const [preview, setPreview] = useState(false)

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugManual ? prev.slug : slugify(value),
    }))
  }

  function handleSlugChange(value: string) {
    setSlugManual(true)
    setForm((prev) => ({ ...prev, slug: value }))
  }

  async function handleSave(published: boolean) {
    setError('')
    setSaving(true)
    const payload = {
      ...form,
      published,
      scheduledAt: form.scheduledAt || null,
    }
    try {
      const res = await fetch(
        mode === 'edit' ? `/api/admin/news/${initialData!.id}` : '/api/admin/news',
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Fehler beim Speichern')
        return
      }
      router.push('/admin/news')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  if (preview) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-nm-blue">Vorschau</h2>
          <button onClick={() => setPreview(false)} className="btn-ghost text-sm">
            ← Zurück zum Bearbeiten
          </button>
        </div>
        <div className="border border-nm-line p-8 bg-white">
          <p className="text-xs text-nm-muted uppercase tracking-widest mb-4">Vorschau — nicht veröffentlicht</p>
          <h1 className="text-3xl font-black text-nm-blue mb-4">{form.title || 'Kein Titel'}</h1>
          <p className="text-nm-muted text-lg leading-relaxed font-medium border-l-4 border-nm-blue pl-5 mb-8">
            {form.excerpt || 'Kein Kurztext'}
          </p>
          <div className="text-nm-muted leading-relaxed space-y-4">
            {form.content.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="nm-label">Titel *</label>
        <input
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="nm-input"
          placeholder="Titel der Meldung"
        />
      </div>

      <div>
        <label className="nm-label">URL-Slug *</label>
        <div className="flex items-center">
          <span className="bg-nm-gray border border-nm-line border-r-0 px-3 py-2 text-xs text-nm-muted font-mono">
            /aktuelles/
          </span>
          <input
            value={form.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="nm-input flex-1 font-mono text-sm"
            placeholder="mein-artikel-titel"
          />
        </div>
        <p className="text-xs text-nm-muted/60 mt-1">Wird automatisch aus dem Titel generiert.</p>
      </div>

      <div>
        <label className="nm-label">Kurztext / Vorschau *</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
          rows={3}
          className="nm-input"
          placeholder="1–2 Sätze, die in Vorschauboxen erscheinen"
        />
      </div>

      <div>
        <label className="nm-label">Vollständiger Text *</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          rows={16}
          className="nm-input font-mono text-sm"
          placeholder="Vollständiger Artikeltext. Absätze durch Leerzeile trennen."
        />
      </div>

      <div>
        <label className="nm-label">Geplante Veröffentlichung (optional)</label>
        <input
          type="datetime-local"
          value={form.scheduledAt}
          onChange={(e) => setForm((p) => ({ ...p, scheduledAt: e.target.value }))}
          className="nm-input"
        />
        <p className="text-xs text-nm-muted/60 mt-1">
          Leer lassen für sofortige Veröffentlichung. Wird automatisch freigeschaltet zum gewählten Zeitpunkt.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary">
          {saving ? 'Speichert…' : form.scheduledAt ? 'Einplanen' : 'Veröffentlichen'}
        </button>
        <button onClick={() => handleSave(false)} disabled={saving} className="btn-outline">
          Als Entwurf speichern
        </button>
        <button onClick={() => setPreview(true)} className="btn-ghost" type="button">
          Vorschau
        </button>
        <button onClick={() => router.back()} className="btn-ghost ml-auto" type="button">
          Abbrechen
        </button>
      </div>
    </div>
  )
}
