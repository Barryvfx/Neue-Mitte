import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'

const FROM = process.env.NEWSLETTER_FROM ?? 'Neue Mitte <newsletter@neue-mitte.org>'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/?confirm=invalid', req.url))
  }

  try {
    const supporter = await prisma.supporter.findFirst({
      where: { confirmToken: token, confirmed: false },
    })

    if (!supporter) {
      return NextResponse.redirect(new URL('/?confirm=invalid', req.url))
    }

    await prisma.supporter.update({
      where: { id: supporter.id },
      data: { confirmed: true, confirmToken: null },
    })

    // Track referral conversion
    if (supporter.referralToken) {
      try {
        await prisma.referralLink.update({
          where: { token: supporter.referralToken },
          data: { conversions: { increment: 1 } },
        })
      } catch { /* non-critical */ }
    }

    // Send welcome email
    const resend = getResend()
    try {
      await resend.emails.send({
        from: FROM,
        to: supporter.email,
        subject: 'Willkommen bei der Neuen Mitte!',
        html: buildWelcomeHtml(supporter.firstName),
      })
    } catch { /* non-critical */ }

    return NextResponse.redirect(new URL('/unterstuetzen?confirmed=1', req.url))
  } catch {
    return NextResponse.redirect(new URL('/?confirm=error', req.url))
  }
}

function buildWelcomeHtml(firstName: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"/><title>Willkommen bei der Neuen Mitte</title></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:8px;overflow:hidden;">
  <tr>
    <td style="background:#0B3A75;padding:32px 40px;">
      <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:8px;padding:8px 14px;">
        <span style="color:#fff;font-weight:900;font-size:16px;">Neue Mitte</span>
      </div>
      <h1 style="margin:20px 0 0;color:#fff;font-size:24px;font-weight:900;">Willkommen, ${firstName}!</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:40px;color:#374151;font-size:15px;line-height:1.7;">
      <p>Herzlich willkommen bei der <strong>Neuen Mitte</strong>. Ihre Unterstützung ist jetzt bestätigt.</p>
      <p>Gemeinsam zeigen wir: Es gibt eine pragmatische, lösungsorientierte Mitte in Deutschland.</p>
      <p>Folgen Sie uns auf <a href="https://neue-mitte.org" style="color:#0B3A75;">neue-mitte.org</a> für aktuelle Nachrichten und Veranstaltungen.</p>
      <p style="margin-top:32px;">Mit freundlichen Grüßen,<br/><strong>Das Team der Neuen Mitte</strong></p>
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
