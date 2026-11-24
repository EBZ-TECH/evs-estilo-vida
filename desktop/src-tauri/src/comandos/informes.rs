use chrono::Utc;
use rusqlite::params;
use tauri::State;
use uuid::Uuid;

use crate::db::DbState;
use crate::error::{AppError, AppResult};
use crate::modelo::{
    CamposIndexados, InformeDiagnostico, InformeRegistro, RespuestasEncuesta,
};

/// Inserta un nuevo informe en la biblioteca y devuelve el registro completo.
#[tauri::command]
pub fn guardar_informe(
    db: State<'_, DbState>,
    informe: InformeDiagnostico,
    respuestas: Option<RespuestasEncuesta>,
) -> AppResult<InformeRegistro> {
    let id = Uuid::new_v4().to_string();
    let guardado_en = Utc::now().to_rfc3339();
    let campos = CamposIndexados::extraer(&informe, &respuestas);

    let informe_json = serde_json::to_string(&informe.0)?;
    let respuestas_json = match &respuestas {
        Some(r) if !r.0.is_null() => Some(serde_json::to_string(&r.0)?),
        _ => None,
    };

    let conn = db.conn.lock();
    conn.execute(
        "INSERT INTO informes (
            id, guardado_en, nombre, cedula, edad, valor_imc, etiqueta_imc,
            estadio_codigo, estadio_titulo, version_instrumento,
            informe_json, respuestas_json
         ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
        params![
            id,
            guardado_en,
            campos.nombre,
            campos.cedula,
            campos.edad,
            campos.valor_imc,
            campos.etiqueta_imc,
            campos.estadio_codigo,
            campos.estadio_titulo,
            campos.version_instrumento,
            informe_json,
            respuestas_json,
        ],
    )?;

    Ok(InformeRegistro {
        id,
        guardado_en,
        datos: informe,
        respuestas,
    })
}

#[tauri::command]
pub fn listar_informes(db: State<'_, DbState>) -> AppResult<Vec<InformeRegistro>> {
    let conn = db.conn.lock();
    let mut stmt = conn.prepare(
        "SELECT id, guardado_en, informe_json, respuestas_json
         FROM informes
         ORDER BY guardado_en DESC",
    )?;

    let filas = stmt.query_map([], |row| {
        let id: String = row.get(0)?;
        let guardado_en: String = row.get(1)?;
        let informe_json: String = row.get(2)?;
        let respuestas_json: Option<String> = row.get(3)?;
        Ok((id, guardado_en, informe_json, respuestas_json))
    })?;

    let mut out = Vec::new();
    for fila in filas {
        let (id, guardado_en, informe_json, respuestas_json) = fila?;
        let datos: serde_json::Value = serde_json::from_str(&informe_json)?;
        let respuestas = match respuestas_json {
            Some(s) => Some(RespuestasEncuesta(serde_json::from_str(&s)?)),
            None => None,
        };
        out.push(InformeRegistro {
            id,
            guardado_en,
            datos: InformeDiagnostico(datos),
            respuestas,
        });
    }
    Ok(out)
}

#[tauri::command]
pub fn obtener_informe(
    db: State<'_, DbState>,
    id: String,
) -> AppResult<Option<InformeRegistro>> {
    let conn = db.conn.lock();
    let mut stmt = conn.prepare(
        "SELECT id, guardado_en, informe_json, respuestas_json
         FROM informes
         WHERE id = ?1",
    )?;

    let fila = stmt
        .query_row(params![id], |row| {
            let id: String = row.get(0)?;
            let guardado_en: String = row.get(1)?;
            let informe_json: String = row.get(2)?;
            let respuestas_json: Option<String> = row.get(3)?;
            Ok((id, guardado_en, informe_json, respuestas_json))
        })
        .ok();

    match fila {
        Some((id, guardado_en, informe_json, respuestas_json)) => {
            let datos: serde_json::Value = serde_json::from_str(&informe_json)?;
            let respuestas = match respuestas_json {
                Some(s) => Some(RespuestasEncuesta(serde_json::from_str(&s)?)),
                None => None,
            };
            Ok(Some(InformeRegistro {
                id,
                guardado_en,
                datos: InformeDiagnostico(datos),
                respuestas,
            }))
        }
        None => Ok(None),
    }
}

#[tauri::command]
pub fn eliminar_informe(db: State<'_, DbState>, id: String) -> AppResult<bool> {
    let conn = db.conn.lock();
    let n = conn.execute("DELETE FROM informes WHERE id = ?1", params![id])?;
    Ok(n > 0)
}

#[tauri::command]
pub fn contar_informes(db: State<'_, DbState>) -> AppResult<i64> {
    let conn = db.conn.lock();
    let n: i64 = conn
        .query_row("SELECT COUNT(*) FROM informes", [], |row| row.get(0))
        .map_err(|e| AppError::Db(e.to_string()))?;
    Ok(n)
}
