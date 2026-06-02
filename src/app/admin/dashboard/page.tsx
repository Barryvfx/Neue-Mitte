'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'
import StatsCards from '@/components/admin/StatsCards'
import Charts from '@/components/admin/Charts'

interface Stats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
  chartData: Array<{ date: string; count: number }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
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
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">Daten konnten nicht geladen werden.</p>
      )}
    </AdminShell>
  )
}
