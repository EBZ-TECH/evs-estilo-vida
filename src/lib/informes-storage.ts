import type { InformeDiagnostico, RespuestasEncuesta } from "@/lib/clinica/types";

const LIST_KEY = "evs_informes_registrados";
const LEGACY_SESSION_KEY = "informe_clinico_ultimo";

export interface InformeRegistro {
  id: string;
  guardadoEn: string;
  datos: InformeDiagnostico;
  /** Captura de la encuesta; informes antiguos pueden no incluirla */
  respuestas?: RespuestasEncuesta;
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readList(): InformeRegistro[] {
  if (typeof window === "undefined") return [];
  const parsed = safeParse<InformeRegistro[]>(localStorage.getItem(LIST_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

function writeList(items: InformeRegistro[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LIST_KEY, JSON.stringify(items));
}

/** Si solo existía el último informe en sessionStorage, lo copia una vez a la biblioteca. */
function migrarDesdeSessionSiAplica() {
  if (typeof window === "undefined") return;
  const lista = readList();
  if (lista.length > 0) return;
  const raw = sessionStorage.getItem(LEGACY_SESSION_KEY);
  if (!raw) return;
  const datos = safeParse<InformeDiagnostico>(raw);
  if (!datos) return;
  const registro: InformeRegistro = {
    id: crypto.randomUUID(),
    guardadoEn: new Date().toISOString(),
    datos,
  };
  writeList([registro]);
}

export function listarInformesOrdenados(): InformeRegistro[] {
  migrarDesdeSessionSiAplica();
  return readList().sort(
    (a, b) => new Date(b.guardadoEn).getTime() - new Date(a.guardadoEn).getTime()
  );
}

export function guardarInformeEnBiblioteca(
  datos: InformeDiagnostico,
  respuestas?: RespuestasEncuesta
): InformeRegistro {
  migrarDesdeSessionSiAplica();
  const registro: InformeRegistro = {
    id: crypto.randomUUID(),
    guardadoEn: new Date().toISOString(),
    datos,
    ...(respuestas && Object.keys(respuestas).length > 0 ? { respuestas } : {}),
  };
  const next = [registro, ...readList()];
  writeList(next);
  try {
    sessionStorage.setItem(LEGACY_SESSION_KEY, JSON.stringify(datos));
  } catch {
    /* ignore */
  }
  return registro;
}

export function obtenerInformePorId(id: string): InformeRegistro | null {
  return listarInformesOrdenados().find((r) => r.id === id) ?? null;
}

export function filtrarPorNombre(registros: InformeRegistro[], texto: string): InformeRegistro[] {
  const q = texto.trim().toLowerCase();
  if (!q) return registros;
  return registros.filter((r) => r.datos.nombre.toLowerCase().includes(q));
}

/** Quita un registro por id. Si la biblioteca queda vacía, limpia también el legacy en sessionStorage. */
export function eliminarInformePorId(id: string): boolean {
  if (typeof window === "undefined") return false;
  migrarDesdeSessionSiAplica();
  const lista = readList();
  const next = lista.filter((r) => r.id !== id);
  if (next.length === lista.length) return false;
  writeList(next);
  if (next.length === 0) {
    try {
      sessionStorage.removeItem(LEGACY_SESSION_KEY);
    } catch {
      /* ignore */
    }
  }
  return true;
}
