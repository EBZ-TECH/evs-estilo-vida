import type { InformeDiagnostico, RespuestasEncuesta } from "@/lib/clinica/types";
import { tauriApi, type InformeRegistro } from "@/lib/tauri-api";

export type { InformeRegistro };

export async function listarInformesOrdenados(): Promise<InformeRegistro[]> {
  return tauriApi.listarInformes();
}

export async function guardarInformeEnBiblioteca(
  datos: InformeDiagnostico,
  respuestas?: RespuestasEncuesta
): Promise<InformeRegistro> {
  return tauriApi.guardarInforme(datos, respuestas);
}

export async function obtenerInformePorId(
  id: string
): Promise<InformeRegistro | null> {
  return tauriApi.obtenerInforme(id);
}

export function filtrarPorNombre(
  registros: InformeRegistro[],
  texto: string
): InformeRegistro[] {
  const q = texto.trim().toLowerCase();
  if (!q) return registros;
  return registros.filter((r) => {
    const nombre = r.datos.nombre.toLowerCase();
    const cedula = (r.datos.cedula ?? "").toLowerCase();
    return nombre.includes(q) || cedula.includes(q);
  });
}

export async function eliminarInformePorId(id: string): Promise<boolean> {
  return tauriApi.eliminarInforme(id);
}
