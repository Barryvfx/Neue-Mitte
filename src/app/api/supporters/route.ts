import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db'
import { supporterSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  // Rate limiting
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { allowed } = rateLimit(`supporter:${ip}`, 3, 60_000)

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

  const result = supporterSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors[0]?.message ?? 'Validierungsfehler.' },
      { status: 422 }
    )
  }

  const { firstName, lastName, email, city, website } = result.data

  // Honeypot check
  if (website && website.length > 0) {
    return NextResponse.json({ success: true })
  }

  try {
    await prisma.supporter.create({
      data: { firstName, lastName, email, city },
    })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: unknown) {
    const code = (err as { code?: string }).code
    if (code === 'P2002') {
      return NextResponse.json(
        { error: 'Diese E-Mail-Adresse ist bereits registriert.' },
        { status: 409 }
      )
    }
    console.error('Supporter creation error:', err)
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }
}
