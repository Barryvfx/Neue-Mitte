import { NextRequest, NextResponse } from 'next/server'
import { headers, cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { supporterSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'

const FROM = process.env.NEWSLETTER_FROM ?? 'Neue Mitte <newsletter@neue-mitte.org>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://neue-mitte.org'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
}

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

  const { firstName, lastName, email, city, message, website, showInTicker, tickerName } = result.data

  if (website && website.length > 0) {
    return NextResponse.json({ success: true })
  }

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('nm_st')?.value
  const referralToken = cookieStore.get('nm_ref')?.value ?? null

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

  const confirmToken = randomBytes(24).toString('base64url')

  try {
    await prisma.$transaction([
      prisma.supporter.create({
        data: {
          firstName, lastName, email,
          city: city ?? null,
          message: message ?? null,
          showInTicker: showInTicker ?? false,
          tickerName: (showInTicker && tickerName?.trim()) ? tickerName.trim() : null,
          confirmed: false,
          confirmToken,
          referralToken,
        },
      }),
      prisma.supporterToken.update({
        where: { token: sessionToken },
        data: { used: true },
      }),
    ])
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

  // Send confirmation email (non-blocking)
  const resend = getResend()
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Bitte bestätigen Sie Ihre Unterstützung – Neue Mitte',
      html: buildConfirmHtml(firstName, `${APP_URL}/api/confirm?token=${confirmToken}`),
    })
  } catch (err) {
    console.error('Failed to send confirmation email:', err)
  }

  return NextResponse.json({ success: true, needsConfirmation: true }, { status: 201 })
}

function buildConfirmHtml(firstName: string, confirmUrl: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"/><title>E-Mail bestätigen</title></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:8px;overflow:hidden;">
  <tr>
    <td style="background:#0B3A75;padding:32px 40px;">
      <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:8px;padding:8px 14px;">
        <span style="color:#fff;font-weight:900;font-size:16px;">Neue Mitte</span>
      </div>
      <h1 style="margin:20px 0 0;color:#fff;font-size:24px;font-weight:900;">Bitte bestätigen Sie Ihre E-Mail</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:40px;color:#374151;font-size:15px;line-height:1.7;">
      <p>Hallo ${firstName},</p>
      <p>vielen Dank für Ihre Unterstützung der Neuen Mitte! Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den Button unten klicken.</p>
      <p style="text-align:center;margin:32px 0;">
        <a href="${confirmUrl}" style="display:inline-block;background:#0B3A75;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;">
          Unterstützung bestätigen
        </a>
      </p>
      <p style="font-size:13px;color:#9CA3AF;">Dieser Link ist 48 Stunden gültig. Wenn Sie sich nicht registriert haben, können Sie diese E-Mail ignorieren.</p>
    </td>
  </tr>
  <tr>
    <td style="background:#F5F7FA;padding:24px 40px;border-top:1px solid #E5E7EB;">
      <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
        <a href="https://neue-mitte.org" style="color:#0B3A75;text-decoration:none;">neue-mitte.org</a>
        &nbsp;·&nbsp;
        <a href="https://neue-mitte.org/datenschutz" style="color:#0B3A75;text-decoration:none;">Datenschutz</a>
      </p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`
}
