import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { seedGlossar } from '@/lib/autoseed'

export async function GET(req: NextRequest) {
  try {
    await seedGlossar()
    const letter = req.nextUrl.searchParams.get('letter')
    const q = req.nextUrl.searchParams.get('q')
    const items = await prisma.glossarEintrag.findMany({
      where: {
        published: true,
        ...(letter && letter !== 'Alle' && { letter }),
        ...(q && { term: { contains: q } }),
      },
      orderBy: [{ letter: 'asc' }, { term: 'asc' }],
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
