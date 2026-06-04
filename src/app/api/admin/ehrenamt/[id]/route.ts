import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

async function isAdmin() {
  const c = await cookies()
  return c.get('nm_admin')?.value === process.env.ADMIN_SECRET
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await req.json()
    const data: Record<string, unknown> = {}
    const fields = ['title', 'description', 'location', 'category', 'contact', 'active']
    for (const f of fields) if (body[f] !== undefined) data[f] = body[f]
    if (body.date !== undefined) data.date = body.date ? new Date(body.date) : null
    const item = await prisma.ehrenamt.update({ where: { id }, data })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    await prisma.ehrenamt.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
