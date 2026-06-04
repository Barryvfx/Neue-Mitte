import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { seedGesetz } from '@/lib/autoseed'

export async function GET(req: NextRequest) {
  try {
    await seedGesetz()
    const id = req.nextUrl.searchParams.get('id')
    if (id) {
      const item = await prisma.gesetzFokus.findUnique({ where: { id } })
      if (!item || !item.published) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(item)
    }
    const items = await prisma.gesetzFokus.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
