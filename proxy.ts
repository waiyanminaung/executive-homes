import { NextRequest, NextResponse } from "next/server";

const PUBLIC_AUTH_PATHS = ["/admin/login", "/admin/register"];
const SUPERADMIN_PATHS = ["/admin/users"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPath = PUBLIC_AUTH_PATHS.some((p) => pathname.startsWith(p));

  const sessionRes = await fetch(
    new URL("/api/auth/get-session", request.nextUrl.origin),
    { headers: { cookie: request.headers.get("cookie") ?? "" } }
  );

  const session = sessionRes.ok ? await sessionRes.json() : null;

  if (isAuthPath && session?.user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!isAuthPath && !session?.user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const isSuperAdminPath = SUPERADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (isSuperAdminPath && session?.user?.role !== "SUPERADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
