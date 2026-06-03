import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const poll = await prisma.poll.findFirst({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    include: { options: { orderBy: { id: 'asc' } } },
  })
  if (!poll) return NextResponse.json(null)
  const total = poll.options.reduce((s, o) => s + o.votes, 0)
  return NextResponse.json({ ...poll, total })
}
