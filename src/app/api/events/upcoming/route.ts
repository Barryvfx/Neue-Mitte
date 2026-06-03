import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const events = await prisma.event.findMany({
    where: { active: true, date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    select: { id: true, title: true, description: true, location: true, date: true },
  })
  return NextResponse.json(
    events.map((e) => ({ ...e, date: e.date.toISOString() }))
  )
}
