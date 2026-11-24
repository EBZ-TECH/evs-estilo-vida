import { Navigate } from "react-router-dom";
import { InformesProfesionalApp } from "@/components/informes/InformesProfesionalApp";
import { useSesion } from "@/lib/sesion";

export function InformePage() {
  const sesion = useSesion();
  if (!sesion.profesional) {
    return <Navigate to="/" replace />;
  }
  return <InformesProfesionalApp onCerrarSesion={sesion.cerrarProfesional} />;
}
