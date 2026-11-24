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

function freqConductualNegativa(respuestas: RespuestasEncuesta, clave: string): boolean {
  const v = respuestas[clave];
  return v === "algunas_veces" || v === "generalmente" || v === "siempre";
}

function likertRiesgo(respuestas: RespuestasEncuesta, clave: string): boolean {
  const n = likertNum(respuestas[clave]);
  return n !== null && n >= 2;
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

  if (freqConductualNegativa(respuestas, "q13")) {
    push(
      h,
      "conduct_q13",
      "Consumo emocional de alimentos o sustancias ante estrés, enfado o aburrimiento",
      "conductual"
    );
  }
  if (freqConductualNegativa(respuestas, "q14")) {
    push(
      h,
      "conduct_q14",
      "Menor control de la dieta o consumo de sustancias al llegar cansado por la noche",
      "conductual"
    );
  }
  if (freqConductualNegativa(respuestas, "q15")) {
    push(
      h,
      "conduct_q15",
      "Dificultad para controlar las cantidades de ciertos alimentos o sustancias",
      "conductual"
    );
  }
  if (freqConductualNegativa(respuestas, "q16")) {
    push(
      h,
      "conduct_q16",
      "Dificultad para controlar ciertos alimentos o bebidas (dulces, comida rápida)",
      "conductual"
    );
  }
  if (freqConductualNegativa(respuestas, "q17")) {
    push(
      h,
      "conduct_q17",
      "Dificultad para dejar de comer alimentos dulces, especialmente chocolate",
      "conductual"
    );
  }

  if (respuestas.q18 === "no_afecta") {
    push(
      h,
      "creencias_peso_no_afecta",
      "Creencias sobre el peso corporal que minimizan su impacto en la salud",
      "cognitivo"
    );
  }
  if (respuestas.q18 === "no_enfermedad") {
    push(
      h,
      "creencias_peso_no_enfermedad",
      "Creencias sobre el peso corporal que no lo reconocen como enfermedad",
      "cognitivo"
    );
  }

  if (likertRiesgo(respuestas, "q19")) {
    push(
      h,
      "psico_estres_q19",
      "Dificultad para relajarse o descargar la tensión",
      "psicoemocional_estres"
    );
  }
  if (likertRiesgo(respuestas, "q20")) {
    push(
      h,
      "psico_estres_q20",
      "Tendencia a reaccionar en exceso ante situaciones",
      "psicoemocional_estres"
    );
  }
  if (likertRiesgo(respuestas, "q21")) {
    push(
      h,
      "psico_estres_q21",
      "Sensación de nerviosismo o estrés",
      "psicoemocional_estres"
    );
  }

  if (likertRiesgo(respuestas, "q22")) {
    push(
      h,
      "psico_ansiedad_q22",
      "Agitación, nerviosismo, tensión o intranquilidad",
      "psicoemocional_ansiedad"
    );
  }
  if (likertRiesgo(respuestas, "q23")) {
    push(
      h,
      "psico_ansiedad_q23",
      "Temblor en las manos",
      "psicoemocional_ansiedad"
    );
  }
  if (likertRiesgo(respuestas, "q24")) {
    push(
      h,
      "psico_ansiedad_q24",
      "Sensación de que las dificultades se acumulan y no pueden superarse",
      "psicoemocional_ansiedad"
    );
  }

  if (likertRiesgo(respuestas, "q25a")) {
    push(
      h,
      "psico_depresion_q25a",
      "Dificultad para experimentar sentimientos positivos",
      "psicoemocional_depresion"
    );
  }
  if (likertRiesgo(respuestas, "q25b")) {
    push(
      h,
      "psico_depresion_q25b",
      "Falta de iniciativa para hacer las cosas",
      "psicoemocional_depresion"
    );
  }
  if (likertRiesgo(respuestas, "q25c")) {
    push(
      h,
      "psico_depresion_q25c",
      "Tristeza o estado de ánimo deprimido",
      "psicoemocional_depresion"
    );
  }

  return h;
}
