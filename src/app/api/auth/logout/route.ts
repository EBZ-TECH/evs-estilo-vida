import { NextResponse } from "next/server";
import { APP_SESSION_COOKIE } from "@/lib/auth/app-session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: APP_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
