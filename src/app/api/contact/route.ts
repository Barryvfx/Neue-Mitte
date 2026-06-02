import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db'
import { contactSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { allowed } = rateLimit(`contact:${ip}`, 3, 60_000)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte warten Sie eine Minute.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  const result = contactSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors[0]?.message ?? 'Validierungsfehler.' },
      { status: 422 }
    )
  }

  const { name, email, subject, message, website } = result.data

  if (website && website.length > 0) {
    return NextResponse.json({ success: true })
  }

  try {
    await prisma.contactMessage.create({ data: { name, email, subject, message } })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Contact message error:', err)
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }
}
