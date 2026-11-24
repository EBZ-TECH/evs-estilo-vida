import { calcularMedicionAntropometrica, parseNumeroClinico } from "./imc";
import { clasificarEstadioCambio } from "./ttm";
import { evaluarHallazgosRiesgo } from "./riesgos";
import type { InformeDiagnostico, RespuestasEncuesta } from "./types";

export const VERSION_INSTRUMENTO = "encuesta-determinantes-v1-2026";

export function evaluarEncuesta(respuestas: RespuestasEncuesta): InformeDiagnostico {
  const nombre = String(respuestas.nombre ?? "").trim() || "Sin nombre registrado";
  const cedulaRaw = String(respuestas.cedula ?? "").trim();
  const cedula = cedulaRaw || undefined;
  const edad = String(respuestas.edad ?? "").trim() || "—";

  const peso = parseNumeroClinico(respuestas.peso_kg);
  const talla = parseNumeroClinico(respuestas.talla_m);
  const medicion =
    peso !== null && talla !== null ? calcularMedicionAntropometrica(peso, talla) : null;

  const hallazgos = evaluarHallazgosRiesgo(respuestas);
  const estadio = clasificarEstadioCambio(respuestas);

  return {
    nombre,
    cedula,
    edad,
    medicion,
    hallazgos,
    estadio,
    versionInstrumento: VERSION_INSTRUMENTO,
  };
}

/** Recalcula hallazgos y estadio con la lógica vigente si hay respuestas guardadas. */
export function refrescarInformeParaVisualizacion(
  informe: InformeDiagnostico,
  respuestas?: RespuestasEncuesta | null
): InformeDiagnostico {
  if (!respuestas || Object.keys(respuestas).length === 0) {
    return informe;
  }
  const actualizado = evaluarEncuesta(respuestas);
  return {
    ...informe,
    nombre: actualizado.nombre,
    cedula: actualizado.cedula,
    edad: actualizado.edad,
    medicion: actualizado.medicion,
    hallazgos: actualizado.hallazgos,
    estadio: actualizado.estadio,
    versionInstrumento: actualizado.versionInstrumento,
  };
}
