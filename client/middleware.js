import { NextResponse } from "next/server";

const PUBLIC = ["/login", "/register", "/_next", "/favicon.ico"];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check cookie token
  const token = req.cookies.get("token")?.value;

  // If no token => go to login
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api).*)"],
};
