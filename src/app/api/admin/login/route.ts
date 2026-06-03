import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import bcryptjs from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signToken, cookieName } from '@/lib/auth'
import { adminLoginSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { allowed } = rateLimit(`admin-login:${ip}`, 5, 300_000)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Zu viele Anmeldeversuche. Bitte warten Sie 5 Minuten.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  const result = adminLoginSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Ungültige Zugangsdaten.' }, { status: 400 })
  }

  const { email, password } = result.data

  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) {
    await bcryptjs.hash('dummy', 10)
    try { await prisma.loginAttempt.create({ data: { email, ip, success: false } }) } catch {}
    return NextResponse.json({ error: 'Ungültige Zugangsdaten.' }, { status: 401 })
  }

  const valid = await bcryptjs.compare(password, admin.password)
  if (!valid) {
    try { await prisma.loginAttempt.create({ data: { email, ip, success: false } }) } catch {}
    return NextResponse.json({ error: 'Ungültige Zugangsdaten.' }, { status: 401 })
  }

  try { await prisma.loginAttempt.create({ data: { email, ip, success: true } }) } catch {}

  const token = await signToken({ adminId: admin.id, email: admin.email })

  const response = NextResponse.json({ success: true })
  response.cookies.set(cookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })

  return response
}
