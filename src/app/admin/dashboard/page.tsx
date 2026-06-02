'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Users, LayoutDashboard, Loader2, Newspaper } from 'lucide-react'
import StatsCards from '@/components/admin/StatsCards'
import Charts from '@/components/admin/Charts'
import ThemeToggle from '@/components/ui/ThemeToggle'

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

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar / Top nav */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 bg-nm-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xs">NM</span>
                </div>
                <span className="font-black text-sm text-nm-blue dark:text-white hidden sm:block">Admin</span>
              </Link>
              <nav className="flex items-center gap-1">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-nm-blue/10 text-nm-blue dark:bg-nm-sky/10 dark:text-nm-sky"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/supporters"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  Unterstützer
                </Link>
                <Link
                  href="/admin/news"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Newspaper className="h-4 w-4" />
                  Meldungen
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">Abmelden</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Übersicht aller Unterstützer</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-nm-sky" />
          </div>
        ) : stats ? (
          <div className="space-y-6">
            <StatsCards stats={stats} />
            <Charts data={stats.chartData} />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-12">Daten konnten nicht geladen werden.</p>
        )}
      </div>
    </div>
  )
}
