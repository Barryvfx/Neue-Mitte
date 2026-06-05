'use client'

import { useState, useEffect } from 'react'
import { Quote, Copy, Check } from 'lucide-react'

interface ZitatItem {
  text: string
  author: string
  year: number | null
  context: string | null
}

export default function TageszitатWidget() {
  const [zitat, setZitat] = useState<ZitatItem | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/zitate?daily=1')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setZitat(d) })
      .catch(() => {})
  }, [])

  function copy() {
    if (!zitat) return
    const text = `„${zitat.text}" – ${zitat.author}${zitat.year ? ` (${zitat.year})` : ''}`
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!zitat) return null

  return (
    <section className="bg-nm-blue/5 border-y border-nm-blue/10 py-8">
      <div className="nm-container">
        <div className="flex items-start gap-4 max-w-3xl mx-auto">
          <Quote className="h-6 w-6 text-nm-blue/30 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-nm-muted mb-2">Zitat des Tages</p>
            <blockquote className="text-nm-text font-semibold leading-relaxed text-base sm:text-lg mb-2">
              „{zitat.text}"
            </blockquote>
            <p className="text-sm text-nm-muted font-bold">
              – {zitat.author}{zitat.year ? ` (${zitat.year})` : ''}
            </p>
            {zitat.context && <p className="text-xs text-nm-muted italic mt-0.5">{zitat.context}</p>}
          </div>
          <button onClick={copy} aria-label="Kopieren"
            className="p-2 rounded-lg text-nm-muted hover:text-nm-blue hover:bg-nm-blue/10 transition-colors flex-shrink-0">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </section>
  )
}
