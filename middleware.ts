import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * MIDDLEWARE - Session Refresh & Route Protection
 *
 * Why this exists:
 * 1. Refresh expired sessions automatically (Supabase tokens expire after 1 hour)
 * 2. Protect routes that require authentication
 * 3. Redirect unauthenticated users to login
 * 4. Redirect authenticated users away from auth pages
 *
 * Flow:
 * 1. Every request passes through this middleware
 * 2. Supabase client reads session from cookies
 * 3. If session is expired, it refreshes automatically
 * 4. Updated session is written back to cookies
 * 5. Route protection logic runs
 *
 * Protected Routes:
 * - /dashboard, /profile, /projects, /ai, /media, /settings, /design
 * - If not authenticated → redirect to /login
 *
 * Auth Routes:
 * - /login, /signup, /onboarding
 * - If authenticated → redirect to /dashboard
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // CRITICAL: This refreshes the session if expired
  // Without this, users would be logged out after 1 hour
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected routes - require authentication
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/projects",
    "/ai",
    "/media",
    "/settings",
    "/design",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Auth routes - should redirect if already authenticated
  const authRoutes = ["/login", "/signup", "/onboarding"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If trying to access protected route without auth → redirect to login
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If trying to access auth route while authenticated → redirect to dashboard
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
