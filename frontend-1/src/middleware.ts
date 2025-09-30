// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value  // 👈 use the actual cookie name
  console.log('Token middleware:', token)
  const protectedPaths = ["/dashboard", "/profile", "/account", "/settings", "/appointments", "/favorite"]
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/account/:path*", "/settings/:path*", "/appointments/:path*", "/favorite/:path*"],
}


