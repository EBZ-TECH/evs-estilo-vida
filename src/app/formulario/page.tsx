import { Suspense } from "react";
import { FormularioPortalClient } from "@/components/FormularioPortalClient";

function Cargando() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-zinc-500">
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-teal-600/25 border-t-teal-700" />
        Cargando…
      </span>
    </div>
  );
}

export default function FormularioPortalPage() {
  return (
    <Suspense fallback={<Cargando />}>
      <FormularioPortalClient />
    </Suspense>
  );
}
