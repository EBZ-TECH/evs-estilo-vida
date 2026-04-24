import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { APP_SESSION_COOKIE, parseSessionToken, type RolSesion } from "./app-session";

/** Comprueba la sesión en el servidor (defensa además del middleware). */
export async function exigirRolServidor(rol: RolSesion, rutaTrasLogin: string): Promise<void> {
  const jar = await cookies();
  const session = await parseSessionToken(jar.get(APP_SESSION_COOKIE)?.value);
  if (session?.role !== rol) {
    redirect(`/?redirect=${encodeURIComponent(rutaTrasLogin)}`);
  }
}
