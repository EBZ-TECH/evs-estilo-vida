/**
 * Sesión unificada: rol profesional (informes) o formulario (encuesta).
 * Formato token: exp|rol|firmaHMAC(exp|rol)
 */

export const APP_SESSION_COOKIE = "evs_session";

export type RolSesion = "profesional" | "formulario";

/** 7 días */
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

function bufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) {
    x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return x === 0;
}

export function getAuthSecret(): string {
  const s = process.env.AUTH_SESSION_SECRET ?? process.env.INFORME_AUTH_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV !== "production") {
    return "__dev-evs-session-secret-min-32-chars__";
  }
  return "";
}

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return bufferToHex(sig);
}

export async function createSessionToken(role: RolSesion): Promise<string | null> {
  const secret = getAuthSecret();
  if (!secret) return null;
  const exp = Date.now() + SESSION_MAX_AGE_SEC * 1000;
  const expStr = String(exp);
  const payload = `${expStr}|${role}`;
  const sig = await hmacSha256Hex(payload, secret);
  return `${payload}|${sig}`;
}

export async function parseSessionToken(
  token: string | undefined | null
): Promise<{ exp: number; role: RolSesion } | null> {
  if (!token) return null;
  const secret = getAuthSecret();
  if (!secret) return null;
  const lastBar = token.lastIndexOf("|");
  if (lastBar <= 0) return null;
  const sig = token.slice(lastBar + 1);
  const head = token.slice(0, lastBar);
  const midBar = head.indexOf("|");
  if (midBar <= 0) return null;
  const expStr = head.slice(0, midBar);
  const role = head.slice(midBar + 1) as RolSesion;
  if (role !== "profesional" && role !== "formulario") return null;
  const exp = parseInt(expStr, 10);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  const expected = await hmacSha256Hex(head, secret);
  if (!timingSafeEqualHex(sig.toLowerCase(), expected.toLowerCase())) return null;
  return { exp, role };
}

export function getProfesionalUser(): string {
  return (
    process.env.AUTH_PROFESIONAL_USER ??
    process.env.INFORME_AUTH_USER ??
    (process.env.NODE_ENV !== "production" ? "profesional" : "")
  );
}

export function getProfesionalPassword(): string {
  return (
    process.env.AUTH_PROFESIONAL_PASSWORD ??
    process.env.INFORME_AUTH_PASSWORD ??
    (process.env.NODE_ENV !== "production" ? "EVS-2026-Profesional#" : "")
  );
}

export function getFormularioUser(): string {
  return (
    process.env.AUTH_FORMULARIO_USER ??
    (process.env.NODE_ENV !== "production" ? "formulario" : "")
  );
}

export function getFormularioPassword(): string {
  return (
    process.env.AUTH_FORMULARIO_PASSWORD ??
    (process.env.NODE_ENV !== "production" ? "EVS-2026-Formulario#" : "")
  );
}

export function credencialesProfesionalOk(): boolean {
  return Boolean(getProfesionalUser() && getProfesionalPassword());
}

export function credencialesFormularioOk(): boolean {
  return Boolean(getFormularioUser() && getFormularioPassword());
}
