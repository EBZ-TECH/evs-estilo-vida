import { redirect } from "next/navigation";

/** Compatibilidad: antes existía un portal intermedio; el flujo actual entra directo en `/informe`. */
export default function ProfesionalLegacyRedirect() {
  redirect("/informe");
}
