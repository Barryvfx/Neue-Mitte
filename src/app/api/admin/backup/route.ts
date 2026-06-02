import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(_req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbPath = join(process.cwd(), 'prisma', 'db.sqlite')

  try {
    const file = readFileSync(dbPath)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="backup-${timestamp}.sqlite"`,
        'Content-Length': String(file.length),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Database file not found' }, { status: 404 })
  }
}
