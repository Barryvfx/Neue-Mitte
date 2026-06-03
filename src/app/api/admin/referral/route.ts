import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'
import { randomBytes } from 'crypto'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const links = await prisma.referralLink.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(links)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { label } = await req.json()
    if (!label?.trim()) return NextResponse.json({ error: 'Label fehlt' }, { status: 400 })

    const token = randomBytes(6).toString('base64url')
    const link = await prisma.referralLink.create({ data: { token, label: label.trim() } })
    return NextResponse.json(link, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
