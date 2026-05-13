import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "session";
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || "fallback-secret-32-chars-minimum!");

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /w/* routes
  if (pathname.startsWith("/w")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const next = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/?signin=&next=${next}`, req.url));
    }
    try {
      await jwtVerify(token, secret());
    } catch {
      const next = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/?signin=&next=${next}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/w/:path*"],
};
