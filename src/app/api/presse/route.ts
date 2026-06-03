import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const releases = await prisma.pressRelease.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(releases)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
