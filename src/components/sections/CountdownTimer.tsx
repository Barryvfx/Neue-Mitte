'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  date: string
  location: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

export default function CountdownTimer() {
  const [event, setEvent] = useState<Event | null>(null)
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    fetch('/api/events/upcoming')
      .then(r => r.json())
      .then((events: Event[]) => {
        if (events.length > 0) setEvent(events[0])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!event) return
    const target = new Date(event.date)
    setTimeLeft(calcTimeLeft(target))
    const interval = setInterval(() => setTimeLeft(calcTimeLeft(target)), 1000)
    return () => clearInterval(interval)
  }, [event])

  if (!event || !timeLeft) return null
  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) return null

  return (
    <div className="bg-nm-blue/5 border border-nm-blue/20 rounded-xl p-5 text-center">
      <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-nm-muted mb-1">Nächste Veranstaltung</p>
      <p className="font-bold text-nm-blue text-sm mb-3 truncate">{event.title}</p>
      <div className="flex justify-center gap-3">
        {[
          { v: timeLeft.days, l: 'Tage' },
          { v: timeLeft.hours, l: 'Std' },
          { v: timeLeft.minutes, l: 'Min' },
          { v: timeLeft.seconds, l: 'Sek' },
        ].map(({ v, l }) => (
          <div key={l} className="flex flex-col items-center">
            <span className="text-2xl font-black text-nm-blue w-12 text-center tabular-nums">
              {String(v).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-nm-muted font-medium">{l}</span>
          </div>
        ))}
      </div>
      <Link href="/veranstaltungen" className="mt-3 text-xs text-nm-blue font-semibold hover:underline inline-block">
        Zur Veranstaltung →
      </Link>
    </div>
  )
}
