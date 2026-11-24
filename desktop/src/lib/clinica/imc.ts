import type { CategoriaImc, MedicionAntropometrica } from "./types";

const ETIQUETAS: Record<CategoriaImc, string> = {
  BAJO_PESO: "BAJO PESO",
  PESO_NORMAL: "PESO NORMAL",
  SOBREPESO: "SOBREPESO",
  OBESIDAD_TIPO_I: "OBESIDAD TIPO I",
  OBESIDAD_TIPO_II: "OBESIDAD TIPO II",
  OBESIDAD_MORBIDA: "OBESIDAD MÓRBIDA",
  OBESIDAD_EXTREMA: "OBESIDAD EXTREMA",
};

function clasificarImc(imc: number): CategoriaImc {
  if (imc < 18.5) return "BAJO_PESO";
  if (imc < 25) return "PESO_NORMAL";
  if (imc < 30) return "SOBREPESO";
  if (imc < 35) return "OBESIDAD_TIPO_I";
  if (imc < 40) return "OBESIDAD_TIPO_II";
  if (imc <= 50) return "OBESIDAD_MORBIDA";
  return "OBESIDAD_EXTREMA";
}

/** Acepta coma decimal en talla/peso como string desde formulario. */
export function parseNumeroClinico(val: string | number | undefined): number | null {
  if (val === undefined || val === "") return null;
  if (typeof val === "number" && Number.isFinite(val)) return val;
  const n = String(val).trim().replace(",", ".");
  const x = parseFloat(n);
  return Number.isFinite(x) ? x : null;
}

export function calcularMedicionAntropometrica(
  pesoKg: number,
  tallaM: number
): MedicionAntropometrica | null {
  if (!(pesoKg > 0) || !(tallaM > 0)) return null;
  const valorImc = pesoKg / (tallaM * tallaM);
  const categoriaImc = clasificarImc(valorImc);
  return {
    pesoKg,
    tallaM,
    valorImc: Math.round(valorImc * 10) / 10,
    categoriaImc,
    etiquetaImc: ETIQUETAS[categoriaImc],
  };
}
