"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { PASOS_ENCUESTA, type PreguntaEncuesta } from "@/data/encuesta";
import { evaluarEncuesta } from "@/lib/clinica/evaluar";
import { guardarInformeEnBiblioteca } from "@/lib/informes-storage";
import type { InformeDiagnostico, RespuestasEncuesta } from "@/lib/clinica/types";

function valorInicial(p: PreguntaEncuesta, respuestas: RespuestasEncuesta): string {
  const v = respuestas[p.id];
  if (v === undefined || v === null) return "";
  return String(v);
}

export function EncuestaWizard() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<RespuestasEncuesta>({});
  const [errorPaso, setErrorPaso] = useState<string | null>(null);

  const totalPasos = PASOS_ENCUESTA.length;
  const pasoActual = PASOS_ENCUESTA[paso];

  const validarPaso = useCallback((): boolean => {
    for (const p of pasoActual.preguntas) {
      const v = respuestas[p.id];
      if (v === undefined || v === "" || v === null) {
        setErrorPaso("Por favor complete todas las preguntas de esta sección.");
        return false;
      }
      if (p.tipo === "texto") {
        const s = String(v).trim();
        if (!s) {
          setErrorPaso("Por favor complete todas las preguntas de esta sección.");
          return false;
        }
        if ((p.id === "peso_kg" || p.id === "talla_m") && Number.isNaN(parseFloat(String(v).replace(",", ".")))) {
          setErrorPaso("Peso y estatura deben ser valores numéricos.");
          return false;
        }
      }
    }
    setErrorPaso(null);
    return true;
  }, [pasoActual.preguntas, respuestas]);

  const siguiente = () => {
    if (!validarPaso()) return;
    if (paso < totalPasos - 1) setPaso((x) => x + 1);
    else finalizar();
  };

  const anterior = () => {
    setErrorPaso(null);
    if (paso > 0) setPaso((x) => x - 1);
  };

  const finalizar = () => {
    if (!validarPaso()) return;
    const informe: InformeDiagnostico = evaluarEncuesta(respuestas);
    try {
      guardarInformeEnBiblioteca(informe, respuestas);
    } catch {
      /* ignore */
    }
    router.replace("/formulario?finalizada=1");
  };

  const setCampo = (id: string, value: string) => {
    setRespuestas((r) => {
      const next = { ...r, [id]: value };
      if (id.startsWith("ttm")) {
        const n = parseInt(value, 10);
        if (Number.isFinite(n)) next[id] = n;
      }
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8 border-b border-zinc-200 pb-6">
        <p className="text-sm font-medium text-teal-800">
          Encuesta clínica · Determinantes de estilos de vida
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
          {pasoActual.titulo}
        </h1>
        {pasoActual.descripcion ? (
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            {pasoActual.descripcion}
          </p>
        ) : null}
        <p className="mt-4 text-xs text-zinc-500">
          Paso {paso + 1} de {totalPasos}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-300"
            style={{ width: `${((paso + 1) / totalPasos) * 100}%` }}
          />
        </div>
      </header>

      <div className="space-y-8">
        {pasoActual.preguntas.map((p) => (
          <fieldset key={p.id} className="space-y-3">
            <legend className="text-base font-medium text-zinc-900">{p.texto}</legend>
            {p.ayuda ? (
              <p className="text-sm text-zinc-500">{p.ayuda}</p>
            ) : null}

            {p.tipo === "texto" ? (
              <input
                type={p.id === "edad" || p.id === "peso_kg" || p.id === "talla_m" ? "text" : "text"}
                inputMode={p.id === "nombre" ? "text" : "decimal"}
                autoComplete="off"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 outline-none ring-teal-600 focus:border-teal-600 focus:ring-2"
                value={valorInicial(p, respuestas)}
                onChange={(e) => setCampo(p.id, e.target.value)}
              />
            ) : null}

            {(p.tipo === "unica" || p.tipo === "likert_0_3") && p.opciones ? (
              <ul className="space-y-2">
                {p.opciones.map((op) => {
                  const sel = valorInicial(p, respuestas) === op.value;
                  return (
                    <li key={op.value}>
                      <label
                        className={`flex cursor-pointer gap-3 rounded-lg border px-3 py-2.5 text-sm leading-snug transition-colors ${
                          sel
                            ? "border-teal-600 bg-teal-50 text-teal-950"
                            : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name={p.id}
                          value={op.value}
                          checked={sel}
                          className="mt-1 shrink-0 accent-teal-700"
                          onChange={() => setCampo(p.id, op.value)}
                        />
                        <span>{op.label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </fieldset>
        ))}
      </div>

      {errorPaso ? (
        <p className="mt-6 text-sm text-red-700" role="alert">
          {errorPaso}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6">
        <button
          type="button"
          onClick={anterior}
          disabled={paso === 0}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={siguiente}
          className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
        >
          {paso < totalPasos - 1 ? "Siguiente" : "Finalizar"}
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-zinc-400">
        Sus respuestas se procesan en este dispositivo para generar el borrador de informe.
        No sustituye valoración médica. El informe completo lo consulta el personal con acceso
        profesional en este mismo navegador.
      </p>
    </div>
  );
}
