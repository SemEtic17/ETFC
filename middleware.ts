import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protects the admin area. The (admin) route group maps to /dashboard.
 * Unauthenticated visitors are redirected to /login.
 *
 * TODO: Replace the cookie presence check with real session/JWT validation
 * once an auth provider (e.g. Auth.js) is wired in.
 */
const SESSION_COOKIE = "etfc_session";

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
