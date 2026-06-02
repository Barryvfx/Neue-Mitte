'use client'

import { Users, TrendingUp, Calendar, CalendarDays } from 'lucide-react'

interface Stats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
}

export default function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: 'Gesamt',
      value: stats.total,
      Icon: Users,
      color: 'text-nm-blue dark:text-nm-sky',
      bg: 'bg-nm-blue/10 dark:bg-nm-sky/10',
    },
    {
      label: 'Heute',
      value: stats.today,
      Icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950/40',
    },
    {
      label: 'Diese Woche',
      value: stats.thisWeek,
      Icon: CalendarDays,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
    },
    {
      label: 'Diesen Monat',
      value: stats.thisMonth,
      Icon: Calendar,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-950/40',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, Icon, color, bg }) => (
        <div
          key={label}
          className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">
            {value.toLocaleString('de-DE')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
        </div>
      ))}
    </div>
  )
}
