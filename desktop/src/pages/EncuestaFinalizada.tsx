import { useNavigate } from "react-router-dom";

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EncuestaFinalizada() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-100">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <article className="overflow-hidden rounded-2xl border border-teal-200/80 bg-white shadow-xl shadow-teal-900/5">
          <div className="h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400" />
          <div className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/25">
              <IconCheck className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-xl font-semibold text-zinc-900 sm:text-2xl">
              Evaluación guardada
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              La encuesta se almacenó correctamente en este equipo. El personal con acceso
              profesional puede consultar el informe diagnóstico desde el panel.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate("/encuesta", { replace: true })}
                className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-teal-800"
              >
                Iniciar otra encuesta
              </button>
              <button
                type="button"
                onClick={() => navigate("/", { replace: true })}
                className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
