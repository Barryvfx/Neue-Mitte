'use client'

import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'

const QUOTES = [
  { text: 'Deutschland kann mehr.', author: 'Die Neue Mitte' },
  { text: 'Pragmatisch, lösungsorientiert, glaubwürdig — das ist die neue Mitte.', author: 'Neue Mitte' },
  { text: 'Gute Politik braucht keine Ideologie, sondern Ideen.', author: 'Neue Mitte' },
  { text: 'Die Mitte ist kein Kompromiss. Sie ist der Anspruch.', author: 'Neue Mitte' },
  { text: 'Wir stehen nicht rechts, nicht links. Wir stehen für Deutschland.', author: 'Neue Mitte' },
]

export default function QuoteShare() {
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)

  const quote = QUOTES[active]

  async function copy() {
    await navigator.clipboard.writeText(`„${quote.text}" — ${quote.author} | neue-mitte.org`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(`„${quote.text}"\n— ${quote.author}\nneu-mitte.org`)
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener')
  }

  return (
    <div className="bg-nm-blue text-white p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-5">
        <Share2 className="w-4 h-4 text-white/60" />
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/60">Teilen</p>
      </div>

      {/* Quote carousel */}
      <blockquote className="mb-6">
        <p className="font-black text-xl sm:text-2xl leading-snug mb-3">
          „{quote.text}"
        </p>
        <cite className="text-white/50 text-sm not-italic">— {quote.author}</cite>
      </blockquote>

      {/* Dots */}
      <div className="flex gap-1.5 mb-6">
        {QUOTES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === active ? 'bg-yellow-400' : 'bg-white/25 hover:bg-white/50'}`}
          />
        ))}
      </div>

      {/* Share actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={copy}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Kopiert!' : 'Kopieren'}
        </button>
        <button
          onClick={shareWhatsApp}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded transition-colors"
        >
          <span className="text-sm">📱</span>
          WhatsApp
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`„${quote.text}" — ${quote.author}`)}&url=${encodeURIComponent('https://neue-mitte.org')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded transition-colors"
        >
          <span className="text-sm">𝕏</span>
          Twitter/X
        </a>
      </div>
    </div>
  )
}
