/**
 * Validación rápida de hallazgos y categorías del informe.
 * Uso: node scripts/validar-hallazgos.mjs
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const riesgosSrc = readFileSync(
  join(__dirname, "../src/lib/clinica/riesgos.ts"),
  "utf8"
);
const categoriasSrc = readFileSync(
  join(__dirname, "../src/lib/clinica/categorias-riesgo-informe.ts"),
  "utf8"
);

const codigosEsperados = [
  "cdv_espacios_af",
  "cdv_dinero_alimentos",
  "cdv_apoyo_familiar",
  "cdv_predom_rapida",
  "cdv_predom_ultra",
  "cdv_sin_patron",
  "cdv_habitos_fam",
  "ss_programa_rcv",
  "bio_antecedentes",
  "bio_tiroides",
  "bio_metabolico",
  "bio_hormonal",
  "bio_microbiota",
  "bio_sueno",
  "conduct_q13",
  "conduct_q14",
  "conduct_q15",
  "conduct_q16",
  "conduct_q17",
  "creencias_peso_no_afecta",
  "creencias_peso_no_enfermedad",
  "psico_estres_q19",
  "psico_estres_q20",
  "psico_estres_q21",
  "psico_ansiedad_q22",
  "psico_ansiedad_q23",
  "psico_ansiedad_q24",
  "psico_depresion_q25a",
  "psico_depresion_q25b",
  "psico_depresion_q25c",
];

const codigosLegacy = [
  "consumo_emocional_conductas_adictivas",
  "creencias_peso_cognitivo",
  "psico_estres",
  "psico_ansiedad",
  "psico_depresion",
];

let ok = true;
for (const codigo of codigosEsperados) {
  if (!riesgosSrc.includes(`"${codigo}"`)) {
    console.error(`[FAIL] Falta código de hallazgo en riesgos.ts: ${codigo}`);
    ok = false;
  }
  if (!categoriasSrc.includes(`${codigo}:`)) {
    console.error(`[FAIL] Falta mapeo de categoría para: ${codigo}`);
    ok = false;
  }
}

for (const codigo of codigosLegacy) {
  if (!categoriasSrc.includes(`${codigo}:`)) {
    console.error(`[FAIL] Falta mapeo legacy para: ${codigo}`);
    ok = false;
  }
}

if (riesgosSrc.includes("consumo_emocional_conductas_adictivas") &&
    riesgosSrc.includes('"conduct_q13"')) {
  // OK: legacy solo en categorías, nuevos códigos en riesgos
} else if (riesgosSrc.includes("consumo_emocional_conductas_adictivas")) {
  console.error("[FAIL] Aún se genera el hallazgo agrupado consumo_emocional_conductas_adictivas");
  ok = false;
}

if (ok) {
  console.log(
    `[OK] Matriz de hallazgos por ítem (${codigosEsperados.length} códigos) + ${codigosLegacy.length} legacy.`
  );
} else {
  process.exit(1);
}
