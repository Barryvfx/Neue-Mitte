import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
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
