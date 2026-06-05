import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'E-Mail und Passwort erforderlich.' }, { status: 400 })
    }

    const member = await prisma.mitglied.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!member || !(await bcrypt.compare(password, member.password))) {
      return NextResponse.json({ error: 'E-Mail oder Passwort falsch.' }, { status: 401 })
    }

    const sessionToken = randomBytes(32).toString('base64url')
    const response = NextResponse.json({ success: true, name: member.name })
    response.cookies.set('nm_member_session', `${member.id}:${sessionToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }
}
