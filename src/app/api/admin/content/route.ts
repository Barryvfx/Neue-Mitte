import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const blocks = await prisma.contentBlock.findMany({ orderBy: { key: 'asc' } })
    return NextResponse.json(blocks)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'key and value required' }, { status: 400 })
    }

    const block = await prisma.contentBlock.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })
    return NextResponse.json(block)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
