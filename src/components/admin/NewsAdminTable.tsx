'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Article {
  id: string
  title: string
  slug: string
  published: boolean
  publishedAt: Date | null
  createdAt: Date
}

interface Props {
  articles: Article[]
}

function formatDate(d: Date | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function NewsAdminTable({ articles: initial }: Props) {
  const [articles, setArticles] = useState(initial)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" wirklich löschen?`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id))
        router.refresh()
      }
    } finally {
      setDeleting(null)
    }
  }

  if (articles.length === 0) {
    return (
      <div className="bg-white border border-nm-line p-12 text-center">
        <p className="text-nm-muted mb-4">Noch keine Meldungen vorhanden.</p>
        <Link href="/admin/news/new" className="btn-primary">
          Erste Meldung erstellen
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white border border-nm-line">
      <table className="nm-table">
        <thead>
          <tr>
            <th>Titel</th>
            <th>Status</th>
            <th>Veröffentlicht</th>
            <th>Erstellt</th>
            <th className="text-right">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id}>
              <td>
                <div className="font-medium text-nm-blue">{a.title}</div>
                <div className="text-xs text-nm-muted/60 font-mono">/aktuelles/{a.slug}</div>
              </td>
              <td>
                <span
                  className={`text-xs font-bold px-2 py-0.5 ${
                    a.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-nm-gray text-nm-muted border border-nm-line'
                  }`}
                >
                  {a.published ? 'Veröffentlicht' : 'Entwurf'}
                </span>
              </td>
              <td className="text-sm text-nm-muted">{formatDate(a.publishedAt)}</td>
              <td className="text-sm text-nm-muted">{formatDate(a.createdAt)}</td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/aktuelles/${a.slug}`}
                    target="_blank"
                    className="text-xs text-nm-muted hover:text-nm-blue"
                  >
                    Ansehen ↗
                  </Link>
                  <Link
                    href={`/admin/news/${a.id}`}
                    className="text-xs font-semibold text-nm-blue hover:underline"
                  >
                    Bearbeiten
                  </Link>
                  <button
                    onClick={() => handleDelete(a.id, a.title)}
                    disabled={deleting === a.id}
                    className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deleting === a.id ? '…' : 'Löschen'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
