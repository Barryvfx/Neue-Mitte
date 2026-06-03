import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supporters = await prisma.supporter.findMany({
    where: { showInTicker: true, tickerName: { not: null } },
    select: { tickerName: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
  return NextResponse.json(supporters)
}
