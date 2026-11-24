import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { SesionProvider } from "@/lib/sesion";
import { Portada } from "@/pages/Portada";
import { SetupPin } from "@/pages/SetupPin";
import { IngresoPin } from "@/pages/IngresoPin";
import { EncuestaPage } from "@/pages/Encuesta";
import { EncuestaFinalizada } from "@/pages/EncuestaFinalizada";
import { InformePage } from "@/pages/Informe";

export default function App() {
  return (
    <SesionProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Portada />} />
          <Route path="/setup" element={<SetupPin />} />
          <Route path="/ingreso" element={<IngresoPin />} />
          <Route path="/encuesta" element={<EncuestaPage />} />
          <Route path="/encuesta/finalizado" element={<EncuestaFinalizada />} />
          <Route path="/informe" element={<InformePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </SesionProvider>
  );
}
