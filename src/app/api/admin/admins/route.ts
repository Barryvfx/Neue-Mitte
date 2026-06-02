import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'
import bcryptjs from 'bcryptjs'

export async function GET(_req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })
    return NextResponse.json(admins)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }

    const hashed = await bcryptjs.hash(password, 12)
    const admin = await prisma.admin.create({
      data: { email: email.trim().toLowerCase(), password: hashed },
      select: { id: true, email: true, createdAt: true },
    })
    return NextResponse.json(admin, { status: 201 })
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'P2002') {
      return NextResponse.json({ error: 'E-Mail bereits vergeben' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
