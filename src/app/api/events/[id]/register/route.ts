import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { allowed } = rateLimit(`event-reg:${ip}`, 5, 60_000)
  if (!allowed) return NextResponse.json({ error: 'Zu viele Anfragen.' }, { status: 429 })

  const event = await prisma.event.findUnique({ where: { id, active: true } })
  if (!event) return NextResponse.json({ error: 'Veranstaltung nicht gefunden.' }, { status: 404 })
  if (event.date < new Date()) return NextResponse.json({ error: 'Diese Veranstaltung liegt in der Vergangenheit.' }, { status: 400 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 }) }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Validierungsfehler.' }, { status: 422 })

  try {
    await prisma.eventRegistration.create({
      data: { eventId: id, name: parsed.data.name, email: parsed.data.email },
    })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Sie sind bereits angemeldet.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const count = await prisma.eventRegistration.count({ where: { eventId: id } })
  return NextResponse.json({ count })
}
