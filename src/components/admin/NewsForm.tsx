'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface NewsFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
}

interface Props {
  initialData?: NewsFormData & { id: string }
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
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [slugManual, setSlugManual] = useState(mode === 'edit')

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

    const payload = { ...form, published }

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
        <div className="flex items-center gap-0">
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
        <p className="text-xs text-nm-muted/60 mt-1">Wird automatisch aus dem Titel generiert. Nur Kleinbuchstaben, Zahlen und Bindestriche.</p>
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
        <p className="text-xs text-nm-muted/60 mt-1">Absätze werden automatisch erkannt. Leerzeilen zwischen Absätzen lassen.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? 'Speichert…' : 'Veröffentlichen'}
        </button>
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="btn-outline"
        >
          Als Entwurf speichern
        </button>
        <button
          onClick={() => router.back()}
          className="btn-ghost ml-auto"
          type="button"
        >
          Abbrechen
        </button>
      </div>
    </div>
  )
}
