import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const items = await prisma.ehrenamt.findMany({
      where: { active: true },
      orderBy: [{ date: { sort: 'asc', nulls: 'last' } }],
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
