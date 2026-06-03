import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })

  const polls = await prisma.poll.findMany({
    orderBy: { createdAt: 'desc' },
    include: { options: { orderBy: { id: 'asc' } } },
  })
  return NextResponse.json(polls)
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })

  let body: { question?: string; options?: string[] }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 }) }

  if (!body.question?.trim()) return NextResponse.json({ error: 'Frage fehlt.' }, { status: 422 })
  if (!Array.isArray(body.options) || body.options.length < 2) {
    return NextResponse.json({ error: 'Mindestens 2 Antwortmöglichkeiten erforderlich.' }, { status: 422 })
  }

  const poll = await prisma.poll.create({
    data: {
      question: body.question.trim(),
      options: { create: body.options.filter(Boolean).map((text) => ({ text: String(text).trim() })) },
    },
    include: { options: true },
  })
  return NextResponse.json(poll, { status: 201 })
}
