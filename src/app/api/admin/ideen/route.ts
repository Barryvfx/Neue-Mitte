import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const items = await prisma.idee.findMany({ orderBy: [{ votes: 'desc' }, { createdAt: 'desc' }] })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
