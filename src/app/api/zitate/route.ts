import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { seedZitate } from '@/lib/autoseed'

export async function GET(req: NextRequest) {
  try {
    await seedZitate()
    const daily = req.nextUrl.searchParams.get('daily')
    const category = req.nextUrl.searchParams.get('category')

    if (daily) {
      const count = await prisma.zitat.count({ where: { published: true } })
      const day = Math.floor(Date.now() / 86400000)
      const skip = day % count
      const zitat = await prisma.zitat.findFirst({
        where: { published: true },
        skip,
        orderBy: { id: 'asc' },
      })
      return NextResponse.json(zitat)
    }

    const items = await prisma.zitat.findMany({
      where: { published: true, ...(category && category !== 'Alle' && { category }) },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
