import { NextResponse } from "next/server";
import {
  APP_SESSION_COOKIE,
  createSessionToken,
  credencialesFormularioOk,
  credencialesProfesionalOk,
  getAuthSecret,
  getFormularioPassword,
  getFormularioUser,
  getProfesionalPassword,
  getProfesionalUser,
  SESSION_MAX_AGE_SEC,
  type RolSesion,
} from "@/lib/auth/app-session";

export async function POST(req: Request) {
  if (!getAuthSecret()) {
    return NextResponse.json(
      { ok: false, error: "Falta AUTH_SESSION_SECRET (o INFORME_AUTH_SECRET) de al menos 32 caracteres." },
      { status: 503 }
    );
  }

  let body: { user?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  const u = String(body.user ?? "").trim();
  const p = String(body.password ?? "");

  let role: RolSesion | null = null;
  if (credencialesProfesionalOk() && u === getProfesionalUser() && p === getProfesionalPassword()) {
    role = "profesional";
  } else if (credencialesFormularioOk() && u === getFormularioUser() && p === getFormularioPassword()) {
    role = "formulario";
  }

  if (!role) {
    return NextResponse.json({ ok: false, error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }

  const token = await createSessionToken(role);
  if (!token) {
    return NextResponse.json({ ok: false, error: "No se pudo crear la sesión." }, { status: 503 });
  }

  const res = NextResponse.json({ ok: true, role });
  res.cookies.set({
    name: APP_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
  return res;
}
