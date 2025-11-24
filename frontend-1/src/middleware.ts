// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Utility to decode JWT (without signature verification for simplicity; add verification in production)
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1]; // Payload is the second part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
    console.log('Decoded JWT payload:', payload);
    return payload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  console.log('Token middleware:', token);

  const protectedPaths = ["/dashboard", "/profile", "/account", "/settings", "/appointments", "/favorite", "/settings/doctor-settings"];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  // Redirect to login if no token for protected paths
  if (isProtected && !token) {
    console.log('No token, redirecting to /login');
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Check for doctor-specific page access
  if (req.nextUrl.pathname.startsWith('/settings/doctor-settings') || req.nextUrl.pathname.startsWith('/settings/appointment-system') ) {
    if (!token) {
      console.log('No token for /settings/doctor-settings, redirecting to /login');
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload = decodeJWT(token);
    if (!payload || payload.is_doctor === false) {
      console.log('Access denied to /settings/doctor-settings: User is not a doctor or invalid payload', { payload });
      return NextResponse.redirect(new URL("/", req.url)); // Redirect to index
    }
    console.log('Access granted to /settings/doctor-settings for doctor', { payload });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/account/:path*", "/settings/:path*", "/appointments/:path*", "/favorite/:path*", "/settings/doctor-settings/:path*"],
};