import { invoke } from "@tauri-apps/api/core";
import { getVersion } from "@tauri-apps/api/app";
import type { InformeDiagnostico, RespuestasEncuesta } from "./clinica/types";

export interface InformeRegistro {
  id: string;
  guardadoEn: string;
  datos: InformeDiagnostico;
  respuestas?: RespuestasEncuesta;
}

export interface DatosExportados {
  formato: string;
  version: number;
  exportadoEn: string;
  informes: unknown[];
  configSeguridad: unknown[];
}

export interface EstadisticasImport {
  informesNuevos: number;
  informesOmitidos: number;
  pinImportado: boolean;
}

export const tauriApi = {
  /** Versión de la app empaquetada (coincide con `tauri.conf.json` / `Cargo.toml` en release). */
  appVersion(): Promise<string> {
    return getVersion();
  },

  guardarInforme(
    informe: InformeDiagnostico,
    respuestas?: RespuestasEncuesta
  ): Promise<InformeRegistro> {
    return invoke<InformeRegistro>("guardar_informe", {
      informe,
      respuestas: respuestas ?? null,
    });
  },

  listarInformes(): Promise<InformeRegistro[]> {
    return invoke<InformeRegistro[]>("listar_informes");
  },

  obtenerInforme(id: string): Promise<InformeRegistro | null> {
    return invoke<InformeRegistro | null>("obtener_informe", { id });
  },

  eliminarInforme(id: string): Promise<boolean> {
    return invoke<boolean>("eliminar_informe", { id });
  },

  contarInformes(): Promise<number> {
    return invoke<number>("contar_informes");
  },

  pinExiste(): Promise<boolean> {
    return invoke<boolean>("pin_existe");
  },

  definirPin(pin: string): Promise<void> {
    return invoke<void>("definir_pin", { pin });
  },

  verificarPin(pin: string): Promise<boolean> {
    return invoke<boolean>("verificar_pin", { pin });
  },

  cambiarPin(pinActual: string, pinNuevo: string): Promise<void> {
    return invoke<void>("cambiar_pin", { pinActual, pinNuevo });
  },

  exportarDatos(): Promise<DatosExportados> {
    return invoke<DatosExportados>("exportar_datos");
  },

  /** Abre «Guardar como» nativo; devuelve la ruta si guardó, o `null` si canceló. */
  exportarDatosGuardarDialogo(): Promise<string | null> {
    return invoke<string | null>("exportar_datos_guardar_dialogo");
  },

  importarDatos(datos: DatosExportados): Promise<EstadisticasImport> {
    return invoke<EstadisticasImport>("importar_datos", { datos });
  },
};
