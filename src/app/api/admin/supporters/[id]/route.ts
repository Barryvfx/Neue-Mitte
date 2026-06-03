import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PATCH: update supporter (city, notes)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { city, notes } = body

  try {
    const supporter = await prisma.supporter.update({
      where: { id },
      data: {
        ...(city !== undefined && { city }),
        ...(notes !== undefined && { notes }),
      },
    })
    return NextResponse.json(supporter)
  } catch {
    return NextResponse.json({ error: 'Unterstützer nicht gefunden.' }, { status: 404 })
  }
}

// DELETE: delete supporter
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
    await prisma.supporter.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unterstützer nicht gefunden.' }, { status: 404 })
  }
}
