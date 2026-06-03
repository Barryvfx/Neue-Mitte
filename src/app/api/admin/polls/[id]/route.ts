import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  const { id } = await params
  let body: { active?: boolean }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 }) }
  const poll = await prisma.poll.update({ where: { id }, data: { active: body.active } })
  return NextResponse.json(poll)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  const { id } = await params
  await prisma.poll.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
