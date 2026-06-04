import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { seedFaktencheck } from '@/lib/autoseed'

export async function GET(req: NextRequest) {
  try {
    await seedFaktencheck()
    const slug = req.nextUrl.searchParams.get('slug')
    if (slug) {
      const item = await prisma.faktencheck.findUnique({
        where: { id: slug },
      })
      if (!item || !item.published) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(item)
    }
    const items = await prisma.faktencheck.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
