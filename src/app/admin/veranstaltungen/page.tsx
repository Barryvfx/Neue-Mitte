'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { List, Users, ChevronDown, ChevronUp, Download } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'
import EventsAdminTable from '@/components/admin/EventsAdminTable'

interface Registration { id: string; name: string; email: string; createdAt: string }
interface EventWithRegs { id: string; title: string; date: string; registrationCount: number; registrations: Registration[] }

function RegistrationsView() {
  const [events, setEvents] = useState<EventWithRegs[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/veranstaltungen/registrations')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setEvents(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function downloadCsv(event: EventWithRegs) {
    const rows = [
      ['Name', 'E-Mail', 'Angemeldet am'],
      ...event.registrations.map((r) => [r.name, r.email, new Date(r.createdAt).toLocaleString('de-DE')]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
    a.download = `anmeldungen-${event.title.toLowerCase().replace(/\s+/g, '-')}.csv`
    a.click()
  }

  if (loading) return <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-nm-blue border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-3">
      {events.map((ev) => (
        <div key={ev.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === ev.id ? null : ev.id)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center gap-3 text-left">
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{ev.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(ev.date).toLocaleDateString('de-DE')}</p>
              </div>
              <span className="px-2.5 py-0.5 bg-nm-blue text-white text-xs font-bold rounded-full">
                {ev.registrationCount}
              </span>
            </div>
            {expanded === ev.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {expanded === ev.id && (
            <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-4">
              {ev.registrations.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Noch keine Anmeldungen.</p>
              ) : (
                <>
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={() => downloadCsv(ev)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-nm-blue transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      CSV exportieren
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide pr-4">Name</th>
                          <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide pr-4">E-Mail</th>
                          <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Angemeldet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ev.registrations.map((r) => (
                          <tr key={r.id} className="border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                            <td className="py-2.5 pr-4 font-medium text-gray-900 dark:text-white">{r.name}</td>
                            <td className="py-2.5 pr-4 text-gray-500">{r.email}</td>
                            <td className="py-2.5 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString('de-DE')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

interface AdminEvent { id: string; title: string; date: string; location: string; active: boolean }

export default function AdminVeranstaltungenPage() {
  const [view, setView] = useState<'events' | 'registrations'>('events')
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/veranstaltungen')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setEvents(data) })
      .catch(() => {})
      .finally(() => setEventsLoading(false))
  }, [])

  return (
    <AdminShell active="veranstaltungen">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Veranstaltungen</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Veranstaltungen verwalten und Anmeldungen einsehen</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 gap-1">
            <button
              onClick={() => setView('events')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                view === 'events'
                  ? 'bg-white dark:bg-gray-800 text-nm-blue shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Veranstaltungen
            </button>
            <button
              onClick={() => setView('registrations')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                view === 'registrations'
                  ? 'bg-white dark:bg-gray-800 text-nm-blue shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Anmeldungen
            </button>
          </div>
          {view === 'events' && (
            <Link href="/admin/veranstaltungen/new" className="btn-primary">+ Neue Veranstaltung</Link>
          )}
        </div>
      </div>

      {view === 'events' ? (
        eventsLoading
          ? <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-nm-blue border-t-transparent rounded-full animate-spin" /></div>
          : <EventsAdminTable events={events.map((e) => ({ ...e, date: new Date(e.date) }))} />
      ) : (
        <RegistrationsView />
      )}
    </AdminShell>
  )
}
