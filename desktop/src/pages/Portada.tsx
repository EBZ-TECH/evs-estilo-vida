import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { tauriApi } from "@/lib/tauri-api";
import { buscarActualizacionEInstalar } from "@/lib/actualizaciones";

function IconClipboard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 4V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconKey({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM4 20.5V11l4-1 5 5-2 2-2-2-2 2v3.5H4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Portada() {
  const navigate = useNavigate();
  const [pinExisteEstado, setPinExisteEstado] = useState<boolean | null>(null);
  const [versionApp, setVersionApp] = useState("");
  const [buscandoActualizacion, setBuscandoActualizacion] = useState(false);

  useEffect(() => {
    let activo = true;
    tauriApi
      .appVersion()
      .then((v) => {
        if (activo) setVersionApp(v);
      })
      .catch(() => {
        if (activo) setVersionApp("");
      });
    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    let activo = true;
    tauriApi
      .pinExiste()
      .then((v) => {
        if (activo) setPinExisteEstado(v);
      })
      .catch(() => {
        if (activo) setPinExisteEstado(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  function irProfesional() {
    if (pinExisteEstado === false) {
      navigate("/setup");
    } else {
      navigate("/ingreso");
    }
  }

  async function onBuscarActualizacion() {
    if (buscandoActualizacion) return;
    setBuscandoActualizacion(true);
    try {
      await buscarActualizacionEInstalar();
    } finally {
      setBuscandoActualizacion(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% -15%, rgb(100 116 139 / 0.2), transparent 50%), radial-gradient(ellipse 60% 45% at 0% 100%, rgb(15 118 110 / 0.1), transparent 45%), radial-gradient(ellipse 50% 40% at 100% 80%, rgb(30 64 175 / 0.08), transparent 40%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-800">
            EVS Clínico
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Evaluación de Determinantes de Estilos de vida y Estado de Cambio
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-600">
            Aplicación de escritorio para registrar la encuesta clínica y consultar el informe
            diagnóstico. Toda la información se almacena en este equipo.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/encuesta")}
            className="group relative overflow-hidden rounded-2xl border border-teal-200/80 bg-white p-7 text-left shadow-xl shadow-teal-900/5 ring-1 ring-teal-900/5 transition hover:border-teal-300 hover:shadow-2xl"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/25">
              <IconClipboard className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-zinc-900">Iniciar encuesta</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Cuestionario estructurado para registrar factores de riesgo en los determinantes
              de los estilos de vida y estadio de cambio motivacional, de forma que el equipo
              de salud laboral disponga de un informe que oriente un plan de mejora para su
              estado de salud.
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-teal-700 group-hover:text-teal-800">
              Comenzar →
            </span>
          </button>

          <button
            type="button"
            onClick={irProfesional}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 text-left shadow-xl shadow-zinc-900/5 transition hover:border-zinc-300 hover:shadow-2xl"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm">
              <IconKey className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-zinc-900">Acceso profesional</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Consultar la biblioteca de informes diagnósticos. Requiere PIN configurado en este
              equipo.
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-zinc-800 group-hover:text-black">
              {pinExisteEstado === false ? "Configurar PIN →" : "Ingresar PIN →"}
            </span>
          </button>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-[11px] leading-relaxed text-zinc-500">
          Aplicación local: la base de datos y los informes se guardan únicamente en este
          dispositivo.
        </p>
        <div className="mx-auto mt-4 flex max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {versionApp ? (
            <p className="text-center text-[11px] text-zinc-500">Versión instalada: {versionApp}</p>
          ) : null}
          <button
            type="button"
            onClick={() => void onBuscarActualizacion()}
            disabled={buscandoActualizacion}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[11px] font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50 disabled:opacity-60"
          >
            {buscandoActualizacion ? "Comprobando actualización…" : "Buscar actualización"}
          </button>
        </div>
        <p className="mx-auto mt-3 max-w-xl text-center text-[11px] text-zinc-400">
          Michael Lozada — Ing en TIC — EBZ
        </p>
      </div>
    </div>
  );
}
