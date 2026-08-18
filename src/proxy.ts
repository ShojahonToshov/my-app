import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname;

  // Skip role checks for API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return supabaseResponse;
  }

  const redirectWithCookies = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    const res = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      res.cookies.set(cookie.name, cookie.value);
    });
    return res;
  }

  // Define route requirements
  const guestOnlyRoutes = ['/', '/login', '/signup'];
  const customerOnlyRoutes = ['/account', '/booking', '/settings'];
  const businessOnlyRoutes = ['/admin', '/onboarding'];
  const customerOrGuestRoutes = ['/search', '/ticket'];

  if (!user) {
    if (
      customerOnlyRoutes.some(route => pathname.startsWith(route)) ||
      businessOnlyRoutes.some(route => pathname.startsWith(route))
    ) {
      return redirectWithCookies('/login');
    }
    return supabaseResponse;
  }

  // Fetch profile to check role and onboarding step
  const { data: profile } = await supabase.from('profiles').select('role, onboarding_step').eq('id', user.id).single();
  
  const rawRole = profile?.role as string;
  const userRole = (rawRole === 'business' || rawRole === 'customer') ? rawRole : 'customer';
  const onboardingStep = (profile?.onboarding_step as number) || 0;
  const isUnonboardedBusiness = userRole === 'business' && onboardingStep < 3;

  let homeRoute = userRole === 'business' ? '/admin' : '/search';
  if (isUnonboardedBusiness) {
    homeRoute = '/onboarding';
  }

  // Force redirect unonboarded business to onboarding
  if (isUnonboardedBusiness && !pathname.startsWith('/onboarding')) {
    return redirectWithCookies('/onboarding');
  }

  // If user is authenticated but trying to access guest-only pages
  if (guestOnlyRoutes.includes(pathname)) {
    return redirectWithCookies(homeRoute);
  }

  // Customer cannot access business routes
  if (userRole === 'customer') {
    if (businessOnlyRoutes.some(route => pathname.startsWith(route))) {
      return redirectWithCookies(homeRoute);
    }
  }

  // Business cannot access customer routes OR customer/guest routes (e.g. /search)
  if (userRole === 'business') {
    if (
      customerOnlyRoutes.some(route => pathname.startsWith(route)) ||
      customerOrGuestRoutes.some(route => pathname.startsWith(route))
    ) {
      return redirectWithCookies(homeRoute);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
