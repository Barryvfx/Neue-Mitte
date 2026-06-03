import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const releases = await prisma.pressRelease.findMany({ orderBy: { date: 'desc' } })
    return NextResponse.json(releases)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { title, excerpt, fileUrl, published, date } = body
    if (!title || !excerpt) return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })

    const release = await prisma.pressRelease.create({
      data: {
        title: title.trim(),
        excerpt: excerpt.trim(),
        fileUrl: fileUrl?.trim() || null,
        published: Boolean(published),
        date: date ? new Date(date) : new Date(),
      },
    })
    return NextResponse.json(release, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
