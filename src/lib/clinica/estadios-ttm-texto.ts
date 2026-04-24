import type { EstadioCambioCodigo } from "./types";

/** Textos largos tomados / alineados con ENCUESTA_Producto_.docx para el informe al profesional. */
export const PAUTAS_POR_ESTADIO: Record<
  EstadioCambioCodigo,
  { titulo: string; cuerpo: string }
> = {
  PRECONTEMPLACION: {
    titulo: "I. Precontemplación",
    cuerpo:
      "La persona puede reconocer el exceso de peso, pero no lo percibe como un problema o riesgo, por lo que no busca cambiar su situación. No hay intención de cambiar en el futuro cercano. Puede mostrarse resistente o desinteresada; hay baja conciencia del problema. " +
      "Meta: ayudar a entender la existencia de dificultades o problemas y evaluar las consecuencias de la conducta, sin confrontar, juzgar o etiquetar. Crear ambiente de aceptación, empatía y comprensión. " +
      "Focalizar en procesos internos: aumento de conciencia, auto-reevaluación y reevaluación ambiental; aumentar motivación, interés y esperanza de cambio.",
  },
  CONTEMPLACION: {
    titulo: "II. Contemplación",
    cuerpo:
      "La persona nota molestias o insatisfacción relacionadas con su peso, reconoce que tiene un problema y reflexiona, pero aún no toma acción. Puede permanecer largo tiempo en ambivalencia (“quiero cambiar, pero no estoy listo”). " +
      "Meta: normalizar la ambivalencia y evaluar el balance decisional (ventajas y desventajas del problema), promover motivación extrínseca hacia intrínseca, valores personales, libre elección, responsabilidad y autoeficacia. " +
      "Actitud colaborativa no directiva y escucha reflexiva para inclinar la balanza a favor del cambio.",
  },
  PREPARACION: {
    titulo: "III. Preparación",
    cuerpo:
      "Existe intención y se planifica un cambio, aunque aún no se ejecuta plenamente. La persona decide acudir a un profesional y elaborar un plan; busca información o recursos; hay compromiso inicial. " +
      "Meta: establecer un plan de acción eficaz en colaboración, para el futuro inmediato, y aumentar el compromiso. Establecer fechas (compromiso hacia la acción). " +
      "Presentar alternativas para el estilo de vida, analizar ventajas y desventajas, resolver dudas, ofrecer literatura y discutir evaluación médica. Ayudar a visualizar el éxito; seguimiento y acompañamiento al plan. " +
      "Si rechaza fechas o no cumple, valorar retorno hacia contemplación.",
  },
  ACCION: {
    titulo: "IV. Acción",
    cuerpo:
      "La persona modifica activamente su conducta: adopta alimentación baja en calorías y realiza actividad física para equilibrar consumo y gasto energético, u otras estrategias concretas observables. " +
      "El plan puede chocar con la vida cotidiana; usar refuerzo positivo y reforzar nuevas conductas. Observar microcambios (asistencia a controles, seguimiento, mejoría en apariencia física). " +
      "Generar conciencia de los cambios y promover autorefuerzo. Tras aproximadamente tres a seis meses con cambios sostenidos, avanzar hacia mantenimiento.",
  },
  MANTENIMIENTO: {
    titulo: "V. Mantenimiento",
    cuerpo:
      "La persona consolida los cambios, previene recaídas y sostiene hábitos saludables en el tiempo (más de 6 meses). Integra el nuevo comportamiento en su estilo de vida. " +
      "Meta: estabilidad y consolidación; integrar el cambio en el contexto total de la vida y prevenir recurrencia. Planificar estabilización, reforzar hábitos y plan estratégico ante recaídas.",
  },
};
