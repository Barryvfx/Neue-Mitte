import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { randomUUID } from 'crypto'

const COOKIE = 'nm_st'
const TTL_MS = 1000 * 60 * 60 * 72 // 72 hours

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const existing = cookieStore.get(COOKIE)?.value

  if (existing) {
    try {
      const tokenRecord = await prisma.supporterToken.findUnique({ where: { token: existing } })
      if (tokenRecord && tokenRecord.expiresAt > new Date()) {
        return NextResponse.json({ token: existing, used: tokenRecord.used })
      }
    } catch { /* fall through to create new */ }
  }

  // Create new token
  const token = randomUUID()
  const expiresAt = new Date(Date.now() + TTL_MS)

  try {
    await prisma.supporterToken.create({ data: { token, expiresAt } })
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }

  const res = NextResponse.json({ token, used: false })
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: TTL_MS / 1000,
  })
  return res
}
