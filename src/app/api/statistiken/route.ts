import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [
      supporters, members, fragen, ideen, debatten, wissenstest,
      faktencheck, glossar, zitate, abstimmungVotes,
    ] = await Promise.all([
      prisma.supporter.count(),
      prisma.mitglied.count(),
      prisma.buergerFrage.count({ where: { published: true } }),
      prisma.idee.count({ where: { published: true } }),
      prisma.debatte.count(),
      prisma.wissenstest.count(),
      prisma.faktencheck.count({ where: { published: true } }),
      prisma.glossarEintrag.count({ where: { published: true } }),
      prisma.zitat.count({ where: { published: true } }),
      prisma.abstimmungVote.count(),
    ])
    return NextResponse.json({
      supporters, members, fragen, ideen, debatten,
      wissenstest, faktencheck, glossar, zitate, abstimmungVotes,
    })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
