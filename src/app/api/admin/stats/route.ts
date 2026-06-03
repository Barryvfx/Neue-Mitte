import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  const [total, today, thisWeek, thisMonth, rawChart, rawCityStats, newsletterCount] = await Promise.all([
    prisma.supporter.count(),
    prisma.supporter.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.supporter.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.supporter.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.supporter.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.supporter.groupBy({
      by: ['city'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    prisma.newsletterSubscriber.count(),
  ])

  // Build daily chart data (last 30 days)
  const dayMap = new Map<string, number>()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    dayMap.set(key, 0)
  }

  rawChart.forEach(({ createdAt }) => {
    const key = createdAt.toISOString().slice(0, 10)
    if (dayMap.has(key)) dayMap.set(key, (dayMap.get(key) ?? 0) + 1)
  })

  const chartData = Array.from(dayMap.entries()).map(([date, count]) => ({
    date,
    count,
  }))

  const cityStats = rawCityStats
    .filter((row) => row.city !== null)
    .map((row) => ({ city: row.city as string, count: row._count.id }))

  return NextResponse.json({ total, today, thisWeek, thisMonth, chartData, cityStats, newsletterCount })
}
