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
    const debatten = await prisma.debatte.findMany({
      include: { _count: { select: { argumente: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(debatten)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { title, topic } = await req.json()
    if (!title) return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    const debatte = await prisma.debatte.create({ data: { title, topic: topic ?? 'Allgemein' } })
    return NextResponse.json(debatte, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
