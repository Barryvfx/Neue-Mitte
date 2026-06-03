'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface DataPoint {
  date: string
  count: number
}

interface Props {
  data: DataPoint[]
}

export default function SupporterGrowthChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        Noch keine Daten vorhanden.
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Neue Unterstützer pro Tag</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickFormatter={(v: string) => {
              const d = new Date(v)
              return `${d.getDate()}.${d.getMonth() + 1}.`
            }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} allowDecimals={false} />
          <Tooltip
            labelFormatter={(v: string) => new Date(v).toLocaleDateString('de-DE')}
            formatter={(v: number) => [`${v} Unterstützer`, '']}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#0B3A75"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#0B3A75' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
