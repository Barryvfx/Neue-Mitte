import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type')

  try {
    if (!type) {
      return NextResponse.json(
        { types: ['versprechen', 'ideen', 'buergerfragen', 'wissenstest-stats'] },
        {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename="offene-daten.json"',
          },
        }
      )
    }

    if (type === 'versprechen') {
      const data = await prisma.versprechen.findMany({ orderBy: { order: 'asc' } })
      return NextResponse.json(data, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="versprechen.json"',
        },
      })
    }

    if (type === 'ideen') {
      const data = await prisma.idee.findMany({
        where: { published: true },
        orderBy: { votes: 'desc' },
      })
      return NextResponse.json(data, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="ideen.json"',
        },
      })
    }

    if (type === 'buergerfragen') {
      const data = await prisma.buergerFrage.findMany({
        where: { answered: true },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(data, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="buergerfragen.json"',
        },
      })
    }

    if (type === 'wissenstest-stats') {
      const questions = await prisma.wissenstest.groupBy({
        by: ['category'],
        _count: { id: true },
      })
      const stats = questions.map((q) => ({ category: q.category, count: q._count.id }))
      return NextResponse.json(stats, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="wissenstest-stats.json"',
        },
      })
    }

    return NextResponse.json({ error: 'Unbekannter Typ' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
