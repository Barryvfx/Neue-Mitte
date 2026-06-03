'use client'

interface Subscriber {
  id: string
  email: string
  createdAt: string
}

interface Props {
  subscribers: Subscriber[]
}

export default function NewsletterTable({ subscribers }: Props) {
  const exportCsv = () => {
    const header = 'E-Mail,Angemeldet am'
    const rows = subscribers.map((s) => {
      const date = new Date(s.createdAt).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      return `${s.email},${date}`
    })
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-abonnenten-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (subscribers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400">
        Noch keine Newsletter-Abonnenten vorhanden.
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {subscribers.length} {subscribers.length === 1 ? 'Abonnent' : 'Abonnenten'} gesamt
        </p>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-nm-blue border border-nm-blue rounded-lg hover:bg-nm-blue hover:text-white transition-colors"
        >
          CSV exportieren
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
                  E-Mail
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
                  Angemeldet am
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                    {s.email}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(s.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
