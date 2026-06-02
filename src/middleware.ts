import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-change-in-production'
)

const PROTECTED = ['/admin/dashboard', '/admin/supporters', '/admin/news']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p))
  if (!needsAuth) return NextResponse.next()

  const token = request.cookies.get('nm_admin_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  try {
    await jwtVerify(token, SECRET)
    return NextResponse.next()
  } catch {
    const response = NextResponse.redirect(new URL('/admin', request.url))
    response.cookies.delete('nm_admin_token')
    return response
  }
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/admin/supporters/:path*', '/admin/news/:path*'],
}
