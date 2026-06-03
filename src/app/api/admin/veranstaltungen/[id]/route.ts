import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const { id } = await params

  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) {
    return NextResponse.json({ error: 'Veranstaltung nicht gefunden.' }, { status: 404 })
  }

  return NextResponse.json(event)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { title, description, location, date, active } = body

  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(location !== undefined && { location }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(active !== undefined && { active }),
      },
    })
    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ error: 'Veranstaltung nicht gefunden.' }, { status: 404 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.event.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Veranstaltung nicht gefunden.' }, { status: 404 })
  }
}
