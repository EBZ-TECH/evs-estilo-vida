import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { tauriApi } from "@/lib/tauri-api";
import { useSesion } from "@/lib/sesion";

export function IngresoPin() {
  const navigate = useNavigate();
  const sesion = useSesion();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verificando, setVerificando] = useState(false);

  useEffect(() => {
    let activo = true;
    tauriApi.pinExiste().then((existe) => {
      if (!activo) return;
      if (!existe) navigate("/setup", { replace: true });
    });
    return () => {
      activo = false;
    };
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setVerificando(true);
    try {
      const ok = await tauriApi.verificarPin(pin);
      if (!ok) {
        setError("PIN incorrecto.");
        return;
      }
      sesion.iniciarProfesional();
      navigate("/informe", { replace: true });
    } catch (e2) {
      const msg = e2 instanceof Error ? e2.message : String(e2);
      setError(msg);
    } finally {
      setVerificando(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-100">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-700">
            Acceso profesional
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Ingrese su PIN
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
            Introduzca el PIN configurado en este equipo para acceder al panel de informes.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-900/5 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="ingreso-pin"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
              >
                PIN
              </label>
              <input
                id="ingreso-pin"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none ring-2 ring-transparent transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-zinc-900/10"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
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
              disabled={verificando}
              className="w-full rounded-xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verificando ? "Verificando…" : "Continuar"}
            </button>
          </form>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mx-auto mt-6 text-xs font-medium text-zinc-500 hover:text-zinc-800"
        >
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}
