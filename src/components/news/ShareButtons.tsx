'use client'

import { useState } from 'react'

interface Props {
  title: string
  url: string
}

export default function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`

  return (
    <div className="flex items-center gap-3 mt-8 pt-6 border-t border-nm-line">
      <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-nm-muted">
        Teilen
      </span>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-semibold text-nm-muted border border-nm-line px-3 py-1.5 hover:border-nm-blue hover:text-nm-blue transition-colors"
      >
        X / Twitter
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-semibold text-nm-muted border border-nm-line px-3 py-1.5 hover:border-nm-blue hover:text-nm-blue transition-colors"
      >
        WhatsApp
      </a>
      <button
        onClick={handleCopy}
        className="text-xs font-semibold text-nm-muted border border-nm-line px-3 py-1.5 hover:border-nm-blue hover:text-nm-blue transition-colors"
      >
        {copied ? 'Link kopiert ✓' : 'Link kopieren'}
      </button>
    </div>
  )
}
