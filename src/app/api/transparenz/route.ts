import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { seedTransparenz } from '@/lib/autoseed'

export async function GET() {
  try {
    await seedTransparenz()
    const items = await prisma.transparenzEintrag.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
