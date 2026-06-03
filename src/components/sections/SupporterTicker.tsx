'use client'

import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'

interface TickerEntry {
  tickerName: string
  createdAt: string
}

export default function SupporterTicker() {
  const [entries, setEntries] = useState<TickerEntry[]>([])
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    fetch('/api/supporters/ticker')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setEntries(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (entries.length <= 1) return
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % entries.length)
        setVisible(true)
      }, 400)
    }, 5000)
    return () => clearInterval(timer)
  }, [entries.length])

  if (entries.length === 0) return null
  const current = entries[idx]

  return (
    <div className="flex items-center gap-2.5 bg-nm-blue/5 border border-nm-blue/10 rounded-full px-4 py-2 text-sm">
      <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-nm-muted">Neuester Unterstützer:</span>
      <span
        className="font-bold text-nm-blue transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {current.tickerName}
      </span>
    </div>
  )
}
