import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const items = await prisma.bildungArtikel.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const { title, slug, summary, content, topic } = body
    if (!title || !slug || !summary || !content) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }
    const item = await prisma.bildungArtikel.create({
      data: {
        title: title.trim(),
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        summary: summary.trim(),
        content: content.trim(),
        topic: topic ?? 'Allgemein',
        published: true,
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'P2002') {
      return NextResponse.json({ error: 'Slug bereits vergeben' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
