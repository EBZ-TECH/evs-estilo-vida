use chrono::{Datelike, Timelike, Utc};
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, State};
use tauri_plugin_dialog::DialogExt;

use crate::db::DbState;
use crate::error::{AppError, AppResult};

const FORMATO: &str = "EVS-CLINICO-BACKUP";
const FORMATO_VERSION: u32 = 1;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InformeBackup {
    pub id: String,
    pub guardado_en: String,
    pub nombre: String,
    #[serde(default)]
    pub cedula: Option<String>,
    #[serde(default)]
    pub edad: Option<String>,
    #[serde(default)]
    pub valor_imc: Option<f64>,
    #[serde(default)]
    pub etiqueta_imc: Option<String>,
    #[serde(default)]
    pub estadio_codigo: Option<String>,
    #[serde(default)]
    pub estadio_titulo: Option<String>,
    pub version_instrumento: String,
    pub informe_json: String,
    #[serde(default)]
    pub respuestas_json: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConfigSeguridadBackup {
    pub clave: String,
    pub valor: String,
    pub actualizado_en: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DatosExportados {
    pub formato: String,
    pub version: u32,
    pub exportado_en: String,
    pub informes: Vec<InformeBackup>,
    #[serde(default)]
    pub config_seguridad: Vec<ConfigSeguridadBackup>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EstadisticasImport {
    pub informes_nuevos: usize,
    pub informes_omitidos: usize,
    pub pin_importado: bool,
}

fn recopilar_exportacion(conn: &Connection) -> AppResult<DatosExportados> {
    let mut stmt = conn.prepare(
        "SELECT id, guardado_en, nombre, cedula, edad, valor_imc, etiqueta_imc,
                estadio_codigo, estadio_titulo, version_instrumento,
                informe_json, respuestas_json
         FROM informes
         ORDER BY guardado_en DESC",
    )?;
    let filas = stmt.query_map([], |row| {
        Ok(InformeBackup {
            id: row.get(0)?,
            guardado_en: row.get(1)?,
            nombre: row.get(2)?,
            cedula: row.get(3)?,
            edad: row.get(4)?,
            valor_imc: row.get(5)?,
            etiqueta_imc: row.get(6)?,
            estadio_codigo: row.get(7)?,
            estadio_titulo: row.get(8)?,
            version_instrumento: row.get(9)?,
            informe_json: row.get(10)?,
            respuestas_json: row.get(11)?,
        })
    })?;
    let informes: Vec<InformeBackup> = filas.collect::<Result<_, _>>()?;

    let mut stmt2 = conn.prepare("SELECT clave, valor, actualizado_en FROM config_seguridad")?;
    let cfg_filas = stmt2.query_map([], |row| {
        Ok(ConfigSeguridadBackup {
            clave: row.get(0)?,
            valor: row.get(1)?,
            actualizado_en: row.get(2)?,
        })
    })?;
    let config_seguridad: Vec<ConfigSeguridadBackup> = cfg_filas.collect::<Result<_, _>>()?;

    Ok(DatosExportados {
        formato: FORMATO.into(),
        version: FORMATO_VERSION,
        exportado_en: Utc::now().to_rfc3339(),
        informes,
        config_seguridad,
    })
}

#[tauri::command]
pub fn exportar_datos(db: State<'_, DbState>) -> AppResult<DatosExportados> {
    let conn = db.conn.lock();
    recopilar_exportacion(&conn)
}

/// Abre el cuadro «Guardar como» del sistema y escribe el JSON de respaldo en la ruta elegida.
/// Devuelve `None` si el usuario cancela, o la ruta del archivo guardado.
#[tauri::command]
pub async fn exportar_datos_guardar_dialogo(
    app: AppHandle,
    db: State<'_, DbState>,
) -> AppResult<Option<String>> {
    let datos = {
        let conn = db.conn.lock();
        recopilar_exportacion(&conn)?
    };
    let json = serde_json::to_string_pretty(&datos)
        .map_err(|e| AppError::Db(format!("serializar exportación: {e}")))?;

    let ahora = Utc::now();
    let default_name = format!(
        "evs-clinico-respaldo-{:04}{:02}{:02}-{:02}{:02}.json",
        ahora.year(),
        ahora.month(),
        ahora.day(),
        ahora.hour(),
        ahora.minute()
    );

    let path_opt = app
        .dialog()
        .file()
        .set_title("Guardar copia de seguridad de EVS Clínico")
        .add_filter("Copia EVS (JSON)", &["json"])
        .set_file_name(&default_name)
        .blocking_save_file();

    let Some(file_path) = path_opt else {
        return Ok(None);
    };

    let path = file_path.as_path().ok_or_else(|| {
        AppError::Io(
            "No se pudo obtener la ruta del archivo seleccionado (URI no compatible)."
                .into(),
        )
    })?;

    std::fs::write(path, json.as_bytes()).map_err(|e| AppError::Io(e.to_string()))?;

    Ok(Some(path.to_string_lossy().into_owned()))
}

#[tauri::command]
pub fn importar_datos(
    db: State<'_, DbState>,
    datos: DatosExportados,
) -> AppResult<EstadisticasImport> {
    if datos.formato != FORMATO {
        return Err(AppError::Validacion(
            "El archivo no parece ser una copia de seguridad de EVS Clínico.".into(),
        ));
    }
    if datos.version > FORMATO_VERSION {
        return Err(AppError::Validacion(format!(
            "La copia es de una versión más reciente (v{}). Actualice la aplicación antes de importar.",
            datos.version
        )));
    }

    let mut conn = db.conn.lock();
    let tx = conn.transaction()?;

    let mut informes_nuevos = 0usize;
    let mut informes_omitidos = 0usize;
    for inf in &datos.informes {
        let n = tx.execute(
            "INSERT OR IGNORE INTO informes (
                id, guardado_en, nombre, cedula, edad, valor_imc, etiqueta_imc,
                estadio_codigo, estadio_titulo, version_instrumento,
                informe_json, respuestas_json
             ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
            params![
                inf.id,
                inf.guardado_en,
                inf.nombre,
                inf.cedula,
                inf.edad,
                inf.valor_imc,
                inf.etiqueta_imc,
                inf.estadio_codigo,
                inf.estadio_titulo,
                inf.version_instrumento,
                inf.informe_json,
                inf.respuestas_json,
            ],
        )?;
        if n == 1 {
            informes_nuevos += 1;
        } else {
            informes_omitidos += 1;
        }
    }

    let cfg_existente: i64 = tx
        .query_row("SELECT COUNT(*) FROM config_seguridad", [], |row| row.get(0))
        .unwrap_or(0);
    let mut pin_importado = false;
    if cfg_existente == 0 {
        for cfg in &datos.config_seguridad {
            tx.execute(
                "INSERT OR IGNORE INTO config_seguridad (clave, valor, actualizado_en)
                 VALUES (?1, ?2, ?3)",
                params![cfg.clave, cfg.valor, cfg.actualizado_en],
            )?;
            if cfg.clave == "pin_profesional" {
                pin_importado = true;
            }
        }
    }

    tx.commit()?;

    Ok(EstadisticasImport {
        informes_nuevos,
        informes_omitidos,
        pin_importado,
    })
}
