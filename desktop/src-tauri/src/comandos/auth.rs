use argon2::password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString};
use argon2::Argon2;
use chrono::Utc;
use rusqlite::params;
use tauri::State;

use crate::db::DbState;
use crate::error::{AppError, AppResult};

const CLAVE_PIN: &str = "pin_profesional";
const PIN_MIN_LARGO: usize = 4;
const PIN_MAX_LARGO: usize = 32;

fn validar_pin(pin: &str) -> AppResult<()> {
    let pin_t = pin.trim();
    if pin_t.is_empty() {
        return Err(AppError::Validacion(
            "El PIN no puede estar vacío.".into(),
        ));
    }
    if pin.chars().count() < PIN_MIN_LARGO {
        return Err(AppError::Validacion(format!(
            "El PIN debe tener al menos {PIN_MIN_LARGO} caracteres."
        )));
    }
    if pin.chars().count() > PIN_MAX_LARGO {
        return Err(AppError::Validacion(format!(
            "El PIN no puede superar {PIN_MAX_LARGO} caracteres."
        )));
    }
    Ok(())
}

fn hash_pin(pin: &str) -> AppResult<String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let hash = argon2.hash_password(pin.as_bytes(), &salt)?.to_string();
    Ok(hash)
}

fn leer_hash_pin(db: &DbState) -> AppResult<Option<String>> {
    let conn = db.conn.lock();
    let mut stmt = conn.prepare("SELECT valor FROM config_seguridad WHERE clave = ?1")?;
    let r = stmt
        .query_row(params![CLAVE_PIN], |row| row.get::<_, String>(0))
        .ok();
    Ok(r)
}

#[tauri::command]
pub fn pin_existe(db: State<'_, DbState>) -> AppResult<bool> {
    Ok(leer_hash_pin(&db)?.is_some())
}

#[tauri::command]
pub fn definir_pin(db: State<'_, DbState>, pin: String) -> AppResult<()> {
    if leer_hash_pin(&db)?.is_some() {
        return Err(AppError::Estado(
            "Ya existe un PIN configurado. Use 'cambiar_pin' para reemplazarlo.".into(),
        ));
    }
    validar_pin(&pin)?;
    let hash = hash_pin(&pin)?;
    let ahora = Utc::now().to_rfc3339();
    let conn = db.conn.lock();
    conn.execute(
        "INSERT INTO config_seguridad (clave, valor, actualizado_en) VALUES (?1, ?2, ?3)",
        params![CLAVE_PIN, hash, ahora],
    )?;
    Ok(())
}

#[tauri::command]
pub fn verificar_pin(db: State<'_, DbState>, pin: String) -> AppResult<bool> {
    let hash = leer_hash_pin(&db)?.ok_or(AppError::PinNoConfigurado)?;
    let parsed = PasswordHash::new(&hash)?;
    let ok = Argon2::default()
        .verify_password(pin.as_bytes(), &parsed)
        .is_ok();
    Ok(ok)
}

#[tauri::command]
pub fn cambiar_pin(
    db: State<'_, DbState>,
    pin_actual: String,
    pin_nuevo: String,
) -> AppResult<()> {
    let hash = leer_hash_pin(&db)?.ok_or(AppError::PinNoConfigurado)?;
    let parsed = PasswordHash::new(&hash)?;
    if Argon2::default()
        .verify_password(pin_actual.as_bytes(), &parsed)
        .is_err()
    {
        return Err(AppError::PinIncorrecto);
    }
    validar_pin(&pin_nuevo)?;
    let nuevo_hash = hash_pin(&pin_nuevo)?;
    let ahora = Utc::now().to_rfc3339();
    let conn = db.conn.lock();
    conn.execute(
        "UPDATE config_seguridad SET valor = ?1, actualizado_en = ?2 WHERE clave = ?3",
        params![nuevo_hash, ahora, CLAVE_PIN],
    )?;
    Ok(())
}
