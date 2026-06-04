import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const items = await prisma.wahlhelfer.findMany({
      where: { active: true },
      orderBy: [{ state: 'asc' }, { city: 'asc' }],
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
