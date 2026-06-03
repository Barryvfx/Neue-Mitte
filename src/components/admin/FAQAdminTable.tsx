'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface FAQ {
  id: string
  question: string
  order: number
  active: boolean
}

interface Props {
  faqs: FAQ[]
}

export default function FAQAdminTable({ faqs: initial }: Props) {
  const [faqs, setFaqs] = useState(initial)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(id: string, question: string) {
    if (!confirm(`"${question}" wirklich löschen?`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setFaqs((prev) => prev.filter((f) => f.id !== id))
        router.refresh()
      }
    } finally {
      setDeleting(null)
    }
  }

  if (faqs.length === 0) {
    return (
      <div className="bg-white border border-nm-line p-12 text-center">
        <p className="text-nm-muted mb-4">Noch keine FAQ vorhanden.</p>
        <Link href="/admin/faq/new" className="btn-primary">
          Erste Frage erstellen
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white border border-nm-line">
      <table className="nm-table w-full">
        <thead>
          <tr>
            <th>Reihenfolge</th>
            <th>Frage</th>
            <th>Status</th>
            <th className="text-right">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq) => (
            <tr key={faq.id}>
              <td className="text-nm-muted font-mono text-sm">{faq.order}</td>
              <td>
                <span className="font-medium text-nm-blue line-clamp-1">
                  {faq.question.length > 80 ? faq.question.slice(0, 80) + '…' : faq.question}
                </span>
              </td>
              <td>
                <span
                  className={`text-xs font-bold px-2 py-0.5 ${
                    faq.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-nm-gray text-nm-muted border border-nm-line'
                  }`}
                >
                  {faq.active ? 'Aktiv' : 'Inaktiv'}
                </span>
              </td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/faq/${faq.id}`}
                    className="text-xs font-semibold text-nm-blue hover:underline"
                  >
                    Bearbeiten
                  </Link>
                  <button
                    onClick={() => handleDelete(faq.id, faq.question)}
                    disabled={deleting === faq.id}
                    className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deleting === faq.id ? '…' : 'Löschen'}
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
