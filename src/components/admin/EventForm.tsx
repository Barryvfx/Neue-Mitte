'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EventFormData {
  title: string
  description: string
  location: string
  date: string
  active: boolean
}

interface Props {
  mode: 'create' | 'edit'
  initialData?: EventFormData & { id: string }
}

function toDatetimeLocal(date: string | Date | undefined) {
  if (!date) return ''
  const d = new Date(date)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EventForm({ mode, initialData }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<EventFormData>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    location: initialData?.location ?? '',
    date: initialData?.date ? toDatetimeLocal(initialData.date) : '',
    active: initialData?.active ?? true,
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setError('')
    if (!form.title.trim()) { setError('Bitte Titel eingeben.'); return }
    if (!form.description.trim()) { setError('Bitte Beschreibung eingeben.'); return }
    if (!form.date) { setError('Bitte Datum und Uhrzeit auswählen.'); return }
    setSaving(true)
    try {
      const res = await fetch(
        mode === 'edit'
          ? `/api/admin/veranstaltungen/${initialData!.id}`
          : '/api/admin/veranstaltungen',
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Fehler beim Speichern')
        return
      }
      router.push('/admin/veranstaltungen')
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
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="nm-input"
          placeholder="Name der Veranstaltung"
        />
      </div>

      <div>
        <label className="nm-label">Datum & Uhrzeit *</label>
        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
          className="nm-input"
          required
        />
      </div>

      <div>
        <label className="nm-label">Ort</label>
        <input
          value={form.location}
          onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
          className="nm-input"
          placeholder="Veranstaltungsort, Adresse"
        />
      </div>

      <div>
        <label className="nm-label">Beschreibung *</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={5}
          className="nm-input"
          placeholder="Beschreibung der Veranstaltung"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="active"
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
          className="h-4 w-4 border-nm-line text-nm-blue focus:ring-nm-blue"
        />
        <label htmlFor="active" className="text-sm font-medium text-nm-muted">
          Öffentlich sichtbar
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Speichert…' : 'Speichern'}
        </button>
        <button onClick={() => router.back()} className="btn-ghost" type="button">
          Abbrechen
        </button>
      </div>
    </div>
  )
}
