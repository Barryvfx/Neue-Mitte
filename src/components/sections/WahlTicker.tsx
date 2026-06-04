'use client'

import { useEffect, useState, useRef } from 'react'
import { Radio, Star } from 'lucide-react'

interface TickerItem { id: string; text: string; important: boolean; createdAt: string }
interface Ticker { id: string; title: string; items: TickerItem[] }

export default function WahlTicker() {
  const [ticker, setTicker] = useState<Ticker | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const res = await fetch('/api/wahl-ticker')
        const data = await res.json()
        if (active) setTicker(data)
      } catch {}
    }
    load()
    const interval = setInterval(load, 15_000)
    return () => { active = false; clearInterval(interval) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ticker?.items.length])

  if (!ticker) return null

  return (
    <section className="nm-section-sm bg-nm-blue/5 border-y border-nm-line">
      <div className="nm-container">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
            <Radio className="h-3 w-3" /> LIVE
          </div>
          <h2 className="font-black text-nm-blue text-lg">{ticker.title}</h2>
          <span className="text-xs text-nm-muted ml-auto">Aktualisiert alle 15 Sek.</span>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {[...ticker.items].reverse().map(item => (
            <div key={item.id} className={`flex gap-3 p-3 rounded-xl border transition-all ${item.important ? 'border-nm-blue bg-nm-blue/5' : 'border-nm-line bg-white'}`}>
              <div className="flex-shrink-0 mt-0.5">
                {item.important
                  ? <Star className="h-4 w-4 text-nm-blue fill-nm-blue" />
                  : <span className="block w-1.5 h-1.5 rounded-full bg-nm-muted mt-1.5" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${item.important ? 'font-bold text-nm-blue' : 'text-nm-text'}`}>{item.text}</p>
                <span className="text-xs text-nm-muted mt-0.5 block">
                  {new Date(item.createdAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
                </span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </section>
  )
}
