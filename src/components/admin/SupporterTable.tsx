'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search, Download, Trash2, ChevronLeft, ChevronRight,
  ChevronUp, ChevronDown, ChevronsUpDown, Loader2, Pencil,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import SupporterEditModal from '@/components/admin/SupporterEditModal'

interface Supporter {
  id: string
  firstName: string
  lastName: string
  email: string
  city: string
  notes: string
  createdAt: string
}

interface ApiResponse {
  supporters: Supporter[]
  total: number
  page: number
  totalPages: number
}

type SortField = 'firstName' | 'lastName' | 'email' | 'city' | 'createdAt'

function SortIcon({ field, sort, order }: { field: SortField; sort: SortField; order: 'asc' | 'desc' }) {
  if (sort !== field) return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />
  return order === 'asc'
    ? <ChevronUp className="h-3.5 w-3.5 text-nm-blue dark:text-nm-sky" />
    : <ChevronDown className="h-3.5 w-3.5 text-nm-blue dark:text-nm-sky" />
}

export default function SupporterTable() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortField>('createdAt')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [editingSupporter, setEditingSupporter] = useState<Supporter | null>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [debouncedCity, setDebouncedCity] = useState('')

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedCity(cityFilter)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [cityFilter])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        sort,
        order,
        ...(debouncedSearch && { q: debouncedSearch }),
        ...(debouncedCity && { city: debouncedCity }),
        ...(dateFrom && { from: dateFrom }),
        ...(dateTo && { to: dateTo }),
      })
      const res = await fetch(`/api/admin/supporters?${params}`)
      const json = await res.json()
      setData(json)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [page, sort, order, debouncedSearch, debouncedCity, dateFrom, dateTo])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSort = (field: SortField) => {
    if (sort === field) {
      setOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    } else {
      setSort(field)
      setOrder('desc')
    }
    setPage(1)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${name} wirklich löschen?`)) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/supporters/${id}`, { method: 'DELETE' })
      fetchData()
    } finally {
      setDeleting(null)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/admin/supporters/export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `unterstuetzer-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  const handleSave = (updated: Supporter) => {
    setData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        supporters: prev.supporters.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
      }
    })
  }

  const COLS: { label: string; field: SortField }[] = [
    { label: 'Vorname', field: 'firstName' },
    { label: 'Nachname', field: 'lastName' },
    { label: 'E-Mail', field: 'email' },
    { label: 'Wohnort', field: 'city' },
    { label: 'Datum', field: 'createdAt' },
  ]

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Name, E-Mail, Wohnort…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-9 h-10 text-sm"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          loading={exporting}
          className="flex-shrink-0"
        >
          <Download className="h-4 w-4" />
          CSV Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Von</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
            className="h-9 px-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Bis</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
            className="h-9 px-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 transition-colors"
          />
        </div>
        <div className="relative flex-1 max-w-xs">
          <input
            type="search"
            placeholder="Wohnort filtern…"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nm-blue/30 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                {COLS.map(({ label, field }) => (
                  <th
                    key={field}
                    className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 cursor-pointer select-none hover:text-gray-900 dark:hover:text-white transition-colors"
                    onClick={() => handleSort(field)}
                  >
                    <span className="flex items-center gap-1.5">
                      {label}
                      <SortIcon field={field} sort={sort} order={order} />
                    </span>
                  </th>
                ))}
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Notizen</th>
                <th className="w-24 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-nm-sky mx-auto" />
                  </td>
                </tr>
              ) : !data?.supporters.length ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-500">
                    {debouncedSearch ? 'Keine Ergebnisse gefunden.' : 'Noch keine Unterstützer.'}
                  </td>
                </tr>
              ) : (
                data.supporters.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{s.firstName}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.lastName}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.email}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.city}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-500 whitespace-nowrap">
                      {new Date(s.createdAt).toLocaleDateString('de-DE', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[180px]">
                      {s.notes
                        ? <span title={s.notes} className="truncate block">{s.notes.length > 50 ? s.notes.slice(0, 50) + '…' : s.notes}</span>
                        : <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setEditingSupporter(s)}
                          className="p-1.5 text-gray-400 hover:text-nm-blue dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                          title="Bearbeiten"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, `${s.firstName} ${s.lastName}`)}
                          disabled={deleting === s.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
                          title="Löschen"
                        >
                          {deleting === s.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500">
              {((page - 1) * 20 + 1).toLocaleString('de-DE')}–
              {Math.min(page * 20, data.total).toLocaleString('de-DE')} von{' '}
              {data.total.toLocaleString('de-DE')}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-xs font-medium">
                {page} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {data && (
        <p className="text-xs text-gray-500 mt-3">
          {data.total.toLocaleString('de-DE')} Unterstützer{debouncedSearch ? ' (gefiltert)' : ' gesamt'}
        </p>
      )}

      {editingSupporter && (
        <SupporterEditModal
          supporter={editingSupporter}
          onClose={() => setEditingSupporter(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
