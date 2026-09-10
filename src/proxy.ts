import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export default async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  const supabaseResponse = NextResponse.next({
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

  const guestOnlyRoutes = ['/', '/login', '/signup', '/designlogin', '/designsignup'];
  const customerOnlyRoutes = ['/account', '/booking', '/settings'];
  const businessOnlyRoutes = ['/dashboard', '/onboarding'];
  const adminOnlyRoutes = ['/admin'];
  const customerOrGuestRoutes = ['/search', '/ticket'];

  if (!mergedUser) {
    if (
      customerOnlyRoutes.some(route => pathname.startsWith(route)) ||
      businessOnlyRoutes.some(route => pathname.startsWith(route))
    ) {
      redirectUrl = new URL('/login', request.url);
      const targetPath = request.nextUrl.pathname + request.nextUrl.search;
      redirectUrl.searchParams.set('redirect', targetPath);
    }
  } else {
    if (pathname.startsWith('/api/') || pathname.startsWith('/locales/') || pathname.startsWith('/admin')) {
      // Allow API, locales, and admin routes to pass through immediately, saving DB query
      return supabaseResponse;
    }

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

    const userRole = (rawRole === 'business' || rawRole === 'business_pending' || rawRole === 'customer' || rawRole === 'admin' || rawRole === 'staff') ? rawRole : 'customer';
    onboardingStep = onboardingStep || 0;
    const isUnonboardedBusiness = userRole === 'business' && onboardingStep < 5;

    let homeRoute = '/account'; // default for customer
    if (userRole === 'business') homeRoute = '/dashboard';
    else if (userRole === 'business_pending') homeRoute = '/waiting';
    else if (userRole === 'admin' || userRole === 'staff') homeRoute = '/dashboard'; // Admins usually use dashboard or admin panel

    if (isUnonboardedBusiness) {
      homeRoute = '/onboarding';
    }

    if (guestOnlyRoutes.includes(pathname)) {
      const redirectParam = request.nextUrl.searchParams.get('redirect');
      const target = (redirectParam && redirectParam.startsWith('/')) ? redirectParam : homeRoute;
      redirectUrl = new URL(target, request.url);
    } else if (userRole === 'business_pending' && pathname !== '/waiting') {
      redirectUrl = new URL(homeRoute, request.url);
    } else if (isUnonboardedBusiness && !pathname.startsWith('/onboarding')) {
      redirectUrl = new URL('/onboarding', request.url);
    } else if (userRole === 'customer' && businessOnlyRoutes.some(route => pathname.startsWith(route))) {
      redirectUrl = new URL(homeRoute, request.url);
    } else if ((userRole === 'business' || userRole === 'admin' || userRole === 'staff') && (
      customerOnlyRoutes.some(route => pathname.startsWith(route)) ||
      customerOrGuestRoutes.some(route => pathname.startsWith(route))
    )) {
      // Note: we let admins bypass if we wanted, but standard behavior keeps them on business/admin routes
      // If we want admins to access customer routes, we can remove 'admin'/'staff' from this condition.
      // But for now, keep them out of customer routes like standard business.
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)',
  ],
}
