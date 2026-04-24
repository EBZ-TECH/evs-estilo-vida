"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function IconClipboard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 4V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FormularioPortalClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const finalizada = searchParams.get("finalizada") === "1";
  const [cerrando, setCerrando] = useState(false);

  async function cerrarSesion() {
    setCerrando(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/");
      router.refresh();
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% -10%, rgb(45 212 191 / 0.35), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-lg px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={cerrarSesion}
            disabled={cerrando}
            className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline disabled:opacity-50"
          >
            {cerrando ? "Cerrando…" : "Cerrar sesión"}
          </button>
        </div>

        {finalizada ? (
          <div className="mb-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
            La evaluación se guardó en este navegador. El personal con acceso profesional puede
            abrir el informe en este mismo equipo cuando corresponda.
          </div>
        ) : null}

        <article className="relative overflow-hidden rounded-2xl border border-teal-200/80 bg-white shadow-xl shadow-teal-900/5 ring-1 ring-teal-900/5">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400" />
          <div className="p-7 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/25">
              <IconClipboard className="h-6 w-6" />
            </div>
            <h1 className="mt-6 text-xl font-semibold text-zinc-900 sm:text-2xl">Responder encuesta</h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Cuestionario clínico estructurado para registrar antropometría, determinantes de
              estilo de vida, factores de riesgo por dimensiones y estadio de cambio motivacional,
              de forma que el equipo de salud disponga de un informe orientativo para la consulta.
            </p>
            <Link
              href="/encuesta"
              replace
              className="mt-8 flex w-full items-center justify-center rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-700/25 transition hover:bg-teal-800"
            >
              Iniciar encuesta
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
