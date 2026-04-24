import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  APP_SESSION_COOKIE,
  parseSessionToken,
  type RolSesion,
} from "@/lib/auth/app-session";

function loginRedirect(request: NextRequest, redirectPath: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("redirect", redirectPath);
  return NextResponse.redirect(url);
}

function requireRole(
  request: NextRequest,
  role: RolSesion,
  actual: RolSesion | null
): NextResponse | null {
  if (actual === role) return null;
  return loginRedirect(request, request.nextUrl.pathname + request.nextUrl.search);
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get(APP_SESSION_COOKIE)?.value;
  const session = await parseSessionToken(token);
  const role = session?.role ?? null;

  if (path.startsWith("/informe")) {
    const denied = requireRole(request, "profesional", role);
    if (denied) return denied;
    return NextResponse.next();
  }

  if (path.startsWith("/encuesta")) {
    const denied = requireRole(request, "formulario", role);
    if (denied) return denied;
    return NextResponse.next();
  }

  if (path.startsWith("/formulario")) {
    const denied = requireRole(request, "formulario", role);
    if (denied) return denied;
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/informe",
    "/informe/:path*",
    "/encuesta",
    "/encuesta/:path*",
    "/formulario",
    "/formulario/:path*",
  ],
};
