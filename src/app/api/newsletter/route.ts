import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'

const newsletterSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse').max(254),
  website: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { allowed } = rateLimit(`newsletter:${ip}`, 3, 60_000)

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

  const result = newsletterSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors[0]?.message ?? 'Validierungsfehler.' },
      { status: 422 }
    )
  }

  const { email, website } = result.data

  // Honeypot: if the hidden field is filled, silently succeed
  if (website && website.length > 0) {
    return NextResponse.json({ success: true })
  }

  try {
    await prisma.newsletterSubscriber.create({
      data: { email },
    })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: unknown) {
    const code = (err as { code?: string }).code
    if (code === 'P2002') {
      return NextResponse.json(
        { error: 'Diese E-Mail-Adresse ist bereits angemeldet.' },
        { status: 409 }
      )
    }
    console.error('Newsletter subscription error:', err)
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }
}
