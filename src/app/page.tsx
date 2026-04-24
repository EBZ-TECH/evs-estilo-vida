import { Suspense } from "react";
import { LoginPortada } from "@/components/LoginPortada";

function CargandoLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-zinc-500">
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />
        Cargando…
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<CargandoLogin />}>
      <LoginPortada />
    </Suspense>
  );
}
