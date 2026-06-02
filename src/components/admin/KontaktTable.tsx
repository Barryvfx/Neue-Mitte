'use client'

import { useState } from 'react'
import { Trash2, MailOpen, Mail, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

interface Props {
  initialMessages: Message[]
}

export default function KontaktTable({ initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id))
  }

  const markRead = async (id: string) => {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/kontakt/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: true } : m))
        )
      }
    } finally {
      setLoadingId(null)
    }
  }

  const deleteMessage = async (id: string, name: string) => {
    if (!confirm(`Nachricht von ${name} wirklich löschen?`)) return
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/kontakt/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
        if (expanded === id) setExpanded(null)
      }
    } finally {
      setLoadingId(null)
    }
  }

  if (messages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400">
        Keine Kontaktnachrichten vorhanden.
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">E-Mail</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Betreff</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Datum</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
              <th className="px-4 py-3 w-28" />
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <>
                <tr
                  key={msg.id}
                  className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                  onClick={() => toggleExpand(msg.id)}
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {!msg.read && (
                      <span className="inline-block w-2 h-2 rounded-full bg-nm-blue dark:bg-blue-400 mr-2 align-middle" />
                    )}
                    {msg.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{msg.email}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">{msg.subject}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-500 whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {msg.read ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <MailOpen className="h-3.5 w-3.5" /> gelesen
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-nm-blue dark:text-blue-400">
                        <Mail className="h-3.5 w-3.5" /> ungelesen
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                      {!msg.read && (
                        <button
                          onClick={() => markRead(msg.id)}
                          disabled={loadingId === msg.id}
                          title="Als gelesen markieren"
                          className="p-1.5 text-gray-400 hover:text-nm-blue dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors disabled:opacity-50"
                        >
                          {loadingId === msg.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <MailOpen className="h-4 w-4" />}
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(msg.id, msg.name)}
                        disabled={loadingId === msg.id}
                        title="Löschen"
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
                      >
                        {loadingId === msg.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => toggleExpand(msg.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {expanded === msg.id
                          ? <ChevronUp className="h-4 w-4" />
                          : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
                {expanded === msg.id && (
                  <tr key={`${msg.id}-expanded`} className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <td colSpan={6} className="px-6 py-4">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Nachricht</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                        Eingegangen am{' '}
                        {new Date(msg.createdAt).toLocaleString('de-DE', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
