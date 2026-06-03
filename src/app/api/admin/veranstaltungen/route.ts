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

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 }) }

  const { title, description, location, date, active } = body as Record<string, string | boolean>

  if (!String(title ?? '').trim()) return NextResponse.json({ error: 'Titel fehlt.' }, { status: 422 })
  if (!String(description ?? '').trim()) return NextResponse.json({ error: 'Beschreibung fehlt.' }, { status: 422 })
  if (!date) return NextResponse.json({ error: 'Datum fehlt.' }, { status: 422 })

  const parsedDate = new Date(String(date))
  if (isNaN(parsedDate.getTime())) return NextResponse.json({ error: 'Ungültiges Datum.' }, { status: 422 })

  const event = await prisma.event.create({
    data: {
      title: String(title).trim(),
      description: String(description).trim(),
      location: String(location ?? '').trim(),
      date: parsedDate,
      active: Boolean(active ?? true),
    },
  })

  return NextResponse.json(event, { status: 201 })
}
