import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'

const FROM = process.env.NEWSLETTER_FROM ?? 'Neue Mitte <newsletter@neue-mitte.org>'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })

  let body: { subject?: string; html?: string; preview?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 }) }

  const { subject, html, preview } = body
  if (!subject?.trim()) return NextResponse.json({ error: 'Betreff fehlt.' }, { status: 422 })
  if (!html?.trim()) return NextResponse.json({ error: 'Inhalt fehlt.' }, { status: 422 })

  const subscribers = await prisma.newsletterSubscriber.findMany({ select: { email: true } })
  if (subscribers.length === 0) {
    return NextResponse.json({ error: 'Keine Abonnenten vorhanden.' }, { status: 400 })
  }

  const htmlBody = buildHtml(subject.trim(), html.trim(), preview?.trim())
  const subjectTrimmed = subject.trim()

  let sent = 0
  let failed = 0
  let lastError = ''

  const resend = getResend()
  for (const subscriber of subscribers) {
    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: subscriber.email,
        subject: subjectTrimmed,
        html: htmlBody,
      })
      if (error) {
        lastError = error.message
        failed++
      } else {
        sent++
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : 'Unbekannter Fehler'
      failed++
    }
  }

  if (sent > 0) {
    try {
      await prisma.newsletterSent.create({
        data: { subject: subjectTrimmed, previewText: preview?.trim() || null, html: htmlBody, recipientCount: sent },
      })
    } catch { /* non-critical */ }
  }

  return NextResponse.json({
    sent,
    failed,
    total: subscribers.length,
    ...(lastError ? { errorDetail: lastError } : {}),
  })
}

function buildHtml(subject: string, body: string, preview?: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:system-ui,-apple-system,sans-serif;">
${preview ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preview}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ''}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:8px;overflow:hidden;">
  <!-- Header -->
  <tr>
    <td style="background:#0B3A75;padding:32px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:8px;padding:8px 14px;">
              <span style="color:#fff;font-weight:900;font-size:16px;letter-spacing:-0.5px;">Neue Mitte</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding-top:20px;">
            <h1 style="margin:0;color:#fff;font-size:24px;font-weight:900;letter-spacing:-0.5px;line-height:1.3;">${subject}</h1>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- Body -->
  <tr>
    <td style="padding:40px;color:#374151;font-size:15px;line-height:1.7;">
      ${body}
    </td>
  </tr>
  <!-- Footer -->
  <tr>
    <td style="background:#F5F7FA;padding:24px 40px;border-top:1px solid #E5E7EB;">
      <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
        Sie erhalten diese E-Mail, weil Sie sich auf neue-mitte.org für den Newsletter angemeldet haben.<br/>
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
