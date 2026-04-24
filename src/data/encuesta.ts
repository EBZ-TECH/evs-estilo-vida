export type TipoPregunta = "texto" | "unica" | "likert_0_3";

export interface OpcionEncuesta {
  value: string;
  label: string;
  /** Solo ítems TTM: puntuación 1–5 */
  puntajeTtm?: number;
}

export interface PreguntaEncuesta {
  id: string;
  tipo: TipoPregunta;
  texto: string;
  ayuda?: string;
  opciones?: OpcionEncuesta[];
}

export interface PasoEncuesta {
  id: string;
  titulo: string;
  descripcion?: string;
  preguntas: PreguntaEncuesta[];
}

export const PASOS_ENCUESTA: PasoEncuesta[] = [
  {
    id: "identificacion",
    titulo: "Datos generales",
    descripcion: "Información básica y medidas para el perfil antropométrico.",
    preguntas: [
      { id: "nombre", tipo: "texto", texto: "Nombre completo" },
      { id: "edad", tipo: "texto", texto: "Edad (años)" },
      {
        id: "peso_kg",
        tipo: "texto",
        texto: "Peso (kg)",
        ayuda: "Use punto o coma para decimales.",
      },
      {
        id: "talla_m",
        tipo: "texto",
        texto: "Estatura (m)",
        ayuda: "Ejemplo: 1,65 o 1.65",
      },
    ],
  },
  {
    id: "condiciones_vida",
    titulo: "I. Aspectos de condiciones de vida",
    preguntas: [
      {
        id: "q1",
        tipo: "unica",
        texto:
          "¿Hay espacios para realizar actividad física cerca de su lugar de residencia?",
        opciones: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "q2",
        tipo: "unica",
        texto:
          "En su hogar, ¿disponen de dinero para comprar alimentos saludables (frutas, verduras, proteína, leche, huevos, granos, papa, yuca, avena)?",
        opciones: [
          { value: "nunca", label: "Nunca" },
          { value: "a_veces", label: "A veces" },
          { value: "siempre", label: "Siempre" },
        ],
      },
      {
        id: "q3",
        tipo: "unica",
        texto:
          "Si usted deseara hacer un cambio en su estilo de vida, ¿un miembro de su familia lo apoyaría?",
        opciones: [
          { value: "si", label: "Sí" },
          { value: "mas_o_menos", label: "Más o menos" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "q4",
        tipo: "unica",
        texto: "¿Qué tipo de alimentos predominan en las comidas principales de su hogar?",
        opciones: [
          { value: "casera_balanceada", label: "Comida casera balanceada" },
          {
            value: "comida_rapida",
            label: "Comida rápida o industrializada (fritos, embutidos, gaseosas, etc.)",
          },
          { value: "ultra_procesados", label: "Alimentos ultraprocesados" },
          { value: "tradicionales", label: "Comidas tradicionales de la región" },
          { value: "dietas_especiales", label: "Dietas especiales (vegetariana, keto, etc.)" },
          { value: "sin_patron", label: "No hay un patrón definido" },
        ],
      },
      {
        id: "q5",
        tipo: "unica",
        texto: "¿Considera que su familia tiene hábitos alimenticios saludables?",
        opciones: [
          { value: "si", label: "Sí, en general nos alimentamos bien" },
          { value: "mas_o_menos", label: "Más o menos, hay aspectos que mejorar" },
          { value: "no", label: "No, tenemos hábitos poco saludables" },
        ],
      },
    ],
  },
  {
    id: "sistema_salud",
    titulo: "II. Aspectos del sistema de salud",
    preguntas: [
      {
        id: "q6",
        tipo: "unica",
        texto:
          "¿Recibe atención médica en programas de riesgo cardiovascular o control del sobrepeso?",
        opciones: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
    ],
  },
  {
    id: "biologicos",
    titulo: "III. Aspectos biológicos",
    preguntas: [
      {
        id: "q7",
        tipo: "unica",
        texto: "¿Algún familiar ha padecido o padece de sobrepeso u obesidad?",
        opciones: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "q8",
        tipo: "unica",
        texto: "¿Ha tenido problemas de la glándula tiroides?",
        opciones: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "q9",
        tipo: "unica",
        texto: "¿Presenta problemas metabólicos?",
        opciones: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "q10",
        tipo: "unica",
        texto:
          "¿Ha presentado desequilibrios hormonales (resistencia a la insulina, leptina, grelina)?",
        opciones: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "q11",
        tipo: "unica",
        texto:
          "¿Ha tenido alteraciones del microbiota intestinal (flora bacteriana o flora intestinal)?",
        opciones: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "q12",
        tipo: "unica",
        texto: "¿Presenta trastornos del sueño?",
        opciones: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
    ],
  },
  {
    id: "conductual",
    titulo: "IV. Aspectos conductuales",
    descripcion: "Frecuencia en la última etapa referida.",
    preguntas: [
      {
        id: "q13",
        tipo: "unica",
        texto: "¿Come o consume ciertas sustancias cuando está estresado, enfadado o aburrido?",
        opciones: [
          { value: "nunca", label: "Nunca" },
          { value: "algunas_veces", label: "Algunas veces" },
          { value: "generalmente", label: "Generalmente" },
          { value: "siempre", label: "Siempre" },
        ],
      },
      {
        id: "q14",
        tipo: "unica",
        texto:
          "¿Cuando llega de trabajar cansado por la noche es cuando menos control tiene sobre su dieta o consumo de sustancias?",
        opciones: [
          { value: "nunca", label: "Nunca" },
          { value: "algunas_veces", label: "Algunas veces" },
          { value: "generalmente", label: "Generalmente" },
          { value: "siempre", label: "Siempre" },
        ],
      },
      {
        id: "q15",
        tipo: "unica",
        texto: "¿Tiene problemas para controlar las cantidades de ciertos alimentos o sustancias?",
        opciones: [
          { value: "nunca", label: "Nunca" },
          { value: "algunas_veces", label: "Algunas veces" },
          { value: "generalmente", label: "Generalmente" },
          { value: "siempre", label: "Siempre" },
        ],
      },
      {
        id: "q16",
        tipo: "unica",
        texto: "¿La comida o ciertas sustancias le controlan a usted y no usted a la comida?",
        opciones: [
          { value: "nunca", label: "Nunca" },
          { value: "algunas_veces", label: "Algunas veces" },
          { value: "generalmente", label: "Generalmente" },
          { value: "siempre", label: "Siempre" },
        ],
      },
      {
        id: "q17",
        tipo: "unica",
        texto: "¿Le cuesta parar de comer alimentos dulces, especialmente chocolate?",
        opciones: [
          { value: "nunca", label: "Nunca" },
          { value: "algunas_veces", label: "Algunas veces" },
          { value: "generalmente", label: "Generalmente" },
          { value: "siempre", label: "Siempre" },
        ],
      },
    ],
  },
  {
    id: "cognitivo",
    titulo: "V. Aspectos cognitivos",
    preguntas: [
      {
        id: "q18",
        tipo: "unica",
        texto: "El peso corporal que tengo:",
        opciones: [
          { value: "afecta", label: "Considero que afecta mi salud" },
          { value: "no_afecta", label: "Considero que no afecta mi salud" },
          { value: "enfermedad", label: "Considero que es una enfermedad" },
          { value: "no_enfermedad", label: "Considero que no es una enfermedad" },
        ],
      },
    ],
  },
  {
    id: "estres",
    titulo: "VI. Aspectos psicoemocionales: síntomas de estrés",
    preguntas: [
      {
        id: "q19",
        tipo: "likert_0_3",
        texto: "Me resulta difícil relajarme o descargar la tensión",
        opciones: [
          { value: "0", label: "No me ha ocurrido" },
          { value: "1", label: "Me ha ocurrido un poco, o durante parte del tiempo" },
          { value: "2", label: "Me ha ocurrido bastante, o durante una buena parte del tiempo" },
          { value: "3", label: "Me ha ocurrido mucho, o la mayor parte del tiempo" },
        ],
      },
      {
        id: "q20",
        tipo: "likert_0_3",
        texto: "Tiendo a reaccionar en exceso ante situaciones",
        opciones: [
          { value: "0", label: "No me ha ocurrido" },
          { value: "1", label: "Me ha ocurrido un poco, o durante parte del tiempo" },
          { value: "2", label: "Me ha ocurrido bastante, o durante una buena parte del tiempo" },
          { value: "3", label: "Me ha ocurrido mucho, o la mayor parte del tiempo" },
        ],
      },
      {
        id: "q21",
        tipo: "likert_0_3",
        texto: "Me he sentido nervioso o estresado",
        opciones: [
          { value: "0", label: "No me ha ocurrido" },
          { value: "1", label: "Me ha ocurrido un poco, o durante parte del tiempo" },
          { value: "2", label: "Me ha ocurrido bastante, o durante una buena parte del tiempo" },
          { value: "3", label: "Me ha ocurrido mucho, o la mayor parte del tiempo" },
        ],
      },
    ],
  },
  {
    id: "ansiedad",
    titulo: "VII. Aspectos psicoemocionales: síntomas de ansiedad",
    preguntas: [
      {
        id: "q22",
        tipo: "likert_0_3",
        texto: "Me siento agitado, nervioso, tenso o intranquilo",
        opciones: [
          { value: "0", label: "No me ha ocurrido" },
          { value: "1", label: "Me ha ocurrido un poco, o durante parte del tiempo" },
          { value: "2", label: "Me ha ocurrido bastante, o durante una buena parte del tiempo" },
          { value: "3", label: "Me ha ocurrido mucho, o la mayor parte del tiempo" },
        ],
      },
      {
        id: "q23",
        tipo: "likert_0_3",
        texto: "He sentido temblor en las manos",
        opciones: [
          { value: "0", label: "No me ha ocurrido" },
          { value: "1", label: "Me ha ocurrido un poco, o durante parte del tiempo" },
          { value: "2", label: "Me ha ocurrido bastante, o durante una buena parte del tiempo" },
          { value: "3", label: "Me ha ocurrido mucho, o la mayor parte del tiempo" },
        ],
      },
      {
        id: "q24",
        tipo: "likert_0_3",
        texto: "Siento que las dificultades se acumulan tanto que no puedo superarlas",
        opciones: [
          { value: "0", label: "No me ha ocurrido" },
          { value: "1", label: "Me ha ocurrido un poco, o durante parte del tiempo" },
          { value: "2", label: "Me ha ocurrido bastante, o durante una buena parte del tiempo" },
          { value: "3", label: "Me ha ocurrido mucho, o la mayor parte del tiempo" },
        ],
      },
    ],
  },
  {
    id: "depresion",
    titulo: "VIII. Aspectos psicoemocionales: síntomas de depresión",
    preguntas: [
      {
        id: "q25a",
        tipo: "likert_0_3",
        texto: "Pareciera que no puedo experimentar ningún sentimiento positivo",
        opciones: [
          { value: "0", label: "No me ha ocurrido" },
          { value: "1", label: "Me ha ocurrido un poco, o durante parte del tiempo" },
          { value: "2", label: "Me ha ocurrido bastante, o durante una buena parte del tiempo" },
          { value: "3", label: "Me ha ocurrido mucho, o la mayor parte del tiempo" },
        ],
      },
      {
        id: "q25b",
        tipo: "likert_0_3",
        texto: "Siento que me falta iniciativa para hacer las cosas",
        opciones: [
          { value: "0", label: "No me ha ocurrido" },
          { value: "1", label: "Me ha ocurrido un poco, o durante parte del tiempo" },
          { value: "2", label: "Me ha ocurrido bastante, o durante una buena parte del tiempo" },
          { value: "3", label: "Me ha ocurrido mucho, o la mayor parte del tiempo" },
        ],
      },
      {
        id: "q25c",
        tipo: "likert_0_3",
        texto: "Me siento triste o deprimido",
        opciones: [
          { value: "0", label: "No me ha ocurrido" },
          { value: "1", label: "Me ha ocurrido un poco, o durante parte del tiempo" },
          { value: "2", label: "Me ha ocurrido bastante, o durante una buena parte del tiempo" },
          { value: "3", label: "Me ha ocurrido mucho, o la mayor parte del tiempo" },
        ],
      },
    ],
  },
  {
    id: "ttm",
    titulo: "Situaciones y hábitos (estadio de cambio)",
    descripcion:
      "Para cada enunciado, escoja la opción que mejor describa su situación actual, no el pasado ni cómo le gustaría estar.",
    preguntas: [
      {
        id: "ttm1",
        tipo: "unica",
        texto: "En cuanto a mi dieta, considero que…",
        opciones: [
          {
            value: "1",
            label:
              "Desde que tengo problemas con el peso corporal, no ha variado.",
            puntajeTtm: 1,
          },
          {
            value: "2",
            label:
              "Debo comer lo que dijeron en el hospital o el médico, pero por ahora no he hecho.",
            puntajeTtm: 2,
          },
          {
            value: "3",
            label: "He estado pensando en cómo organizarme para seguirla.",
            puntajeTtm: 3,
          },
          { value: "4", label: "Ahora estoy comiendo sano regularmente.", puntajeTtm: 4 },
          {
            value: "5",
            label:
              "Soy capaz de seguir la dieta, porque llevo más de medio año haciéndola.",
            puntajeTtm: 5,
          },
        ],
      },
      {
        id: "ttm2",
        tipo: "unica",
        texto: "Respecto a mi peso, yo…",
        opciones: [
          {
            value: "1",
            label: "Creo que es normal tener unos kilos de más; me siento bien así.",
            puntajeTtm: 1,
          },
          {
            value: "2",
            label: "Considero que debería bajar de peso, pero ahora no puedo, tal vez después.",
            puntajeTtm: 2,
          },
          {
            value: "3",
            label:
              "Pronto tendré un peso saludable; me estoy organizando para empezar a trabajar en ello.",
            puntajeTtm: 3,
          },
          {
            value: "4",
            label: "Me esfuerzo todos los días por alcanzar un peso saludable.",
            puntajeTtm: 4,
          },
          {
            value: "5",
            label: "Llevo más de 6 meses esforzándome por alcanzar un peso saludable.",
            puntajeTtm: 5,
          },
        ],
      },
      {
        id: "ttm3",
        tipo: "unica",
        texto: "Referente al ejercicio que me dijo el médico, yo…",
        opciones: [
          {
            value: "1",
            label: "Podría realizarlo regularmente pero no tengo intención de hacerlo.",
            puntajeTtm: 1,
          },
          {
            value: "2",
            label: "Creo que, si lo intento, podría hacerlo.",
            puntajeTtm: 2,
          },
          {
            value: "3",
            label:
              "He investigado y ya sé qué ejercicio empezaré a hacer en los próximos días.",
            puntajeTtm: 3,
          },
          {
            value: "4",
            label:
              "He empezado a hacer ejercicio; a veces es difícil, pero seguiré haciéndolo.",
            puntajeTtm: 4,
          },
          {
            value: "5",
            label:
              "He vencido los obstáculos y llevo más de 6 meses haciéndolo regularmente.",
            puntajeTtm: 5,
          },
        ],
      },
      {
        id: "ttm4",
        tipo: "unica",
        texto: "Referente a mi dieta, yo…",
        opciones: [
          {
            value: "1",
            label: "Creo que no se adecúa a lo que me gusta; como lo que quiero.",
            puntajeTtm: 1,
          },
          {
            value: "2",
            label:
              "Pienso que tal vez debería comer lo que dijeron, pero por ahora no lo haré.",
            puntajeTtm: 2,
          },
          {
            value: "3",
            label:
              "Probablemente en estos días empezaré a seguir la dieta; ya sé lo que necesitaré y pronto empezaré.",
            puntajeTtm: 3,
          },
          {
            value: "4",
            label:
              "Hace pocas semanas me decidí a empezarla y seguiré llevándola a cabo.",
            puntajeTtm: 4,
          },
          {
            value: "5",
            label:
              "Aunque no es sencillo, llevo más de 6 meses tratando de comer saludablemente todos los días.",
            puntajeTtm: 5,
          },
        ],
      },
      {
        id: "ttm5",
        tipo: "unica",
        texto: "Considero que respecto a mi peso…",
        opciones: [
          {
            value: "1",
            label: "El que esté pasado de peso no afecta mi salud.",
            puntajeTtm: 1,
          },
          {
            value: "2",
            label: "Tal vez debería hacer algo para bajar de peso.",
            puntajeTtm: 2,
          },
          {
            value: "3",
            label: "Ya sé cómo puedo bajar de peso; empezaré en estos días.",
            puntajeTtm: 3,
          },
          {
            value: "4",
            label:
              "Llevo menos de 6 meses cuidándolo, pero me estoy esforzando por conseguirlo.",
            puntajeTtm: 4,
          },
          {
            value: "5",
            label:
              "Cada vez estoy más cerca; llevo más de 6 meses esforzándome por tener un peso saludable.",
            puntajeTtm: 5,
          },
        ],
      },
      {
        id: "ttm6",
        tipo: "unica",
        texto: "En cuanto al ejercicio que me dijeron que hiciera, yo…",
        opciones: [
          { value: "1", label: "No lo creo necesario y no lo hago.", puntajeTtm: 1 },
          {
            value: "2",
            label: "Creo que, si lo intento, podría hacerlo.",
            puntajeTtm: 2,
          },
          {
            value: "3",
            label:
              "Ya he pensado qué actividad física me gustaría hacer; pronto lo haré.",
            puntajeTtm: 3,
          },
          {
            value: "4",
            label:
              "He comenzado a hacer ejercicio todos los días; me siento muy bien.",
            puntajeTtm: 4,
          },
          {
            value: "5",
            label: "He completado 6 meses de hacer ejercicio regular.",
            puntajeTtm: 5,
          },
        ],
      },
    ],
  },
];

/** Convierte el valor guardado en texto legible (etiqueta de opción o valor tal cual). */
export function etiquetaRespuesta(
  pregunta: PreguntaEncuesta,
  valor: string | number | undefined
): string {
  if (valor === undefined || valor === null || valor === "") return "—";
  const s = String(valor);
  if (pregunta.opciones?.length) {
    const hit = pregunta.opciones.find((o) => o.value === s);
    if (hit) return hit.label;
  }
  return s;
}
