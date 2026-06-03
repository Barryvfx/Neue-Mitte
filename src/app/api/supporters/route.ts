import { NextRequest, NextResponse } from 'next/server'
import { headers, cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { supporterSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
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

  const { firstName, lastName, email, city, message, website } = result.data

  if (website && website.length > 0) {
    return NextResponse.json({ success: true })
  }

  // Session token check
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('nm_st')?.value

  if (!sessionToken) {
    return NextResponse.json(
      { error: 'Bitte laden Sie die Seite neu und versuchen Sie es erneut.' },
      { status: 400 }
    )
  }

  let tokenRecord
  try {
    tokenRecord = await prisma.supporterToken.findUnique({ where: { token: sessionToken } })
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }

  if (!tokenRecord) {
    return NextResponse.json(
      { error: 'Ungültige Sitzung. Bitte laden Sie die Seite neu.' },
      { status: 400 }
    )
  }

  if (tokenRecord.used) {
    return NextResponse.json(
      { error: 'Sie haben bereits unterschrieben. Vielen Dank!' },
      { status: 409 }
    )
  }

  if (tokenRecord.expiresAt < new Date()) {
    return NextResponse.json(
      { error: 'Ihre Sitzung ist abgelaufen. Bitte laden Sie die Seite neu.' },
      { status: 400 }
    )
  }

  try {
    await prisma.$transaction([
      prisma.supporter.create({
        data: { firstName, lastName, email, city: city ?? null, message: message ?? null },
      }),
      prisma.supporterToken.update({
        where: { token: sessionToken },
        data: { used: true },
      }),
    ])
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
