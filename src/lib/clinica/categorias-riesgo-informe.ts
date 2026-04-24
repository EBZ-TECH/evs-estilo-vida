import type { HallazgoRiesgo } from "./types";

/** Cinco bloques del informe (alineado a la encuesta y al Excel de estrategias). */
export type ClaveCategoriaRiesgoInforme =
  | "condiciones_vida"
  | "sistema_salud"
  | "biologicos"
  | "cognitivos"
  | "psicoemocionales";

const TITULOS: Record<ClaveCategoriaRiesgoInforme, string> = {
  condiciones_vida: "Aspectos de Condiciones de Vida",
  sistema_salud: "Aspectos del Sistema de Salud",
  biologicos: "Aspectos Biológicos",
  cognitivos: "Aspectos Cognitivos",
  psicoemocionales: "Aspectos psicoemocionales",
};

const ORDEN: ClaveCategoriaRiesgoInforme[] = [
  "condiciones_vida",
  "sistema_salud",
  "biologicos",
  "cognitivos",
  "psicoemocionales",
];

function clavePorDimension(d: HallazgoRiesgo["dimension"]): ClaveCategoriaRiesgoInforme {
  switch (d) {
    case "condiciones_vida":
      return "condiciones_vida";
    case "sistema_salud":
      return "sistema_salud";
    case "biologicos":
      return "biologicos";
    case "conductual_cognitivo":
      return "cognitivos";
    case "psicoemocional_estres":
    case "psicoemocional_ansiedad":
    case "psicoemocional_depresion":
      return "psicoemocionales";
    default:
      return "condiciones_vida";
  }
}

export interface GrupoHallazgosInforme {
  clave: ClaveCategoriaRiesgoInforme;
  titulo: string;
  items: HallazgoRiesgo[];
}

/** Agrupa hallazgos por categoría de informe; solo devuelve grupos con al menos un ítem. */
export function agruparHallazgosParaInforme(hallazgos: HallazgoRiesgo[]): GrupoHallazgosInforme[] {
  const buckets = new Map<ClaveCategoriaRiesgoInforme, HallazgoRiesgo[]>();
  for (const k of ORDEN) {
    buckets.set(k, []);
  }
  for (const h of hallazgos) {
    buckets.get(clavePorDimension(h.dimension))!.push(h);
  }
  return ORDEN.map((clave) => ({
    clave,
    titulo: TITULOS[clave],
    items: buckets.get(clave)!,
  })).filter((g) => g.items.length > 0);
}
