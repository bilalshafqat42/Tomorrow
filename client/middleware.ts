import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  // ❌ Not logged in → redirect to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Logged in → block login/register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!_next|favicon.ico|assets).*)"],
};
