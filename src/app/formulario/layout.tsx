import { exigirRolServidor } from "@/lib/auth/exigir-rol-servidor";

export default async function FormularioLayout({ children }: { children: React.ReactNode }) {
  await exigirRolServidor("formulario", "/formulario");
  return children;
}
