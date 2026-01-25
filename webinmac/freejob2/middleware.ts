import { NextResponse, type NextRequest } from 'next/server'

/**
 * Mock Middleware - Allows all admin routes for development
 * In production, uncomment the Supabase authentication logic below
 */
export async function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // MOCK MODE: Allow all admin routes (for development)
  // Remove this in production and uncomment the Supabase logic below
  return NextResponse.next()

  /* PRODUCTION CODE - Uncomment when ready to use Supabase
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Not authenticated, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  // Check if user is admin
  if (!profile || profile.role !== 'admin') {
    // Not admin, redirect to home
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
  */
}

export const config = {
  matcher: '/admin/:path*',
}
