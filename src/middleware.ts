import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export default async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh the session if needed and set cookies in supabaseResponse
  const { data: { session } } = await supabase.auth.getSession()
  const { data: { user } } = await supabase.auth.getUser()

  let mergedUser = user;
  if (user && session?.user) {
    mergedUser = {
      ...user,
      app_metadata: {
        ...user.app_metadata,
        ...session.user.app_metadata,
      }
    };
  }

  const pathname = request.nextUrl.pathname;
  let redirectUrl: URL | null = null;

  const guestOnlyRoutes = ['/', '/login', '/signup'];
  const customerOnlyRoutes = ['/account', '/booking', '/settings'];
  const businessOnlyRoutes = ['/admin', '/onboarding'];
  const customerOrGuestRoutes = ['/search', '/ticket'];

  if (!mergedUser) {
    if (
      customerOnlyRoutes.some(route => pathname.startsWith(route)) ||
      businessOnlyRoutes.some(route => pathname.startsWith(route))
    ) {
      redirectUrl = new URL('/login', request.url);
    }
  } else {
    let rawRole = mergedUser.app_metadata?.role as string;
    let onboardingStep = (mergedUser.app_metadata?.onboarding_step as number);

    // ROBUST FALLBACK: If the JWT hook failed to attach custom claims, query the database directly.
    if (!rawRole) {
      const { data: profile } = await supabase.from('profiles').select('role, onboarding_step').eq('id', mergedUser.id).single();
      if (profile) {
        rawRole = profile.role;
        onboardingStep = profile.onboarding_step;
      } else {
        rawRole = mergedUser.user_metadata?.role as string;
      }
    }

    const userRole = (rawRole === 'business' || rawRole === 'customer') ? rawRole : 'customer';
    onboardingStep = onboardingStep || 0;
    const isUnonboardedBusiness = userRole === 'business' && onboardingStep < 3;

    let homeRoute = userRole === 'business' ? '/admin' : '/search';
    if (isUnonboardedBusiness) {
      homeRoute = '/onboarding';
    }

    if (guestOnlyRoutes.includes(pathname)) {
      redirectUrl = new URL(homeRoute, request.url);
    } else if (isUnonboardedBusiness && !pathname.startsWith('/onboarding')) {
      redirectUrl = new URL('/onboarding', request.url);
    } else if (userRole === 'customer' && businessOnlyRoutes.some(route => pathname.startsWith(route))) {
      redirectUrl = new URL(homeRoute, request.url);
    } else if (userRole === 'business' && (
      customerOnlyRoutes.some(route => pathname.startsWith(route)) ||
      customerOrGuestRoutes.some(route => pathname.startsWith(route))
    )) {
      redirectUrl = new URL(homeRoute, request.url);
    }
  }

  if (redirectUrl) {
    const redirectResponse = NextResponse.redirect(redirectUrl);
    // Copy cookies to redirect response to persist the refreshed session
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
