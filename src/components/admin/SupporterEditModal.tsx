'use client'

import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Supporter {
  id: string
  firstName: string
  lastName: string
  email: string
  city: string
  message: string | null
  notes: string
  createdAt: string
}

interface Props {
  supporter: Supporter
  onClose: () => void
  onSave: (updated: Supporter) => void
}

export default function SupporterEditModal({ supporter, onClose, onSave }: Props) {
  const [city, setCity] = useState(supporter.city ?? '')
  const [notes, setNotes] = useState(supporter.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/supporters/${supporter.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, notes }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Fehler beim Speichern.')
        return
      }
      const result = await res.json()
      onSave(result)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            {supporter.firstName} {supporter.lastName} bearbeiten
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{supporter.email}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              Wohnort
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue dark:focus:border-blue-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              Notizen
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 focus:border-nm-blue dark:focus:border-blue-400 transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>
            Abbrechen
          </Button>
          <Button size="sm" loading={saving} onClick={handleSave}>
            Speichern
          </Button>
        </div>
      </div>
    </div>
  )
}
