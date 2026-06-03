'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'
import StatsCards from '@/components/admin/StatsCards'
import Charts from '@/components/admin/Charts'
import CityChart from '@/components/admin/CityChart'
import GermanyMap from '@/components/admin/GermanyMap'

interface Stats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
  chartData: Array<{ date: string; count: number }>
  cityStats: Array<{ city: string; count: number }>
}

interface RecentSupporter {
  id: string
  firstName: string
  lastName: string
  email: string
  city: string
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentSupporters, setRecentSupporters] = useState<RecentSupporter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => {
        if (r.status === 401) { router.push('/admin'); return null }
        return r.json()
      })
      .then((data) => { if (data) setStats(data) })
      .finally(() => setLoading(false))
  }, [router])

  useEffect(() => {
    fetch('/api/admin/supporters?limit=5&sort=createdAt&order=desc')
      .then((r) => {
        if (!r.ok) return null
        return r.json()
      })
      .then((data) => {
        if (data?.supporters) setRecentSupporters(data.supporters)
      })
  }, [])

  return (
    <AdminShell active="dashboard">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Übersicht aller Unterstützer</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-nm-blue" />
        </div>
      ) : stats ? (
        <div className="space-y-6">
          <StatsCards stats={stats} />
          <Charts data={stats.chartData} />

          {/* Two-column: bar chart + Germany map */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CityChart data={stats.cityStats ?? []} />
            <GermanyMap data={stats.cityStats ?? []} />
          </div>

          {/* Letzte Anmeldungen */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-card">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Letzte Anmeldungen</h3>
            {recentSupporters.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                Noch keine Anmeldungen vorhanden.
              </p>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {recentSupporters.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-nm-blue/10 dark:bg-nm-blue/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-nm-blue dark:text-blue-400">
                          {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.email}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(s.createdAt).toLocaleDateString('de-DE', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                        })}
                      </p>
                      {s.city && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">{s.city}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">Daten konnten nicht geladen werden.</p>
      )}
    </AdminShell>
  )
}
