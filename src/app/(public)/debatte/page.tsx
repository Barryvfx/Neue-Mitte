'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'

interface DebatteArg {
  id: string
  seite: 'pro' | 'contra'
}

interface Debatte {
  id: string
  title: string
  topic: string
  argumente: DebatteArg[]
  createdAt: string
}

export default function DebattePage() {
  const [items, setItems] = useState<Debatte[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/debatte')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Demokratie</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">Debattier-Forum</h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Pro &amp; Contra zu politischen Themen. Bringen Sie Ihre Argumente ein.
          </p>
        </div>
      </div>

      <div className="nm-container py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-nm-muted gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Wird geladen…</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <MessageSquare className="h-14 w-14 text-nm-line mx-auto mb-4" />
            <p className="text-nm-muted text-lg font-semibold mb-1">Noch keine Debatten</p>
            <p className="text-nm-muted text-sm">Debatten werden bald veröffentlicht.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
            {items.map(item => {
              const pro = item.argumente.filter(a => a.seite === 'pro').length
              const contra = item.argumente.filter(a => a.seite === 'contra').length
              return (
                <Link key={item.id} href={`/debatte/${item.id}`} className="nm-card rounded-xl p-5 block group">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-nm-blue/10 text-nm-blue">
                      {item.topic}
                    </span>
                    <span className="text-xs text-nm-muted">
                      {new Date(item.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <h2 className="font-black text-nm-blue text-base leading-snug mb-4 group-hover:underline decoration-nm-blue/30">
                    {item.title}
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-green-600">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm font-bold">{pro} Pro</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-500">
                      <ThumbsDown className="h-4 w-4" />
                      <span className="text-sm font-bold">{contra} Contra</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
