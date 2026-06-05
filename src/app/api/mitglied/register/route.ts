import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, city, bio, interests } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'E-Mail, Passwort und Name sind Pflichtfelder.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Passwort muss mindestens 8 Zeichen haben.' }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 10)
    const member = await prisma.mitglied.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hash,
        name: name.trim(),
        city: city?.trim() ?? '',
        bio: bio?.trim() ?? '',
        interests: Array.isArray(interests) ? interests.join(',') : (interests ?? ''),
      },
    })

    const sessionToken = randomBytes(32).toString('base64url')
    const response = NextResponse.json({ success: true, name: member.name }, { status: 201 })
    response.cookies.set('nm_member_session', `${member.id}:${sessionToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return response
  } catch (err: unknown) {
    const code = (err as { code?: string }).code
    if (code === 'P2002') {
      return NextResponse.json({ error: 'Diese E-Mail-Adresse ist bereits registriert.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }
}
