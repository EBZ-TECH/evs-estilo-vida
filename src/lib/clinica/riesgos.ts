import type { HallazgoRiesgo, RespuestasEncuesta } from "./types";

function push(
  out: HallazgoRiesgo[],
  codigo: string,
  textoInforme: string,
  dimension: HallazgoRiesgo["dimension"]
) {
  if (!out.some((h) => h.codigo === codigo)) {
    out.push({ codigo, textoInforme, dimension });
  }
}

function likertNum(v: unknown): number | null {
  if (v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
}

/** Solo factores de riesgo positivos, redactados para el informe (variable / hallazgo, no texto de pregunta). */
export function evaluarHallazgosRiesgo(respuestas: RespuestasEncuesta): HallazgoRiesgo[] {
  const h: HallazgoRiesgo[] = [];

  if (respuestas.q1 === "no") {
    push(
      h,
      "cdv_espacios_af",
      "No disponibilidad de espacios para realizar actividad física cerca del lugar de residencia",
      "condiciones_vida"
    );
  }
  if (respuestas.q2 === "nunca" || respuestas.q2 === "a_veces") {
    push(
      h,
      "cdv_dinero_alimentos",
      "Disposición limitada de dinero para compra de alimentos saludables",
      "condiciones_vida"
    );
  }
  if (respuestas.q3 === "mas_o_menos" || respuestas.q3 === "no") {
    push(
      h,
      "cdv_apoyo_familiar",
      "Apoyo familiar insuficiente para un cambio de estilo de vida",
      "condiciones_vida"
    );
  }

  if (respuestas.q4 === "comida_rapida") {
    push(
      h,
      "cdv_predom_rapida",
      "Predominio de comida rápida o industrializada en las comidas principales",
      "condiciones_vida"
    );
  } else if (respuestas.q4 === "ultra_procesados") {
    push(
      h,
      "cdv_predom_ultra",
      "Predominio de alimentos ultraprocesados en las comidas principales",
      "condiciones_vida"
    );
  } else if (respuestas.q4 === "sin_patron") {
    push(
      h,
      "cdv_sin_patron",
      "Ausencia de patrón definido en las comidas principales del hogar",
      "condiciones_vida"
    );
  }

  if (respuestas.q5 === "mas_o_menos" || respuestas.q5 === "no") {
    push(
      h,
      "cdv_habitos_fam",
      "Hábitos alimenticios familiares con aspectos poco saludables o a mejorar",
      "condiciones_vida"
    );
  }

  if (respuestas.q6 === "no") {
    push(
      h,
      "ss_programa_rcv",
      "No recibe atención médica en programas de riesgo cardiovascular o control del sobrepeso",
      "sistema_salud"
    );
  }

  if (respuestas.q7 === "si") {
    push(h, "bio_antecedentes", "Antecedentes familiares de sobrepeso u obesidad", "biologicos");
  }
  if (respuestas.q8 === "si") {
    push(h, "bio_tiroides", "Antecedentes o problemas de tiroides", "biologicos");
  }
  if (respuestas.q9 === "si") {
    push(h, "bio_metabolico", "Problemas metabólicos referidos", "biologicos");
  }
  if (respuestas.q10 === "si") {
    push(
      h,
      "bio_hormonal",
      "Desequilibrios hormonales referidos (p. ej. resistencia a la insulina, leptina, grelina)",
      "biologicos"
    );
  }
  if (respuestas.q11 === "si") {
    push(h, "bio_microbiota", "Alteraciones referidas del microbiota intestinal", "biologicos");
  }
  if (respuestas.q12 === "si") {
    push(h, "bio_sueno", "Trastornos del sueño referidos", "biologicos");
  }

  const freqNegativa = (clave: string) => {
    const v = respuestas[clave];
    return v === "algunas_veces" || v === "generalmente" || v === "siempre";
  };
  const conductual =
    freqNegativa("q13") ||
    freqNegativa("q14") ||
    freqNegativa("q15") ||
    freqNegativa("q16") ||
    freqNegativa("q17");
  const cognitivoRiesgo =
    respuestas.q18 === "no_afecta" || respuestas.q18 === "no_enfermedad";
  if (conductual || cognitivoRiesgo) {
    push(
      h,
      "consumo_emocional_conductas_adictivas",
      "Consumo emocional de sustancias o alimentos, conductas adictivas",
      "conductual_cognitivo"
    );
  }

  const estresItems = [likertNum(respuestas.q19), likertNum(respuestas.q20), likertNum(respuestas.q21)];
  if (estresItems.some((x) => x !== null && x >= 2)) {
    push(
      h,
      "psico_estres",
      "Aspectos psicoemocionales: síntomas de estrés",
      "psicoemocional_estres"
    );
  }

  const ansItems = [likertNum(respuestas.q22), likertNum(respuestas.q23), likertNum(respuestas.q24)];
  if (ansItems.some((x) => x !== null && x >= 2)) {
    push(
      h,
      "psico_ansiedad",
      "Aspectos psicoemocionales: síntomas de ansiedad",
      "psicoemocional_ansiedad"
    );
  }

  const depItems = [likertNum(respuestas.q25a), likertNum(respuestas.q25b), likertNum(respuestas.q25c)];
  if (depItems.some((x) => x !== null && x >= 2)) {
    push(
      h,
      "psico_depresion",
      "Aspectos psicoemocionales: síntomas de depresión",
      "psicoemocional_depresion"
    );
  }

  return h;
}
