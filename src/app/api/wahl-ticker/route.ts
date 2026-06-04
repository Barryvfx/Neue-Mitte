import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const ticker = await prisma.wahlTicker.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      include: {
        items: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    })
    return NextResponse.json(ticker ?? null)
  } catch {
    return NextResponse.json(null)
  }
}
