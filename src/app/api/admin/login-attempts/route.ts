import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const attempts = await prisma.loginAttempt.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return NextResponse.json(attempts)
}
