import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const tickers = await prisma.wahlTicker.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: { orderBy: { createdAt: 'desc' }, take: 100 } },
    })
    return NextResponse.json(tickers)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { title } = await req.json()
    if (!title?.trim()) return NextResponse.json({ error: 'Titel fehlt' }, { status: 400 })
    const ticker = await prisma.wahlTicker.create({ data: { title: title.trim() } })
    return NextResponse.json(ticker, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
