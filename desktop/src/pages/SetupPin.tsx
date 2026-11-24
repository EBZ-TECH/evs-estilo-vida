import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { tauriApi } from "@/lib/tauri-api";
import { useSesion } from "@/lib/sesion";

export function SetupPin() {
  const navigate = useNavigate();
  const sesion = useSesion();
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let activo = true;
    tauriApi.pinExiste().then((existe) => {
      if (!activo) return;
      if (existe) navigate("/ingreso", { replace: true });
    });
    return () => {
      activo = false;
    };
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (pin.length < 4) {
      setError("El PIN debe tener al menos 4 caracteres.");
      return;
    }
    if (pin !== pinConfirm) {
      setError("Los PIN no coinciden.");
      return;
    }
    setGuardando(true);
    try {
      await tauriApi.definirPin(pin);
      sesion.iniciarProfesional();
      navigate("/informe", { replace: true });
    } catch (e2) {
      const msg = e2 instanceof Error ? e2.message : String(e2);
      setError(msg);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-100">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-800">
            Configuración inicial
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Defina el PIN profesional
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
            Este PIN protege el acceso al panel de informes en este equipo. Se almacena en forma
            de hash Argon2 dentro de la base de datos local; no es recuperable.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-900/5 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="setup-pin"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
              >
                PIN nuevo (mínimo 4 caracteres)
              </label>
              <input
                id="setup-pin"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none ring-2 ring-transparent transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-zinc-900/10"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label
                htmlFor="setup-pin-confirm"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
              >
                Confirmar PIN
              </label>
              <input
                id="setup-pin-confirm"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none ring-2 ring-transparent transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-zinc-900/10"
                value={pinConfirm}
                onChange={(e) => setPinConfirm(e.target.value)}
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
              disabled={guardando}
              className="w-full rounded-xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando ? "Guardando…" : "Guardar PIN y continuar"}
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
