import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'
import bcryptjs from 'bcryptjs'

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }

    const admin = await prisma.admin.findUnique({ where: { email: session.email } })
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const valid = await bcryptjs.compare(currentPassword, admin.password)
    if (!valid) return NextResponse.json({ error: 'Aktuelles Passwort falsch' }, { status: 401 })

    const hashed = await bcryptjs.hash(newPassword, 12)
    await prisma.admin.update({ where: { id: admin.id }, data: { password: hashed } })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
