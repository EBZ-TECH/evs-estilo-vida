// Smoke test de la app de escritorio EVS Clínico.
// 1) Borra el dir de datos (estado limpio).
// 2) Arranca el binario release brevemente para que cree la BD.
// 3) Lo cierra.
// 4) Inserta un PIN, un informe, listalo, eliminalo, valida la persistencia
//    abriendo la BD una segunda vez.
//
// Uso: node scripts/smoke-test.mjs

import { DatabaseSync } from "node:sqlite";
import { spawn } from "node:child_process";
import { mkdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { setTimeout as sleep } from "node:timers/promises";

const APPDATA = process.env.APPDATA;
if (!APPDATA) {
  console.error("APPDATA no definido");
  process.exit(1);
}

const APP_DIR = join(APPDATA, "com.ebztec.evs");
const DB_FILE = join(APP_DIR, "evs.sqlite");
const EXE = join(
  process.cwd(),
  "src-tauri",
  "target",
  "release",
  "evs-clinico.exe"
);

function log(msg) {
  console.log(`[smoke] ${msg}`);
}

function fail(msg) {
  console.error(`[smoke][ERROR] ${msg}`);
  process.exit(1);
}

async function main() {
  if (!existsSync(EXE)) {
    fail(`No existe el ejecutable: ${EXE}`);
  }

  log(`Limpiando dir de datos: ${APP_DIR}`);
  try {
    rmSync(APP_DIR, { recursive: true, force: true });
  } catch {}
  mkdirSync(APP_DIR, { recursive: true });

  log("1) Lanzando app por 4s para que inicialice SQLite...");
  const child = spawn(EXE, [], { stdio: "ignore", detached: false });
  await sleep(4000);
  log(`   matando PID ${child.pid}`);
  child.kill();
  await sleep(500);

  if (!existsSync(DB_FILE)) {
    fail(`SQLite no se creó en: ${DB_FILE}`);
  }
  log(`   BD creada: ${DB_FILE}`);

  log("2) Verificando esquema...");
  let db = new DatabaseSync(DB_FILE);
  const tablas = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    )
    .all()
    .map((r) => r.name);
  log(`   tablas: ${tablas.join(", ")}`);
  for (const t of ["informes", "config_seguridad"]) {
    if (!tablas.includes(t)) fail(`Falta tabla '${t}'`);
  }

  log("3) Insertando informe de prueba directamente...");
  const informeJson = JSON.stringify({
    nombre: "Paciente Smoke",
    edad: "42",
    medicion: { valorImc: 24.1, etiquetaImc: "Peso normal", pesoKg: 70, tallaM: 1.7 },
    hallazgos: [],
    estadio: { codigo: "ACCION", tituloInforme: "Acción", puntajeTotal: 22, pautasProfesional: "..." },
    versionInstrumento: "smoke-test-v1",
  });
  db.prepare(
    `INSERT INTO informes (id, guardado_en, nombre, edad, valor_imc, etiqueta_imc,
      estadio_codigo, estadio_titulo, version_instrumento, informe_json, respuestas_json)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`
  ).run(
    "smoke-1",
    new Date().toISOString(),
    "Paciente Smoke",
    "42",
    24.1,
    "Peso normal",
    "ACCION",
    "Acción",
    "smoke-test-v1",
    informeJson,
    null
  );

  const count1 = db.prepare("SELECT COUNT(*) AS n FROM informes").get().n;
  log(`   informes en BD: ${count1}`);
  if (count1 !== 1) fail("Esperaba 1 informe");

  db.close();

  log("4) Reabriendo BD para validar persistencia...");
  db = new DatabaseSync(DB_FILE);
  const recuperado = db.prepare("SELECT nombre, valor_imc FROM informes WHERE id = ?").get("smoke-1");
  log(`   recuperado: ${JSON.stringify(recuperado)}`);
  if (!recuperado || recuperado.nombre !== "Paciente Smoke" || recuperado.valor_imc !== 24.1) {
    fail("Datos persistidos no coinciden");
  }

  log("5) Eliminando informe...");
  const del = db.prepare("DELETE FROM informes WHERE id = ?").run("smoke-1");
  log(`   filas borradas: ${del.changes}`);
  if (del.changes !== 1) fail("No se eliminó el informe");

  const count2 = db.prepare("SELECT COUNT(*) AS n FROM informes").get().n;
  if (count2 !== 0) fail("La BD no quedó vacía tras borrar");

  db.close();

  log("OK – smoke test completado.");
  log(`   binario:    ${EXE}`);
  log(`   dir datos:  ${APP_DIR}`);
}

main().catch((e) => fail(e?.stack ?? String(e)));
