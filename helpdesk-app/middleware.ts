import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory map for rate limiting
const ipMap = new Map<string, { count: number; lastReset: number }>();

export function middleware(request: NextRequest) {
  // 1. FIXED: Get IP from headers (works locally and in production)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(',')[0] : "127.0.0.1";

  const { pathname } = request.nextUrl;

  // 2. Target sensitive routes: Login and Register
  if (pathname.includes("/api/auth/callback/credentials") || pathname === "/register") {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 10; // Allow 10 attempts per minute

    const data = ipMap.get(ip) ?? { count: 0, lastReset: now };

    // Reset window if a minute has passed
    if (now - data.lastReset > windowMs) {
      data.count = 0;
      data.lastReset = now;
    }

    data.count++;
    ipMap.set(ip, data);

    // 3. Block if they exceed the limit
    if (data.count > maxRequests) {
      console.warn(`[SECURITY] Rate limit exceeded for IP: ${ip}`);
      // Redirect to a "Too Many Requests" page or return a status
      return new NextResponse(
        JSON.stringify({ error: "Too many attempts. Please wait 1 minute." }),
        { status: 429, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};