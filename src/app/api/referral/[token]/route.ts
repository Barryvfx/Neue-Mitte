import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  try {
    const link = await prisma.referralLink.findUnique({ where: { token } })
    if (!link) return NextResponse.redirect(new URL('/unterstuetzen', req.url))

    await prisma.referralLink.update({ where: { token }, data: { clicks: { increment: 1 } } })

    const url = new URL('/unterstuetzen', req.url)
    url.searchParams.set('ref', token)
    const res = NextResponse.redirect(url)
    res.cookies.set('nm_ref', token, { maxAge: 60 * 60 * 24 * 30, path: '/', httpOnly: true, sameSite: 'lax' })
    return res
  } catch {
    return NextResponse.redirect(new URL('/unterstuetzen', req.url))
  }
}
