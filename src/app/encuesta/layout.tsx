import { exigirRolServidor } from "@/lib/auth/exigir-rol-servidor";

export default async function EncuestaLayout({ children }: { children: React.ReactNode }) {
  await exigirRolServidor("formulario", "/encuesta");
  return children;
}
