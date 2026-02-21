import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


const ipMap = new Map<string, { count: number; lastReset: number }>();

export function middleware(request: NextRequest) {

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(',')[0] : "127.0.0.1";

  const { pathname } = request.nextUrl;

 
  if (pathname.includes("/api/auth/callback/credentials") || pathname === "/register") {
    const now = Date.now();
    const windowMs = 60000; 
    const maxRequests = 10; 

    const data = ipMap.get(ip) ?? { count: 0, lastReset: now };

   
    if (now - data.lastReset > windowMs) {
      data.count = 0;
      data.lastReset = now;
    }

    data.count++;
    ipMap.set(ip, data);

   
    if (data.count > maxRequests) {
      console.warn(`[SECURITY] Rate limit exceeded for IP: ${ip}`);
 
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