import type { ClasificacionEstadioCambio, EstadioCambioCodigo, RespuestasEncuesta } from "./types";
import { PAUTAS_POR_ESTADIO } from "./estadios-ttm-texto";

const CLAVES_TTM = ["ttm1", "ttm2", "ttm3", "ttm4", "ttm5", "ttm6"] as const;

/**
 * Cada ítem TTM aporta 1–5 puntos (opción 1 = menor avance, 5 = mantenimiento).
 * Rangos según ENCUESTA_Producto: Precontemplación 6–13; contemplación puntaje 14
 * (transición entre 13 y 15); Preparación 15–20; Acción 21–26 (intervalo deducido entre 20 y 27);
 * Mantenimiento 27–30.
 */
export function puntajeTtm(respuestas: RespuestasEncuesta): number {
  let suma = 0;
  for (const k of CLAVES_TTM) {
    const v = respuestas[k];
    const n = typeof v === "number" ? v : parseInt(String(v), 10);
    if (!Number.isFinite(n) || n < 1 || n > 5) continue;
    suma += n;
  }
  return suma;
}

function clasificarPuntajeTtm(total: number): EstadioCambioCodigo {
  if (total <= 13) return "PRECONTEMPLACION";
  if (total === 14) return "CONTEMPLACION";
  if (total <= 20) return "PREPARACION";
  if (total <= 26) return "ACCION";
  return "MANTENIMIENTO";
}

export function clasificarEstadioCambio(
  respuestas: RespuestasEncuesta
): ClasificacionEstadioCambio {
  const puntajeTotal = puntajeTtm(respuestas);
  const codigo = clasificarPuntajeTtm(puntajeTotal);
  const bloque = PAUTAS_POR_ESTADIO[codigo];
  return {
    codigo,
    tituloInforme: bloque.titulo,
    puntajeTotal,
    pautasProfesional: bloque.cuerpo,
  };
}
