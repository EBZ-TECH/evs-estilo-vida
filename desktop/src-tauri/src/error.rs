use serde::{Serialize, Serializer};

#[derive(Debug)]
pub enum AppError {
    Db(String),
    Io(String),
    Hash(String),
    Validacion(String),
    PinIncorrecto,
    PinNoConfigurado,
    Estado(String),
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AppError::Db(m) => write!(f, "Error de base de datos: {m}"),
            AppError::Io(m) => write!(f, "Error de E/S: {m}"),
            AppError::Hash(m) => write!(f, "Error criptográfico: {m}"),
            AppError::Validacion(m) => write!(f, "Validación: {m}"),
            AppError::PinIncorrecto => write!(f, "PIN incorrecto"),
            AppError::PinNoConfigurado => write!(f, "PIN no configurado"),
            AppError::Estado(m) => write!(f, "Estado de aplicación: {m}"),
        }
    }
}

impl std::error::Error for AppError {}

impl From<rusqlite::Error> for AppError {
    fn from(e: rusqlite::Error) -> Self {
        AppError::Db(e.to_string())
    }
}

impl From<std::io::Error> for AppError {
    fn from(e: std::io::Error) -> Self {
        AppError::Io(e.to_string())
    }
}

impl From<serde_json::Error> for AppError {
    fn from(e: serde_json::Error) -> Self {
        AppError::Db(format!("JSON: {e}"))
    }
}

impl From<argon2::password_hash::Error> for AppError {
    fn from(e: argon2::password_hash::Error) -> Self {
        AppError::Hash(e.to_string())
    }
}

impl Serialize for AppError {
    fn serialize<S>(&self, ser: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        ser.serialize_str(&self.to_string())
    }
}

pub type AppResult<T> = std::result::Result<T, AppError>;
