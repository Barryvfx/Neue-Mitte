import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, location, date, active } = body

  const event = await prisma.event.create({
    data: {
      title,
      description,
      location,
      date: new Date(date),
      active: active ?? true,
    },
  })

  return NextResponse.json(event, { status: 201 })
}
