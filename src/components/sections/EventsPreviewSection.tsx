import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'

async function getUpcomingEvents() {
  try {
    return await prisma.event.findMany({
      where: { active: true, date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      take: 3,
    })
  } catch { return [] }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(date: Date) {
  const t = new Date(date)
  const h = t.getHours()
  const m = t.getMinutes()
  if (h === 0 && m === 0) return null
  return t.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr'
}

export default async function EventsPreviewSection() {
  const events = await getUpcomingEvents()
  if (events.length === 0) return null

  return (
    <section className="nm-section bg-white border-t border-nm-line">
      <div className="nm-container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-nm-blue mb-2">
              Termine
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-nm-blue tracking-tight">
              Kommende Veranstaltungen
            </h2>
          </div>
          <Link
            href="/veranstaltungen"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-nm-blue hover:gap-2.5 transition-all"
          >
            Alle Termine
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const time = formatTime(event.date)
            return (
              <div
                key={event.id}
                className="border border-nm-line bg-nm-gray p-5 hover:border-nm-blue hover:bg-white transition-colors group"
              >
                <div className="flex items-center gap-2 text-nm-blue mb-3">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-xs font-bold tracking-wide">
                    {formatDate(event.date)}{time ? ` · ${time}` : ''}
                  </span>
                </div>
                <h3 className="font-black text-nm-blue text-base leading-snug mb-2 group-hover:text-nm-blue">
                  {event.title}
                </h3>
                {event.location && (
                  <div className="flex items-center gap-1.5 text-nm-muted">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="text-xs">{event.location}</span>
                  </div>
                )}
                {event.description && (
                  <p className="text-nm-muted text-sm mt-2 leading-relaxed line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="/veranstaltungen"
            className="flex items-center gap-2 text-sm font-semibold text-nm-blue"
          >
            Alle Veranstaltungen anzeigen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
