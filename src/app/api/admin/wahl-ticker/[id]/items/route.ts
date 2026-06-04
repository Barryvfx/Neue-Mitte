import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: tickerId } = await params
  try {
    const { text, important } = await req.json()
    if (!text?.trim()) return NextResponse.json({ error: 'Text fehlt' }, { status: 400 })
    const item = await prisma.wahlTickerItem.create({
      data: { tickerId, text: text.trim(), important: Boolean(important) },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
