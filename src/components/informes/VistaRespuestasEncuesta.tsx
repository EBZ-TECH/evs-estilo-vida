"use client";

import { PASOS_ENCUESTA, etiquetaRespuesta } from "@/data/encuesta";
import type { InformeRegistro } from "@/lib/informes-storage";

interface Props {
  registro: InformeRegistro;
  onVolver: () => void;
}

function fechaLegible(iso: string) {
  try {
    return new Date(iso).toLocaleString("es", { dateStyle: "long", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export function VistaRespuestasEncuesta({ registro, onVolver }: Props) {
  const raw = registro.respuestas;
  const tieneCaptura = raw && Object.keys(raw).length > 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-8 print:border-zinc-400">
      <header className="border-b border-slate-200 pb-4 print:border-black">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Respuestas autoreportadas
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
          {registro.datos.nombre}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Registro del{" "}
          <time dateTime={registro.guardadoEn}>{fechaLegible(registro.guardadoEn)}</time>
          {registro.datos.versionInstrumento ? (
            <>
              {" "}
              · Instrumento <span className="font-mono text-xs">{registro.datos.versionInstrumento}</span>
            </>
          ) : null}
        </p>
      </header>

      {!tieneCaptura ? (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
          Este informe no incluye la captura de respuestas (p. ej. registro guardado antes de esta
          función). Solo está disponible el informe clínico resumido.
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {PASOS_ENCUESTA.map((paso) => (
            <section key={paso.id} className="scroll-mt-4">
              <h3 className="text-sm font-semibold text-blue-950">{paso.titulo}</h3>
              {paso.descripcion ? (
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{paso.descripcion}</p>
              ) : null}
              <dl className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/80">
                {paso.preguntas.map((p) => {
                  const valor = raw![p.id];
                  return (
                    <div
                      key={p.id}
                      className="grid gap-1 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,14rem)] sm:items-start sm:gap-4 sm:px-4"
                    >
                      <dt className="text-sm font-medium text-slate-800">{p.texto}</dt>
                      <dd className="text-sm leading-relaxed text-slate-700 sm:text-right">
                        {etiquetaRespuesta(p, valor)}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          ))}
        </div>
      )}

      <div className="mt-8 print:hidden">
        <button
          type="button"
          onClick={onVolver}
          className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 touch-manipulation sm:w-auto sm:py-2"
        >
          Volver al listado
        </button>
      </div>
    </article>
  );
}
