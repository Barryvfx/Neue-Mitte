import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })

  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
    include: {
      registrations: {
        orderBy: { createdAt: 'asc' },
        select: { id: true, name: true, email: true, createdAt: true },
      },
    },
  })

  return NextResponse.json(
    events.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date.toISOString(),
      registrationCount: e.registrations.length,
      registrations: e.registrations.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    }))
  )
}
