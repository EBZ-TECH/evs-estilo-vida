import { calcularMedicionAntropometrica, parseNumeroClinico } from "./imc";
import { clasificarEstadioCambio } from "./ttm";
import { evaluarHallazgosRiesgo } from "./riesgos";
import type { InformeDiagnostico, RespuestasEncuesta } from "./types";

export const VERSION_INSTRUMENTO = "encuesta-determinantes-v1-2026";

export function evaluarEncuesta(respuestas: RespuestasEncuesta): InformeDiagnostico {
  const nombre = String(respuestas.nombre ?? "").trim() || "Sin nombre registrado";
  const edad = String(respuestas.edad ?? "").trim() || "—";

  const peso = parseNumeroClinico(respuestas.peso_kg);
  const talla = parseNumeroClinico(respuestas.talla_m);
  const medicion =
    peso !== null && talla !== null ? calcularMedicionAntropometrica(peso, talla) : null;

  const hallazgos = evaluarHallazgosRiesgo(respuestas);
  const estadio = clasificarEstadioCambio(respuestas);

  return {
    nombre,
    edad,
    medicion,
    hallazgos,
    estadio,
    versionInstrumento: VERSION_INSTRUMENTO,
  };
}
