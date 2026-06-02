'use client'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

interface ChartData {
  date: string
  count: number
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
}

export default function Charts({ data }: { data: ChartData[] }) {
  const chartData = data.map((d) => ({ ...d, label: formatDate(d.date) }))

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-card">
      <h3 className="font-bold text-gray-900 dark:text-white mb-6">
        Neue Unterstützer (letzte 30 Tage)
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F8DFF" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#4F8DFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval={6}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--tooltip-bg, #fff)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '13px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            }}
            formatter={(val: number) => [val, 'Neue Unterstützer']}
            labelFormatter={(label) => `Datum: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#4F8DFF"
            strokeWidth={2.5}
            fill="url(#colorCount)"
            dot={false}
            activeDot={{ r: 5, fill: '#4F8DFF' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
