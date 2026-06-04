import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { seedBildung } from '@/lib/autoseed'

export async function GET() {
  try {
    await seedBildung()
    const items = await prisma.bildungArtikel.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, summary: true, topic: true, createdAt: true },
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([])
  }
}
