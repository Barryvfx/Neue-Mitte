import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

async function getMitgliedId(): Promise<string | null> {
  const c = await cookies()
  const s = c.get('nm_member_session')?.value
  return s ? s.split(':')[0] : null
}

export async function GET() {
  const id = await getMitgliedId()
  if (!id) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  const items = await prisma.lesezeichen.findMany({
    where: { mitgliedId: id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const id = await getMitgliedId()
  if (!id) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  try {
    const { targetType, targetId, title, url } = await req.json()
    const item = await prisma.lesezeichen.upsert({
      where: { mitgliedId_targetType_targetId: { mitgliedId: id, targetType, targetId } },
      create: { mitgliedId: id, targetType, targetId, title, url },
      update: {},
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Fehler' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = await getMitgliedId()
  if (!id) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  const { targetType, targetId } = await req.json()
  await prisma.lesezeichen.deleteMany({
    where: { mitgliedId: id, targetType, targetId },
  })
  return NextResponse.json({ success: true })
}
