import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const items = await prisma.versprechen.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] })
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
    const { title, description, status, category, order } = body
    if (!title?.trim()) return NextResponse.json({ error: 'Titel fehlt' }, { status: 400 })
    const item = await prisma.versprechen.create({
      data: { title: title.trim(), description: description?.trim() || null, status: status ?? 'gefordert', category: category ?? 'Allgemein', order: order ?? 0 },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
