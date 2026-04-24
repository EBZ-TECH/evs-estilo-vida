"use client";

import { agruparHallazgosParaInforme } from "@/lib/clinica/categorias-riesgo-informe";
import type { InformeDiagnostico } from "@/lib/clinica/types";

interface Props {
  informe: InformeDiagnostico;
  onVolver?: () => void;
  mostrarBarraSesion?: boolean;
  onCerrarSesion?: () => void;
  cerrandoSesion?: boolean;
}

export function InformeDetalle({
  informe,
  onVolver,
  mostrarBarraSesion = false,
  onCerrarSesion,
  cerrandoSesion,
}: Props) {
  return (
    <article className="mx-auto max-w-3xl print:max-w-none print:py-4">
      {mostrarBarraSesion && onCerrarSesion ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/90 px-4 py-3 print:hidden">
          <p className="text-xs font-medium text-blue-950">
            Sesión de personal autorizado · área de informes
          </p>
          <button
            type="button"
            onClick={onCerrarSesion}
            disabled={cerrandoSesion}
            className="rounded-lg border border-blue-800/25 bg-white px-3 py-1.5 text-xs font-semibold text-blue-950 shadow-sm hover:bg-blue-50 disabled:opacity-50"
          >
            {cerrandoSesion ? "Cerrando…" : "Cerrar sesión"}
          </button>
        </div>
      ) : null}

      <header className="border-b border-zinc-300 pb-6 print:border-black">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
          Informe diagnóstico · Uso profesional
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 print:text-black">
          Determinantes de estilos de vida y nivel de motivación por el cambio
        </h1>
        <p className="mt-1 text-xs text-zinc-500">{informe.versionInstrumento}</p>
      </header>

      <section className="mt-8 space-y-2">
        <h2 className="text-sm font-bold uppercase text-zinc-800">Identificación</h2>
        <p className="text-zinc-900">
          <span className="font-medium">Nombre:</span> {informe.nombre}
        </p>
        <p className="text-zinc-900">
          <span className="font-medium">Edad:</span> {informe.edad} años
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase text-zinc-800">Perfil antropométrico</h2>
        {informe.medicion ? (
          <ul className="mt-3 list-none space-y-1 text-zinc-900">
            <li>
              <span className="font-medium">IMC:</span> {informe.medicion.valorImc}
            </li>
            <li>
              <span className="font-medium">Clasificación:</span>{" "}
              {informe.medicion.etiquetaImc}
            </li>
            <li className="text-sm text-zinc-600">
              Peso {informe.medicion.pesoKg} kg · Talla {informe.medicion.tallaM} m
            </li>
          </ul>
        ) : (
          <p className="mt-2 text-sm text-zinc-600">Sin datos antropométricos válidos.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase text-zinc-800">
          Factores de riesgo identificados
        </h2>
        {informe.hallazgos.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600">
            No se detectaron factores de riesgo según los criterios configurados para esta
            versión del instrumento.
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            {agruparHallazgosParaInforme(informe.hallazgos).map((grupo) => (
              <div key={grupo.clave}>
                <h3 className="text-sm font-semibold text-teal-900 print:text-black">
                  {grupo.titulo}
                </h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-900">
                  {grupo.items.map((h) => (
                    <li key={h.codigo}>{h.textoInforme}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase text-zinc-800">
          Estadio de cambio motivacional
        </h2>
        <p className="mt-3 font-semibold text-zinc-900">{informe.estadio.tituloInforme}</p>
        <p className="mt-1 text-sm text-zinc-600">
          Puntaje en escala: {informe.estadio.puntajeTotal} (rango teórico 6–30)
        </p>
        <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-800 print:border-zinc-400 print:bg-white">
          {informe.estadio.pautasProfesional}
        </div>
      </section>

      <footer className="mt-12 border-t border-zinc-200 pt-6 text-xs text-zinc-500 print:border-black">
        Documento generado a partir de respuestas autoreportadas. Las pautas son orientativas
        para la entrevista clínica; deben ser adaptadas por el profesional.
      </footer>

      <div className="mt-8 flex flex-col gap-3 print:hidden sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 touch-manipulation sm:w-auto sm:py-2"
        >
          Imprimir / PDF
        </button>
        {onVolver ? (
          <button
            type="button"
            onClick={onVolver}
            className="min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 touch-manipulation sm:w-auto sm:py-2"
          >
            Volver al listado
          </button>
        ) : null}
      </div>
    </article>
  );
}
