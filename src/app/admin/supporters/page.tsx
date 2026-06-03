'use client'

import { useState, useEffect } from 'react'
import { List, TrendingUp } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'
import SupporterTable from '@/components/admin/SupporterTable'
import SupporterGrowthChart from '@/components/admin/SupporterGrowthChart'

interface ChartPoint { date: string; count: number }

export default function AdminSupporters() {
  const [view, setView] = useState<'table' | 'chart'>('table')
  const [chartData, setChartData] = useState<ChartPoint[]>([])

  useEffect(() => {
    if (view === 'chart' && chartData.length === 0) {
      fetch('/api/admin/stats')
        .then((r) => r.json())
        .then((data) => { if (data?.chartData) setChartData(data.chartData) })
        .catch(() => {})
    }
  }, [view, chartData.length])

  return (
    <AdminShell active="supporters">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Unterstützer</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Alle Unterstützerinnen und Unterstützer der Neuen Mitte
          </p>
        </div>

        {/* View toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 gap-1">
          <button
            onClick={() => setView('table')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              view === 'table'
                ? 'bg-white dark:bg-gray-800 text-nm-blue shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Tabelle
          </button>
          <button
            onClick={() => setView('chart')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              view === 'chart'
                ? 'bg-white dark:bg-gray-800 text-nm-blue shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Wachstum
          </button>
        </div>
      </div>

      {view === 'table' ? (
        <SupporterTable />
      ) : (
        <SupporterGrowthChart data={chartData} />
      )}
    </AdminShell>
  )
}
