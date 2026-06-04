import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const POINTS: Record<string, number> = {
  vote: 1,
  idea: 5,
  question: 3,
  petition: 5,
  quiz: 2,
  debatte: 3,
  wissenstest: 2,
}

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email')
    if (!email) return NextResponse.json({ error: 'email fehlt' }, { status: 400 })
    const entry = await prisma.civicScore.findUnique({ where: { email } })
    return NextResponse.json({ score: entry?.score ?? 0 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, action } = await req.json()
    if (!email || !action) return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })

    const points = POINTS[action] ?? 1

    const entry = await prisma.civicScore.upsert({
      where: { email },
      update: {
        score: { increment: points },
        actions: { increment: 1 },
        lastAction: action,
      },
      create: {
        email,
        score: points,
        actions: 1,
        lastAction: action,
      },
    })

    const rank = await prisma.civicScore.count({
      where: { score: { gt: entry.score } },
    })

    return NextResponse.json({ score: entry.score, actions: entry.actions, rank: rank + 1 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
