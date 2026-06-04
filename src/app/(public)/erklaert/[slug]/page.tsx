'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'

interface Artikel {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  topic: string
  createdAt: string
}

export default function ErklaertArtikelPage() {
  const { slug } = useParams<{ slug: string }>()
  const [item, setItem] = useState<Artikel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/erklaert/${slug}`).then(r => r.json()).then(d => { setItem(d.error ? null : d); setLoading(false) }).catch(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="nm-container py-20 text-center text-nm-muted">Wird geladen…</div>
  if (!item) return (
    <div className="nm-container py-20 text-center">
      <BookOpen className="h-12 w-12 text-nm-line mx-auto mb-3" />
      <p className="text-nm-muted">Artikel nicht gefunden.</p>
      <Link href="/erklaert" className="text-nm-blue hover:underline text-sm mt-2 inline-block">← Zurück zur Übersicht</Link>
    </div>
  )

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-14 sm:py-18">
          <Link href="/erklaert" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Politik erklärt
          </Link>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">{item.topic}</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">{item.title}</h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">{item.summary}</p>
        </div>
      </div>

      <div className="nm-container py-10">
        <div className="max-w-2xl editorial-content">
          <div dangerouslySetInnerHTML={{ __html: item.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>').replace(/^/, '<p>').replace(/$/, '</p>') }} />
        </div>
        <div className="max-w-2xl mt-10 pt-6 border-t border-nm-line">
          <Link href="/erklaert" className="btn-ghost">← Mehr Erklärungen lesen</Link>
        </div>
      </div>
    </div>
  )
}
