import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const c = await cookies()
    if (!c.get('nm_confirmed_email')?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const items = await prisma.mitgliedsContent.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
