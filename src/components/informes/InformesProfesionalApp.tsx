"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  eliminarInformePorId,
  filtrarPorNombre,
  listarInformesOrdenados,
  type InformeRegistro,
} from "@/lib/informes-storage";
import { InformeDetalle } from "./InformeDetalle";
import { VistaRespuestasEncuesta } from "./VistaRespuestasEncuesta";

function IconLista({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6h11M9 12h11M9 18h11M4 6h.5M4 12h.5M4 18h.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBuscar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 20 16.5 16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconCerrar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconSalir({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 17H5V7h5M14 12h7M17 9l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function fechaCorta(iso: string) {
  try {
    return new Date(iso).toLocaleString("es", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function InformesProfesionalApp() {
  const router = useRouter();
  const [lista, setLista] = useState<InformeRegistro[]>([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [seleccionId, setSeleccionId] = useState<string | null>(null);
  const [vistaRespuestasId, setVistaRespuestasId] = useState<string | null>(null);
  const [cerrando, setCerrando] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  const recargar = useCallback(() => {
    setLista(listarInformesOrdenados());
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "evs_informes_registrados") recargar();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [recargar]);

  const filtrados = useMemo(
    () => filtrarPorNombre(lista, filtroNombre),
    [lista, filtroNombre]
  );

  const registroActivo = useMemo(
    () => (seleccionId ? lista.find((r) => r.id === seleccionId) ?? null : null),
    [lista, seleccionId]
  );

  const registroVistaRespuestas = useMemo(
    () =>
      vistaRespuestasId ? lista.find((r) => r.id === vistaRespuestasId) ?? null : null,
    [lista, vistaRespuestasId]
  );

  const enListadoPrincipal = seleccionId === null && vistaRespuestasId === null;

  function irBiblioteca() {
    setSeleccionId(null);
    setVistaRespuestasId(null);
    setFiltroNombre("");
    setMenuMovilAbierto(false);
  }

  function abrirInforme(id: string) {
    setVistaRespuestasId(null);
    setSeleccionId(id);
    setMenuMovilAbierto(false);
  }

  function abrirRespuestas(id: string) {
    setSeleccionId(null);
    setVistaRespuestasId(id);
    setMenuMovilAbierto(false);
  }

  function confirmarEliminar(id: string) {
    if (
      !window.confirm(
        "¿Eliminar este informe de la biblioteca? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }
    eliminarInformePorId(id);
    if (seleccionId === id) setSeleccionId(null);
    if (vistaRespuestasId === id) setVistaRespuestasId(null);
    recargar();
  }

  async function cerrarSesion() {
    setCerrando(true);
    setMenuMovilAbierto(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/");
      router.refresh();
    }
  }

  const navItems = (
    <>
      <button
        type="button"
        onClick={irBiblioteca}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition md:py-2.5 ${
          enListadoPrincipal
            ? "bg-blue-600 text-white shadow-md"
            : "text-slate-200 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <IconLista className="h-5 w-5 shrink-0 opacity-90 md:h-4 md:w-4" />
        Biblioteca de informes
      </button>
      <button
        type="button"
        onClick={cerrarSesion}
        disabled={cerrando}
        className="mt-2 flex w-full items-center gap-3 rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-3 text-left text-sm font-semibold text-slate-100 hover:bg-slate-800 disabled:opacity-50 md:py-2"
      >
        <IconSalir className="h-5 w-5 shrink-0 md:h-4 md:w-4" />
        {cerrando ? "Cerrando…" : "Cerrar sesión"}
      </button>
    </>
  );

  return (
    <div className="flex min-h-screen min-h-[100dvh] bg-slate-100 text-slate-900">
      {/* Panel lateral escritorio */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-800/80 bg-slate-900 text-slate-100 print:hidden md:flex">
        <div className="border-b border-slate-700/80 px-4 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            EVS · Informes
          </p>
          <p className="mt-1 text-sm font-semibold text-white">Dashboard clínico</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">{navItems}</nav>
      </aside>

      {/* Menú móvil tipo cajón */}
      {menuMovilAbierto ? (
        <div
          className="fixed inset-0 z-50 flex md:hidden print:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50 touch-manipulation"
            onClick={() => setMenuMovilAbierto(false)}
            aria-label="Cerrar menú"
          />
          <div className="relative flex h-full w-[min(20rem,88vw)] flex-col bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-4">
              <span className="text-sm font-semibold text-white">Menú</span>
              <button
                type="button"
                onClick={() => setMenuMovilAbierto(false)}
                className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white touch-manipulation"
                aria-label="Cerrar"
              >
                <IconCerrar className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">{navItems}</nav>
          </div>
        </div>
      ) : null}

      <div className="flex min-h-screen min-h-[100dvh] min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-3 py-3 shadow-sm backdrop-blur print:hidden md:px-8 md:py-4">
          <div className="mx-auto flex max-w-5xl items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuMovilAbierto(true)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800 md:hidden touch-manipulation"
              aria-label="Abrir menú"
            >
              <IconMenu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-semibold text-slate-900 md:text-xl">
                {registroActivo
                  ? "Detalle del informe"
                  : registroVistaRespuestas
                    ? "Respuestas de la encuesta"
                    : "Biblioteca de informes"}
              </h1>
              <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500 md:text-sm md:line-clamp-none">
                {registroActivo
                  ? "Revise los bloques clínicos e imprima si necesita archivo."
                  : registroVistaRespuestas
                    ? "Cuestionario tal como fue diligenciado en este navegador."
                    : "Filtre por nombre y abra cada informe desde la lista o las tarjetas."}
              </p>
            </div>
            <div className="hidden shrink-0 items-center gap-2 md:flex">
              <button
                type="button"
                onClick={irBiblioteca}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Listado
              </button>
              <button
                type="button"
                onClick={cerrarSesion}
                disabled={cerrando}
                className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                Salir
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto px-3 py-4 md:px-8 md:py-8">
          <div className="mx-auto max-w-5xl">
            {registroActivo ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
                <InformeDetalle
                  informe={registroActivo.datos}
                  onVolver={() => setSeleccionId(null)}
                  mostrarBarraSesion={false}
                />
              </div>
            ) : registroVistaRespuestas ? (
              <VistaRespuestasEncuesta
                registro={registroVistaRespuestas}
                onVolver={() => setVistaRespuestasId(null)}
              />
            ) : (
              <>
                <div className="mb-4 grid gap-3 sm:mb-6 sm:grid-cols-3 sm:gap-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Total en biblioteca
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{lista.length}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Filtro por nombre
                    </p>
                    <div className="relative mt-2">
                      <IconBuscar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="search"
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                        placeholder="Nombre del evaluado…"
                        className="min-h-11 w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-base text-slate-900 outline-none ring-2 ring-transparent focus:border-blue-300 focus:bg-white focus:ring-blue-200/50 md:text-sm"
                        autoComplete="off"
                        enterKeyHint="search"
                      />
                    </div>
                    {filtroNombre.trim() ? (
                      <p className="mt-2 text-xs text-slate-500">
                        Mostrando {filtrados.length} de {lista.length} registros
                      </p>
                    ) : null}
                  </div>
                </div>

                {lista.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-4 py-12 text-center shadow-sm sm:px-6 sm:py-16">
                    <p className="text-sm font-medium text-slate-800">Aún no hay informes</p>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                      Cuando la cuenta <strong>formulario</strong> complete una encuesta en este
                      navegador, los informes aparecerán aquí.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Tarjetas: móvil y tablet pequeña */}
                    <div className="space-y-3 md:hidden">
                      {filtrados.map((r) => (
                        <div
                          key={r.id}
                          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Fecha
                          </p>
                          <p className="text-sm text-slate-800">{fechaCorta(r.guardadoEn)}</p>
                          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                            Nombre
                          </p>
                          <p className="text-base font-semibold text-slate-900">{r.datos.nombre}</p>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-slate-500">Edad</span>
                              <p className="font-medium text-slate-800">{r.datos.edad}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">IMC</span>
                              <p className="font-medium text-slate-800">
                                {r.datos.medicion?.valorImc ?? "—"}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-slate-500">Clasificación</span>
                              <p className="font-medium text-slate-800">
                                {r.datos.medicion?.etiquetaImc ?? "—"}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-slate-500">Estadio</span>
                              <p className="text-sm font-medium leading-snug text-slate-800">
                                {r.datos.estadio.tituloInforme}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
                            <button
                              type="button"
                              onClick={() => abrirInforme(r.id)}
                              className="flex min-h-11 items-center justify-center rounded-xl bg-blue-900 px-1 text-[11px] font-semibold text-white touch-manipulation active:bg-blue-950 sm:px-2 sm:text-sm"
                            >
                              Ver informe
                            </button>
                            <button
                              type="button"
                              onClick={() => abrirRespuestas(r.id)}
                              className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-1 text-[11px] font-semibold text-slate-800 shadow-sm touch-manipulation hover:bg-slate-50 sm:px-2 sm:text-sm"
                            >
                              Ver respuestas
                            </button>
                            <button
                              type="button"
                              onClick={() => confirmarEliminar(r.id)}
                              className="flex min-h-11 items-center justify-center rounded-xl border border-rose-300 bg-white px-1 text-[11px] font-semibold text-rose-800 touch-manipulation hover:bg-rose-50 sm:px-2 sm:text-sm"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tabla: escritorio */}
                    <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                            <tr>
                              <th className="px-4 py-3">Fecha</th>
                              <th className="px-4 py-3">Nombre</th>
                              <th className="px-4 py-3">Edad</th>
                              <th className="px-4 py-3">IMC</th>
                              <th className="px-4 py-3">Clasificación</th>
                              <th className="px-4 py-3">Estadio</th>
                              <th className="px-4 py-3 text-right">Acción</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filtrados.map((r) => (
                              <tr key={r.id} className="hover:bg-slate-50/80">
                                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                                  {fechaCorta(r.guardadoEn)}
                                </td>
                                <td className="max-w-[200px] truncate px-4 py-3 font-medium text-slate-900">
                                  {r.datos.nombre}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                  {r.datos.edad}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                  {r.datos.medicion?.valorImc ?? "—"}
                                </td>
                                <td className="max-w-[160px] truncate px-4 py-3 text-slate-700">
                                  {r.datos.medicion?.etiquetaImc ?? "—"}
                                </td>
                                <td className="max-w-[180px] truncate px-4 py-3 text-slate-700">
                                  {r.datos.estadio.tituloInforme}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex flex-wrap justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => abrirInforme(r.id)}
                                      className="rounded-lg bg-blue-900 px-2.5 py-2 text-xs font-semibold text-white hover:bg-blue-950"
                                    >
                                      Ver informe
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => abrirRespuestas(r.id)}
                                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                                    >
                                      Ver respuestas
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => confirmarEliminar(r.id)}
                                      className="rounded-lg border border-rose-300 bg-white px-2.5 py-2 text-xs font-semibold text-rose-800 shadow-sm hover:bg-rose-50"
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {filtrados.length === 0 && lista.length > 0 ? (
                      <p className="mt-4 rounded-xl border border-slate-200 bg-amber-50 px-4 py-4 text-center text-sm text-amber-950">
                        Ningún resultado coincide con el filtro. Pruebe con otra parte del nombre.
                      </p>
                    ) : null}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
