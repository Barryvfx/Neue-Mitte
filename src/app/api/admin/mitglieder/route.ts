import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

async function isAdmin() {
  const c = await cookies()
  return c.get('nm_admin')?.value === process.env.ADMIN_SECRET
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const items = await prisma.mitgliedsContent.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { title, content, type, order } = await req.json()
    if (!title || !content) return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    const item = await prisma.mitgliedsContent.create({
      data: {
        title,
        content,
        type: type ?? 'dokument',
        order: order ?? 0,
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
