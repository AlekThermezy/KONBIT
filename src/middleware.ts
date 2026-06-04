import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Create a response we can modify
  let supabaseResponse = NextResponse.next({
    request: { headers: request.headers },
  })

  // Public routes that don't need auth
  const publicRoutes = [
    '/',
    '/about',
    '/mission',
    '/growth',
    '/deals',
    '/jobs',
    '/learn',
    '/signin',
    '/signup',
    '/waitlist',
    '/contact',
    '/careers',
    '/privacy',
    '/terms',
    '/nature',
    '/dictionary',
    '/translate',
    '/refer',
    '/pool',
    '/resources',
    '/ask-haiti',
    '/admin/ingest',
  ]

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.startsWith('/invite')
  )

  if (isPublicRoute) {
    return supabaseResponse
  }

  // Auth check disabled for now — client-side guards handle redirects
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}