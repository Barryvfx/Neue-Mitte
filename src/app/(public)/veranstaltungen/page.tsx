'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, CalendarPlus, UserPlus } from 'lucide-react'
import EventRegistrationModal from '@/components/sections/EventRegistrationModal'
import type { Metadata } from 'next'

interface Event {
  id: string
  title: string
  description: string
  location: string
  date: string
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('de-DE', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })
}

function formatTime(date: string) {
  const d = new Date(date)
  if (d.getHours() === 0 && d.getMinutes() === 0) return null
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr'
}

export default function VeranstaltungenPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [registerEvent, setRegisterEvent] = useState<{ id: string; title: string } | null>(null)

  useEffect(() => {
    fetch('/api/events/upcoming')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setEvents(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Neue Mitte</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Veranstaltungen</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Kommende Veranstaltungen und Termine der Neuen Mitte.
          </p>
        </div>
      </div>

      <div className="nm-container py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-nm-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-nm-muted text-center py-20">Derzeit keine Veranstaltungen geplant.</p>
        ) : (
          <div className="max-w-3xl mx-auto space-y-5">
            {events.map((event) => {
              const time = formatTime(event.date)
              return (
                <div key={event.id} className="border border-nm-line bg-white p-6 sm:p-8 hover:border-nm-blue transition-colors">
                  <div className="flex items-center gap-2 text-nm-blue mb-2">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs font-bold tracking-wide">
                      {formatDate(event.date)}{time ? ` · ${time}` : ''}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-nm-blue mb-1">{event.title}</h2>
                  {event.location && (
                    <div className="flex items-center gap-1.5 text-nm-muted mb-3">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  )}
                  <p className="text-nm-muted leading-relaxed text-sm">{event.description}</p>

                  <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-nm-line">
                    <a
                      href={`/api/events/${event.id}/ical`}
                      download
                      className="flex items-center gap-1.5 text-xs font-semibold text-nm-muted hover:text-nm-blue transition-colors"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      In Kalender speichern (.ics)
                    </a>
                    <button
                      onClick={() => setRegisterEvent({ id: event.id, title: event.title })}
                      className="flex items-center gap-1.5 text-xs font-semibold text-nm-blue hover:text-nm-blue/80 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Jetzt anmelden
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {registerEvent && (
        <EventRegistrationModal
          eventId={registerEvent.id}
          eventTitle={registerEvent.title}
          onClose={() => setRegisterEvent(null)}
        />
      )}
    </div>
  )
}
