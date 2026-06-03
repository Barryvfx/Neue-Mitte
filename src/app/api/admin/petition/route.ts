import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [signatures, count, goal] = await Promise.all([
      prisma.petitionSignature.findMany({ orderBy: { createdAt: 'desc' }, take: 200 }),
      prisma.petitionSignature.count(),
      prisma.contentBlock.findUnique({ where: { key: 'petition_goal' } }),
    ])
    return NextResponse.json({ signatures, count, goal: parseInt(goal?.value ?? '10000') })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
