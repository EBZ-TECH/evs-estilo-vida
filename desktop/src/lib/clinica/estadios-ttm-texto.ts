import type { EstadioCambioCodigo } from "./types";

/** Rango de puntaje por estadio (alineado con ttm.ts). */
export const RANGOS_PUNTAJE: Record<EstadioCambioCodigo, string> = {
  PRECONTEMPLACION: "6 – 13 puntos",
  CONTEMPLACION: "14 puntos",
  PREPARACION: "15 – 20 puntos",
  ACCION: "21 – 26 puntos",
  MANTENIMIENTO: "27 – 30 puntos",
};

/**
 * Orden en el que se muestran los estadios en el informe (de mayor a menor
 * avance, igual que la página 6 del documento original de la encuesta).
 */
export const ORDEN_ESTADIOS_INFORME: EstadioCambioCodigo[] = [
  "MANTENIMIENTO",
  "ACCION",
  "PREPARACION",
  "CONTEMPLACION",
  "PRECONTEMPLACION",
];

/**
 * Texto literal del informe por estadio. Se imprime EXACTAMENTE el del
 * estadio resultante para el evaluado.
 */
export const PAUTAS_POR_ESTADIO: Record<
  EstadioCambioCodigo,
  { titulo: string; parrafos: string[] }
> = {
  MANTENIMIENTO: {
    titulo: "V. Mantenimiento",
    parrafos: [
      "La persona consolida los cambios, previene recaídas y sostiene nuevos hábitos saludables en el tiempo. Sostiene el cambio durante más de 6 meses. Previene recaídas. Integra el nuevo comportamiento en su estilo de vida. El objetivo es la estabilidad y consolidación del cambio. Ha logrado alcanzar un peso saludable y trabaja en conservarlo a través de cuidados y hábitos que les permiten sostener el bienestar logrado.",
      "La meta en esta etapa es que la persona pueda integrar el cambio en el contexto total de su vida y prevenir la recurrencia. Planificar la estabilización. Reforzar hábitos y plan estratégico ante recaídas.",
    ],
  },
  ACCION: {
    titulo: "IV. Acción",
    parrafos: [
      "La persona adopta la alimentación baja en calorías y realiza actividad física para equilibrar el consumo y el gasto energético. En esta etapa, la persona modifica activamente su conducta. Implementa estrategias concretas. El cambio es observable. Se realizan cambios concretos en el estilo de vida y se invierte esfuerzo y tiempo en el proceso.",
      "El plan de acción y de tratamiento establecidos puede chocar con la realidad de la vida cotidiana de la persona. El uso de refuerzo positivo es necesario en los inicios de esta etapa. Las personas en la etapa de acción necesitan que sus nuevas conductas sean reforzadas. Es importante observar micro cambios en la persona como cumplir con el horario y frecuencia de las citas médicas, seguimientos y controles; mejoría en su apariencia física. Es necesario que el profesional de ayuda genere conciencia en la persona de los cambios que está presentando y se promueva el autorefuerzo. Luego de un promedio de tiempo entre tres a seis meses observándose los cambios en la persona. Una vez se establece estos nuevos cambios la persona entra a la próxima etapa.",
    ],
  },
  PREPARACION: {
    titulo: "III. Preparación",
    parrafos: [
      "Existe intención y se planifica un cambio, aunque aún no se ejecuta plenamente. La persona decide acudir a un profesional y elaborar un plan de modificar sus hábitos La persona Decide cambiar en el corto plazo. Comienza a hacer pequeños intentos o planes. Busca información o recursos. Es una fase de intención clara, donde ya existe compromiso inicial.",
      "La meta es establecer un plan de acción eficaz en colaboración con la persona, a implementarse en el futuro inmediato y aumentar el compromiso al cambio. La persona está inmersa en un proceso interno de cambio. Para el profesional de ayuda uno de los retos de esta etapa es el asistir a la persona en el manejo de la baja tolerancia. Establecer fechas es sumamente importante porque implica el compromiso para la acción. Si la persona rechaza establecer fecha o no cumple con lo establecido es indicador de que se movió a la etapa de contemplación. Una vez la persona está en la etapa de preparación, se debe presentar la variedad de alternativas que estén disponibles para manejar su estilo de vida. Junto con la persona es importante analizar las ventajas y desventajas de cada opción, contestar sus dudas y preguntas, ofrecer literatura sobre los programas existentes, discutir la recomendación de evaluación médica y otras posibles opciones. Es importante ayudar a la persona a visualizar el cambio. El profesional de ayuda debe motivar a la persona a realizar afirmaciones que lo ayuden a visualizar el éxito con relación al plan. Realizar seguimiento y acompañamiento al plan establecido.",
    ],
  },
  CONTEMPLACION: {
    titulo: "II. Contemplación",
    parrafos: [
      "La persona comienza a notar ciertas molestias o insatisfacción relacionadas con su peso. Reconoce que tiene un problema y reflexiona sobre él, pero aún no toma acción. Puede permanecer en esta etapa por largo tiempo. Reconoce que existe un problema. Se encuentra en ambivalencia (“quiero cambiar, pero no estoy listo”).",
      "En esta etapa el profesional de ayuda debe normalizar la ambivalencia y asistir a la persona a evaluar el balance decisional mediante: evaluación de las ventajas y desventajas del problema, promover cambio en la motivación extrínseca a intrínseca, evaluación de los valores personales del individuo, énfasis en la libre elección, responsabilidad y autoeficacia de la persona. Debe haber un esfuerzo para extraer planteamientos automotivacionales en cuanto a la intención y compromiso de la persona. La meta es inclinar la balanza decisional a favor del cambio. Esto requiere que el profesional de ayuda mantenga una actitud colaborativa no directiva y que mantenga una escucha reflexiva. el objetivo de aumentar conciencia y comprensión sobre la conducta nociva.",
    ],
  },
  PRECONTEMPLACION: {
    titulo: "I. Precontemplación",
    parrafos: [
      "En esta etapa la que la persona reconoce el exceso de peso, pero no lo percibe como un problema o riesgo, por lo que no busca cambiar su situación. No hay intención de cambiar en el futuro cercano. La persona no reconoce el problema o se encuentra presionada por factores externos No reconoce que existe un problema o minimiza sus consecuencias. No tiene intención de cambiar en el corto plazo. Puede mostrarse resistente o desinteresada. en esta fase hay baja conciencia del problema.",
      "La meta entonces es ayudarlos a entender la existencia de dificultades o problemas, evaluar las consecuencias de su conducta, sin confrontar, juzgar o etiquetar. Esto evita que la persona aumente su nivel de resistencia y acepte dialogar sobre sus preocupaciones. Para lograr esto es necesario crear un ambiente de aceptación, empatía y comprensión en el que la persona pueda explorar sus ideas, emociones, creencias y valores sobre la situación, así como la ambivalencia con relación al cambio. El profesional de ayuda debe tener como meta aumentar la motivación al cambio de la persona; así como aumentar el interés y la esperanza de cambio. Las intervenciones deben focalizar en los procesos internos, el aumento de conciencia, la auto-reevaluación y la reevaluación ambiental.",
    ],
  },
};
