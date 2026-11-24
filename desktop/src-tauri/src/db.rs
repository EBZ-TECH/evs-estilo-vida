use parking_lot::Mutex;
use rusqlite::Connection;
use std::path::PathBuf;
use std::sync::Arc;
use tauri::{AppHandle, Manager};

use crate::error::{AppError, AppResult};

/// Estado compartido con la conexión SQLite tras el `setup` de la app.
#[derive(Clone)]
pub struct DbState {
    pub conn: Arc<Mutex<Connection>>,
}

const SCHEMA_INICIAL: &str = include_str!("../migrations/001_init.sql");
const MIGRACION_CEDULA: &str = include_str!("../migrations/002_cedula.sql");

/// Inicializa la BD: resuelve la ruta en `app_data_dir`, crea el archivo si
/// no existe, y aplica las migraciones de forma idempotente.
pub fn inicializar(app: &AppHandle) -> AppResult<DbState> {
    let dir = resolver_dir_datos(app)?;
    std::fs::create_dir_all(&dir)?;
    let ruta = dir.join("evs.sqlite");

    log::info!("BD SQLite en: {}", ruta.display());

    let conn = Connection::open(&ruta)
        .map_err(|e| AppError::Db(format!("abriendo {}: {e}", ruta.display())))?;

    // Modo WAL para mejor durabilidad y concurrencia básica.
    conn.pragma_update(None, "journal_mode", "WAL")
        .map_err(|e| AppError::Db(format!("PRAGMA journal_mode=WAL: {e}")))?;
    conn.pragma_update(None, "foreign_keys", "ON")
        .map_err(|e| AppError::Db(format!("PRAGMA foreign_keys: {e}")))?;

    conn.execute_batch(SCHEMA_INICIAL)
        .map_err(|e| AppError::Db(format!("aplicando migración inicial: {e}")))?;

    aplicar_migracion_cedula(&conn)?;

    Ok(DbState {
        conn: Arc::new(Mutex::new(conn)),
    })
}

/// SQLite no soporta `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, así que
/// comprobamos manualmente si la columna existe antes de aplicar la migración.
fn aplicar_migracion_cedula(conn: &Connection) -> AppResult<()> {
    let mut stmt = conn.prepare("PRAGMA table_info(informes)")?;
    let cols: Vec<String> = stmt
        .query_map([], |row| row.get::<_, String>(1))?
        .filter_map(|r| r.ok())
        .collect();
    if cols.iter().any(|c| c == "cedula") {
        // Igual aseguramos el índice (idempotente).
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_informes_cedula ON informes(cedula)",
            [],
        )?;
        return Ok(());
    }
    conn.execute_batch(MIGRACION_CEDULA)
        .map_err(|e| AppError::Db(format!("aplicando migración cedula: {e}")))?;
    Ok(())
}

fn resolver_dir_datos(app: &AppHandle) -> AppResult<PathBuf> {
    app.path()
        .app_data_dir()
        .map_err(|e| AppError::Io(format!("app_data_dir: {e}")))
}
