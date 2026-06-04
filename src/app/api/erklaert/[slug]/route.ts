import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const item = await prisma.bildungArtikel.findUnique({ where: { slug, published: true } })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
