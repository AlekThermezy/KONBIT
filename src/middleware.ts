import { createServerClient, type CookieOptions } from '@supabase/ssr'
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

  // Protected routes — require authentication
  const protectedRoutes = [
    '/dashboard',
    '/inspector',
    '/admin/inspections',
    '/admin/scheduler',
  ]

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    return supabaseResponse
  }

  // Create Supabase client for auth check
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options })
        supabaseResponse = NextResponse.next({ request: { headers: request.headers } })
        supabaseResponse.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options })
        supabaseResponse = NextResponse.next({ request: { headers: request.headers } })
        supabaseResponse.cookies.set({ name, value: '', ...options })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/signin'
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}