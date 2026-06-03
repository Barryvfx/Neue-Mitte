import { prisma } from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Veranstaltungen – Neue Mitte',
  description: 'Kommende Veranstaltungen der Neuen Mitte.',
}

export const dynamic = 'force-dynamic'

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function VeranstaltungenPage() {
  const events = await prisma.event.findMany({
    where: {
      active: true,
      date: { gte: new Date() },
    },
    orderBy: { date: 'asc' },
  })

  return (
    <div className="bg-white">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">
            Neue Mitte
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Veranstaltungen
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Kommende Veranstaltungen und Termine der Neuen Mitte.
          </p>
        </div>
      </div>

      <div className="nm-container py-16">
        {events.length === 0 ? (
          <p className="text-nm-muted text-center py-20">Derzeit keine Veranstaltungen geplant.</p>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {events.map((event) => (
              <div key={event.id} className="border border-nm-line bg-white p-6 sm:p-8">
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-nm-blue mb-2">
                  {formatDate(event.date)}
                </p>
                <h2 className="text-xl font-black text-nm-blue mb-1">{event.title}</h2>
                {event.location && (
                  <p className="text-sm text-nm-muted mb-4">{event.location}</p>
                )}
                <p className="text-nm-muted leading-relaxed text-sm">{event.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
