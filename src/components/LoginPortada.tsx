"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function IconKey({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM4 20.5V11l4-1 5 5-2 2-2-2-2 2v3.5H4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoginPortada() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "";

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isDev = process.env.NODE_ENV === "development";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; role?: string };
      if (!res.ok) {
        setError(data.error ?? "No se pudo iniciar sesión.");
        return;
      }
      if (data.role === "profesional") {
        const r = redirect.trim();
        if (r.startsWith("/informe")) {
          router.replace(r);
        } else {
          router.replace("/informe");
        }
      } else {
        router.replace("/formulario");
      }
      router.refresh();
    } catch {
      setError("Error de red. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% -15%, rgb(100 116 139 / 0.2), transparent 50%), radial-gradient(ellipse 60% 45% at 0% 100%, rgb(15 118 110 / 0.08), transparent 45%), radial-gradient(ellipse 50% 40% at 100% 80%, rgb(30 64 175 / 0.08), transparent 40%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-lg shadow-zinc-900/5">
            <IconKey className="h-8 w-8 text-zinc-700" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Acceso al sistema
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
            Identifíquese con las credenciales asignadas. El perfil profesional accede al
            dashboard de informes; el de formulario, al registro de encuestas.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xl shadow-zinc-900/5 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-user"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
              >
                Usuario
              </label>
              <input
                id="login-user"
                name="user"
                autoComplete="username"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none ring-2 ring-transparent transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-zinc-900/10"
                placeholder="Usuario"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="login-pass"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
              >
                Contraseña
              </label>
              <input
                id="login-pass"
                name="password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none ring-2 ring-transparent transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-zinc-900/10"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error ? (
              <p
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Entrando…
                </span>
              ) : (
                "Continuar"
              )}
            </button>
          </form>
        </div>

        {isDev ? (
          <p className="mx-auto mt-8 max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-[11px] leading-relaxed text-amber-950">
            <strong className="text-amber-900">Desarrollo:</strong> usuario{" "}
            <code className="rounded bg-amber-100 px-1">profesional</code> / contraseña{" "}
            <code className="rounded bg-amber-100 px-1">EVS-2026-Profesional#</code>
            {" · "}usuario <code className="rounded bg-amber-100 px-1">formulario</code> / contraseña{" "}
            <code className="rounded bg-amber-100 px-1">EVS-2026-Formulario#</code>. Defina{" "}
            <code className="rounded bg-amber-100 px-1">.env.local</code> en producción.
          </p>
        ) : null}
      </div>
    </div>
  );
}
