'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Event {
  id: string
  title: string
  date: Date
  location: string
  active: boolean
}

interface Props {
  events: Event[]
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function EventsAdminTable({ events: initial }: Props) {
  const [events, setEvents] = useState(initial)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" wirklich löschen?`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/veranstaltungen/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id))
        router.refresh()
      }
    } finally {
      setDeleting(null)
    }
  }

  if (events.length === 0) {
    return (
      <div className="bg-white border border-nm-line p-12 text-center">
        <p className="text-nm-muted mb-4">Noch keine Veranstaltungen vorhanden.</p>
        <Link href="/admin/veranstaltungen/new" className="btn-primary">
          Erste Veranstaltung erstellen
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white border border-nm-line">
      <table className="nm-table w-full">
        <thead>
          <tr>
            <th>Titel</th>
            <th>Datum</th>
            <th>Ort</th>
            <th>Status</th>
            <th className="text-right">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td className="font-medium text-nm-blue">{event.title}</td>
              <td className="text-sm text-nm-muted">{formatDate(event.date)}</td>
              <td className="text-sm text-nm-muted">{event.location || '—'}</td>
              <td>
                <span
                  className={`text-xs font-bold px-2 py-0.5 ${
                    event.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-nm-gray text-nm-muted border border-nm-line'
                  }`}
                >
                  {event.active ? 'Aktiv' : 'Inaktiv'}
                </span>
              </td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/veranstaltungen/${event.id}`}
                    className="text-xs font-semibold text-nm-blue hover:underline"
                  >
                    Bearbeiten
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id, event.title)}
                    disabled={deleting === event.id}
                    className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deleting === event.id ? '…' : 'Löschen'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
