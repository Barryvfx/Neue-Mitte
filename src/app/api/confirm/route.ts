import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'

const FROM = process.env.NEWSLETTER_FROM ?? 'Neue Mitte <newsletter@neue-mitte.org>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://neue-mitte.org'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
}

function makeMemberId(id: string) {
  return 'NM-' + id.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6)
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

    // Send welcome email with member card
    const resend = getResend()
    try {
      await resend.emails.send({
        from: FROM,
        to: supporter.email,
        subject: 'Willkommen bei der Neuen Mitte – Ihr Unterstützer-Ausweis',
        html: buildWelcomeHtml(supporter.firstName, supporter.lastName, supporter.city ?? undefined, supporter.id),
      })
    } catch { /* non-critical */ }

    return NextResponse.redirect(new URL('/unterstuetzen?confirmed=1', req.url))
  } catch {
    return NextResponse.redirect(new URL('/?confirm=error', req.url))
  }
}

function buildWelcomeHtml(firstName: string, lastName: string, city: string | undefined, id: string) {
  const memberId = makeMemberId(id)
  const fullName = `${firstName} ${lastName}`
  const cityLine = city ? city : 'Deutschland'
  const joinYear = new Date().getFullYear()

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Willkommen bei der Neuen Mitte</title>
</head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,#0E4795 0%,#0B3A75 60%,#082D5A 100%);padding:36px 40px 28px;">
      <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:8px;padding:6px 14px;margin-bottom:16px;">
        <span style="color:#fff;font-weight:900;font-size:14px;letter-spacing:0.12em;text-transform:uppercase;">Neue Mitte</span>
      </div>
      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:900;letter-spacing:-0.5px;line-height:1.25;">
        Willkommen, ${firstName}!
      </h1>
      <p style="margin:10px 0 0;color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;">
        Ihre Unterstützung ist bestätigt. Deutschland kann mehr.
      </p>
    </td>
  </tr>

  <!-- Body text -->
  <tr>
    <td style="padding:32px 40px 24px;color:#374151;font-size:15px;line-height:1.75;">
      <p style="margin:0 0 16px;">Herzlich willkommen bei der <strong style="color:#0B3A75;">Neuen Mitte</strong>.</p>
      <p style="margin:0 0 16px;">Gemeinsam zeigen wir: Es gibt eine pragmatische, lösungsorientierte Mitte in Deutschland – eine Mitte, die handelt statt redet.</p>
      <p style="margin:0;">Anbei finden Sie Ihren persönlichen Unterstützer-Ausweis.</p>
    </td>
  </tr>

  <!-- Member Card -->
  <tr>
    <td style="padding:0 40px 32px;">
      <!--[if mso]><table width="520" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;border-radius:14px;overflow:hidden;background:linear-gradient(135deg,#0E4795 0%,#0B3A75 55%,#030D1F 100%);box-shadow:0 8px 32px rgba(11,58,117,0.35);">
        <!-- Top stripe: German flag colors -->
        <tr>
          <td height="4" style="background:#1A1A1A;font-size:0;line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td height="4" style="background:#CC0000;font-size:0;line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td height="4" style="background:#F0B823;font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- Card content -->
        <tr>
          <td style="padding:24px 28px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <!-- Left: org name + type -->
                <td style="vertical-align:top;">
                  <p style="margin:0 0 2px;color:rgba(255,255,255,0.55);font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">Neue Mitte · Deutschland</p>
                  <p style="margin:0;color:#ffffff;font-size:14px;font-weight:900;letter-spacing:0.04em;text-transform:uppercase;">Unterstützer-Ausweis</p>
                </td>
                <!-- Right: NM emblem circle -->
                <td style="vertical-align:top;text-align:right;">
                  <div style="display:inline-block;width:42px;height:42px;border-radius:50%;border:2px solid rgba(240,184,35,0.6);background:rgba(255,255,255,0.06);text-align:center;line-height:38px;">
                    <span style="color:#F0B823;font-weight:900;font-size:13px;letter-spacing:-0.5px;">NM</span>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Divider line (gold gradient) -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 18px;">
              <tr>
                <td height="1" style="background:linear-gradient(to right,rgba(240,184,35,0.7),rgba(240,184,35,0.15),transparent);font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>

            <!-- Name + city -->
            <p style="margin:0 0 4px;color:rgba(255,255,255,0.55);font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Vollständiger Name</p>
            <p style="margin:0 0 16px;color:#ffffff;font-size:20px;font-weight:900;letter-spacing:-0.3px;">${fullName}</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:bottom;">
                  <p style="margin:0 0 2px;color:rgba(255,255,255,0.55);font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Wohnort</p>
                  <p style="margin:0;color:rgba(255,255,255,0.85);font-size:13px;font-weight:600;">${cityLine}</p>
                </td>
                <td style="vertical-align:bottom;text-align:right;">
                  <p style="margin:0 0 2px;color:rgba(255,255,255,0.55);font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Seit</p>
                  <p style="margin:0;color:rgba(255,255,255,0.85);font-size:13px;font-weight:600;">${joinYear}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Gold bottom bar with ID -->
        <tr>
          <td style="background:linear-gradient(to right,#C8960C,#F0B823,#C8960C);padding:10px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;color:#0B3A75;font-size:11px;font-weight:900;letter-spacing:0.15em;font-family:monospace;">${memberId}</p>
                </td>
                <td style="text-align:right;">
                  <p style="margin:0;color:rgba(11,58,117,0.6);font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">neue-mitte.org</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td>
  </tr>

  <!-- Download CTA -->
  <tr>
    <td style="padding:0 40px 32px;text-align:center;">
      <p style="margin:0 0 16px;color:#6B7280;font-size:13px;">
        Laden Sie Ihren Ausweis auch als digitale Karte herunter:
      </p>
      <a href="${APP_URL}/unterstuetzen?confirmed=1"
         style="display:inline-block;background:#0B3A75;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;letter-spacing:0.02em;">
        Karte herunterladen →
      </a>
    </td>
  </tr>

  <!-- What's next -->
  <tr>
    <td style="padding:24px 40px;background:#F8FAFC;border-top:1px solid #E5E7EB;">
      <p style="margin:0 0 12px;color:#0B3A75;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Nächste Schritte</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${[
          ['Programm lesen', '/programm', 'Erfahren Sie, wofür die Neue Mitte steht.'],
          ['Veranstaltungen', '/veranstaltungen', 'Treffen Sie Gleichgesinnte in Ihrer Nähe.'],
          ['Petition unterzeichnen', '/petition', 'Stärken Sie unsere Stimme weiter.'],
        ].map(([label, href, desc]) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;">
            <a href="${APP_URL}${href}" style="color:#0B3A75;text-decoration:none;font-weight:700;font-size:14px;">${label}</a>
            <span style="color:#9CA3AF;font-size:13px;"> — ${desc}</span>
          </td>
        </tr>`).join('')}
      </table>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding:20px 40px;border-top:1px solid #E5E7EB;">
      <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;line-height:1.6;">
        Sie erhalten diese E-Mail, weil Sie die Neue Mitte unterstützen.<br/>
        <a href="${APP_URL}" style="color:#0B3A75;text-decoration:none;">neue-mitte.org</a>
        &nbsp;·&nbsp;
        <a href="${APP_URL}/datenschutz" style="color:#0B3A75;text-decoration:none;">Datenschutz</a>
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
