export type CategoriaImc =
  | "BAJO_PESO"
  | "PESO_NORMAL"
  | "SOBREPESO"
  | "OBESIDAD_TIPO_I"
  | "OBESIDAD_TIPO_II"
  | "OBESIDAD_MORBIDA"
  | "OBESIDAD_EXTREMA";

export type EstadioCambioCodigo =
  | "PRECONTEMPLACION"
  | "CONTEMPLACION"
  | "PREPARACION"
  | "ACCION"
  | "MANTENIMIENTO";

export interface MedicionAntropometrica {
  pesoKg: number;
  tallaM: number;
  valorImc: number;
  categoriaImc: CategoriaImc;
  etiquetaImc: string;
}

export interface HallazgoRiesgo {
  codigo: string;
  textoInforme: string;
  dimension:
    | "condiciones_vida"
    | "sistema_salud"
    | "biologicos"
    | "conductual_cognitivo"
    | "psicoemocional_estres"
    | "psicoemocional_ansiedad"
    | "psicoemocional_depresion";
}

export interface ClasificacionEstadioCambio {
  codigo: EstadioCambioCodigo;
  tituloInforme: string;
  puntajeTotal: number;
  pautasProfesional: string;
}

export interface InformeDiagnostico {
  nombre: string;
  edad: string;
  medicion: MedicionAntropometrica | null;
  hallazgos: HallazgoRiesgo[];
  estadio: ClasificacionEstadioCambio;
  versionInstrumento: string;
}

export type RespuestasEncuesta = Record<string, string | number | undefined>;
