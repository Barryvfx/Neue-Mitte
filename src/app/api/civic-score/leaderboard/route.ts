import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  return `${local.slice(0, 2)}***@${domain}`
}

export async function GET() {
  try {
    const entries = await prisma.civicScore.findMany({
      orderBy: { score: 'desc' },
      take: 20,
      select: { email: true, score: true, actions: true },
    })
    const masked = entries.map((e, i) => ({
      rank: i + 1,
      email: maskEmail(e.email),
      score: e.score,
      actions: e.actions,
    }))
    return NextResponse.json(masked)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
