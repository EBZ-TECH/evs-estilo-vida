import { exigirRolServidor } from "@/lib/auth/exigir-rol-servidor";

export default async function InformeLayout({ children }: { children: React.ReactNode }) {
  await exigirRolServidor("profesional", "/informe");
  return children;
}
