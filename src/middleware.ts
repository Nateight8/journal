import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware running for:", request.nextUrl.pathname);

  const sessionCookie = request.cookies.get("tradz.sid")?.value;
  const pathname = request.nextUrl.pathname;

  // Skip middleware for authentication pages
  if (
    pathname.startsWith("/authenticate") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return NextResponse.next();
  }

  // If no session cookie, redirect to authenticate
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/authenticate", request.url));
  }

  // Redirect authenticated users from root to dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Protect everything except auth and public routes
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|authenticate|login|register).*)",
  ],
};
