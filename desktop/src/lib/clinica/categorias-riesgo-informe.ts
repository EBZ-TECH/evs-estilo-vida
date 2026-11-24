import type { HallazgoRiesgo } from "./types";

/** Bloques del informe alineados a la encuesta (I–VIII). */
export type ClaveCategoriaRiesgoInforme =
  | "condiciones_vida"
  | "sistema_salud"
  | "biologicos"
  | "conductuales"
  | "cognitivos"
  | "psico_estres"
  | "psico_ansiedad"
  | "psico_depresion";

const TITULOS: Record<ClaveCategoriaRiesgoInforme, string> = {
  condiciones_vida: "Aspectos de Condiciones de Vida",
  sistema_salud: "Aspectos del Sistema de Salud",
  biologicos: "Aspectos Biológicos",
  conductuales: "Aspectos Conductuales",
  cognitivos: "Aspectos Cognitivos",
  psico_estres: "Aspectos psicoemocionales: síntomas de estrés",
  psico_ansiedad: "Aspectos psicoemocionales: síntomas de ansiedad",
  psico_depresion: "Aspectos psicoemocionales: síntomas de depresión",
};

const ORDEN: ClaveCategoriaRiesgoInforme[] = [
  "condiciones_vida",
  "sistema_salud",
  "biologicos",
  "conductuales",
  "cognitivos",
  "psico_estres",
  "psico_ansiedad",
  "psico_depresion",
];

/** Mapeo explícito por código estable de hallazgo (prioridad sobre la dimensión). */
const CATEGORIA_POR_CODIGO: Record<string, ClaveCategoriaRiesgoInforme> = {
  cdv_espacios_af: "condiciones_vida",
  cdv_dinero_alimentos: "condiciones_vida",
  cdv_apoyo_familiar: "condiciones_vida",
  cdv_predom_rapida: "condiciones_vida",
  cdv_predom_ultra: "condiciones_vida",
  cdv_sin_patron: "condiciones_vida",
  cdv_habitos_fam: "condiciones_vida",
  ss_programa_rcv: "sistema_salud",
  bio_antecedentes: "biologicos",
  bio_tiroides: "biologicos",
  bio_metabolico: "biologicos",
  bio_hormonal: "biologicos",
  bio_microbiota: "biologicos",
  bio_sueno: "biologicos",
  consumo_emocional_conductas_adictivas: "conductuales",
  conduct_q13: "conductuales",
  conduct_q14: "conductuales",
  conduct_q15: "conductuales",
  conduct_q16: "conductuales",
  conduct_q17: "conductuales",
  creencias_peso_cognitivo: "cognitivos",
  creencias_peso_no_afecta: "cognitivos",
  creencias_peso_no_enfermedad: "cognitivos",
  psico_estres: "psico_estres",
  psico_estres_q19: "psico_estres",
  psico_estres_q20: "psico_estres",
  psico_estres_q21: "psico_estres",
  psico_ansiedad: "psico_ansiedad",
  psico_ansiedad_q22: "psico_ansiedad",
  psico_ansiedad_q23: "psico_ansiedad",
  psico_ansiedad_q24: "psico_ansiedad",
  psico_depresion: "psico_depresion",
  psico_depresion_q25a: "psico_depresion",
  psico_depresion_q25b: "psico_depresion",
  psico_depresion_q25c: "psico_depresion",
};

type DimensionLegacy = HallazgoRiesgo["dimension"] | "conductual_cognitivo";

function clavePorDimension(d: DimensionLegacy): ClaveCategoriaRiesgoInforme | null {
  switch (d) {
    case "condiciones_vida":
      return "condiciones_vida";
    case "sistema_salud":
      return "sistema_salud";
    case "biologicos":
      return "biologicos";
    case "conductual":
      return "conductuales";
    case "cognitivo":
      return "cognitivos";
    case "conductual_cognitivo":
      return "conductuales";
    case "psicoemocional_estres":
      return "psico_estres";
    case "psicoemocional_ansiedad":
      return "psico_ansiedad";
    case "psicoemocional_depresion":
      return "psico_depresion";
    default:
      return null;
  }
}

function clavePorHallazgo(h: HallazgoRiesgo & { dimension?: DimensionLegacy }): ClaveCategoriaRiesgoInforme {
  const porCodigo = CATEGORIA_POR_CODIGO[h.codigo];
  if (porCodigo) return porCodigo;

  const porDimension = h.dimension ? clavePorDimension(h.dimension) : null;
  if (porDimension) return porDimension;

  return "condiciones_vida";
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
    buckets.get(clavePorHallazgo(h))!.push(h);
  }
  return ORDEN.map((clave) => ({
    clave,
    titulo: TITULOS[clave],
    items: buckets.get(clave)!,
  })).filter((g) => g.items.length > 0);
}
