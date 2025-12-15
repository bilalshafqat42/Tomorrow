import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/_next", "/favicon.ico"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow public routes
  if (PUBLIC_ROUTES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // check auth by calling backend /me with cookies
  const apiBase = process.env.NEXT_PUBLIC_API_BASE;
  if (!apiBase) return NextResponse.redirect(new URL("/login", req.url));

  const cookie = req.headers.get("cookie") || "";

  try {
    const res = await fetch(`${apiBase}/api/auth/me`, {
      headers: { cookie },
      // must include to forward cookie
      credentials: "include" as any,
      cache: "no-store",
    });

    if (res.ok) return NextResponse.next();
  } catch (e) {}

  // not logged in
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!api).*)"],
};
