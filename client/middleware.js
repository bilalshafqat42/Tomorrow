// client/middleware.js
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/_next", "/favicon.ico"];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // allow public routes
  const isPublic = PUBLIC_ROUTES.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  // check cookie token
  const token = req.cookies.get("token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api).*)"], // run on all pages except /api
};
