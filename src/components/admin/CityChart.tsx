'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'

interface CityChartProps {
  data: Array<{ city: string | null; _count: { id: number } }>
}

export default function CityChart({ data }: CityChartProps) {
  const filtered = data
    .filter((d) => d.city !== null && d.city.trim() !== '')
    .sort((a, b) => b._count.id - a._count.id)
    .slice(0, 15)
    .map((d) => ({ city: d.city as string, count: d._count.id }))

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-card">
      <h3 className="font-bold text-gray-900 dark:text-white mb-6">
        Unterstützer nach Stadt (Top 15)
      </h3>

      {filtered.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-12">
          Noch keine Stadtdaten vorhanden.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(260, filtered.length * 36)}>
          <BarChart
            data={filtered}
            layout="vertical"
            margin={{ top: 5, right: 24, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="city"
              width={110}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--tooltip-bg, #fff)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '13px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              }}
              formatter={(val: number) => [val, 'Unterstützer']}
              labelFormatter={(label) => `${label}`}
              cursor={{ fill: 'rgba(79,141,255,0.06)' }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {filtered.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === 0 ? '#4F8DFF' : i === 1 ? '#6BA3FF' : '#93C5FD'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
