import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Utilidad para decodificar el payload del JWT.
 * Maneja internamente errores de formato para evitar 'Cannot find name'.
 */
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // En el middleware de Next.js (Edge Runtime), usamos atob en lugar de Buffer
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Verifica si el token ha expirado comparando el campo 'exp' con la hora actual.
 */
function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const { pathname } = req.nextUrl;

  const protectedPaths = [
    "/dashboard", 
    "/profile", 
    "/account", 
    "/settings", 
    "/appointments", 
    "/favorite"
  ];
  
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // --- LÓGICA DE RENOVACIÓN AUTOMÁTICA (SILENT REFRESH) ---
  if (isProtected && (!accessToken || isTokenExpired(accessToken)) && refreshToken) {
    try {
      // Llamamos al endpoint de SimpleJWT en tu Django
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const response = NextResponse.next();
        // Seteamos el nuevo access_token en las cookies para que el navegador lo guarde
        response.cookies.set("access_token", data.access, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
        return response;
      }
    } catch (err) {
      console.error("Error crítico intentando refrescar sesión:", err);
    }
  }

  // --- VALIDACIÓN DE ACCESO ---
  
  // 1. Si no hay token y es ruta protegida -> Login
  if (isProtected && (!accessToken || isTokenExpired(accessToken))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. Validación específica para Doctores
  if (pathname.startsWith('/settings/doctor-settings') || pathname.startsWith('/settings/appointment-system')) {
    const tokenToVerify = accessToken; // Aquí podrías usar el nuevo si acabas de refrescar
    if (!tokenToVerify) return NextResponse.redirect(new URL("/login", req.url));

    const payload = decodeJWT(tokenToVerify);
    if (!payload || payload.is_doctor === false) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/profile/:path*", 
    "/account/:path*", 
    "/settings/:path*", 
    "/appointments/:path*", 
    "/favorite/:path*"
  ],
};