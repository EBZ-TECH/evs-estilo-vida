import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface SesionCtx {
  profesional: boolean;
  iniciarProfesional: () => void;
  cerrarProfesional: () => void;
}

const Ctx = createContext<SesionCtx | null>(null);

export function SesionProvider({ children }: { children: ReactNode }) {
  const [profesional, setProfesional] = useState(false);
  const valor = useMemo<SesionCtx>(
    () => ({
      profesional,
      iniciarProfesional: () => setProfesional(true),
      cerrarProfesional: () => setProfesional(false),
    }),
    [profesional]
  );
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useSesion(): SesionCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSesion debe usarse dentro de <SesionProvider>");
  return v;
}
