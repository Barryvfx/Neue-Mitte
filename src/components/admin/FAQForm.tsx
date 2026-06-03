'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FAQFormData {
  question: string
  answer: string
  order: number
  active: boolean
}

interface Props {
  mode: 'create' | 'edit'
  initialData?: FAQFormData & { id: string }
}

export default function FAQForm({ mode, initialData }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FAQFormData>({
    question: initialData?.question ?? '',
    answer: initialData?.answer ?? '',
    order: initialData?.order ?? 0,
    active: initialData?.active ?? true,
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setError('')
    setSaving(true)
    try {
      const res = await fetch(
        mode === 'edit' ? `/api/admin/faq/${initialData!.id}` : '/api/admin/faq',
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
      router.push('/admin/faq')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="nm-label">Frage *</label>
        <input
          value={form.question}
          onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
          className="nm-input"
          placeholder="Häufig gestellte Frage"
        />
      </div>

      <div>
        <label className="nm-label">Antwort *</label>
        <textarea
          value={form.answer}
          onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
          rows={5}
          className="nm-input"
          placeholder="Ausführliche Antwort auf die Frage"
        />
      </div>

      <div>
        <label className="nm-label">Reihenfolge</label>
        <input
          type="number"
          value={form.order}
          onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value, 10) || 0 }))}
          className="nm-input"
          min={0}
        />
        <p className="text-xs text-nm-muted mt-1">Niedrigere Zahlen erscheinen zuerst.</p>
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
