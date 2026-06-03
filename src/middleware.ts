import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-change-in-production'
)

const ADMIN_DOMAIN = 'admin.neue-mitte.org'

const PROTECTED = [
  '/admin/dashboard', '/admin/supporters', '/admin/news', '/admin/kontakt',
  '/admin/settings', '/admin/admins', '/admin/content', '/admin/faq',
  '/admin/veranstaltungen', '/admin/login-log', '/admin/newsletter',
]

// Resolve the effective internal path for a request.
// On the admin subdomain every path is implicitly under /admin.
function resolveAdminPath(pathname: string, isAdminSubdomain: boolean): string {
  if (!isAdminSubdomain) return pathname
  if (pathname === '/') return '/admin'
  // Already prefixed (e.g. /admin/dashboard after a login redirect) – leave as-is
  if (pathname.startsWith('/admin')) return pathname
  // API calls are never prefixed
  if (pathname.startsWith('/api')) return pathname
  return `/admin${pathname}`
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''
  const isAdminSubdomain = host === ADMIN_DOMAIN || host.startsWith(`${ADMIN_DOMAIN}:`)

  // ------------------------------------------------------------------
  // 1. Resolve effective path (subdomain mapping)
  // ------------------------------------------------------------------
  const effectivePath = resolveAdminPath(pathname, isAdminSubdomain)

  // ------------------------------------------------------------------
  // 2. Auth gate for protected admin routes
  // ------------------------------------------------------------------
  const needsAuth = PROTECTED.some((p) => effectivePath.startsWith(p))

  if (needsAuth) {
    const token = request.cookies.get('nm_admin_token')?.value

    // Build login URL preserving the protocol from the original request
    // (Cloudflare tunnel may forward as http internally)
    const loginUrl = isAdminSubdomain
      ? new URL(`${request.nextUrl.protocol}//${ADMIN_DOMAIN}/`)
      : new URL('/admin', request.url)

    if (!token) {
      return NextResponse.redirect(loginUrl)
    }

    try {
      await jwtVerify(token, SECRET)
    } catch {
      const res = NextResponse.redirect(loginUrl)
      res.cookies.delete('nm_admin_token')
      return res
    }
  }

  // ------------------------------------------------------------------
  // 3. Rewrite subdomain path to internal /admin/* path
  // ------------------------------------------------------------------
  if (isAdminSubdomain && effectivePath !== pathname) {
    const url = request.nextUrl.clone()
    url.pathname = effectivePath
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  // Run on all paths except static files and images so the subdomain
  // catch-all works, while keeping the middleware fast for assets.
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)'],
}
