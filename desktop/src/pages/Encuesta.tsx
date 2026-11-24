import { useNavigate } from "react-router-dom";
import { EncuestaWizard } from "@/components/EncuestaWizard";

export function EncuestaPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
        >
          ← Inicio
        </button>
        <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          EVS Clínico
        </span>
      </div>
      <EncuestaWizard />
    </div>
  );
}
