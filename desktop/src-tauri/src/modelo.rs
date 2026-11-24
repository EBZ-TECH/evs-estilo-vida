use serde::{Deserialize, Serialize};
use serde_json::Value;

/// Snapshot calculado del informe diagnóstico (estructura espejo de la
/// interfaz `InformeDiagnostico` del frontend, en camelCase).
///
/// Como la app de escritorio simplemente persiste el JSON tal cual lo manda
/// el frontend (donde vive la lógica clínica), aquí lo tratamos como un
/// `serde_json::Value` para no acoplarnos a cada campo del cuestionario.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InformeDiagnostico(pub Value);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RespuestasEncuesta(pub Value);

/// Registro tal como se devuelve al frontend (compatible con la interfaz
/// `InformeRegistro` que usaba localStorage).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InformeRegistro {
    pub id: String,
    pub guardado_en: String,
    pub datos: InformeDiagnostico,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub respuestas: Option<RespuestasEncuesta>,
}

/// Campos extraídos del JSON del informe que conviene tener desnormalizados
/// para listar/filtrar sin parsear el JSON completo.
#[derive(Debug, Default)]
pub struct CamposIndexados {
    pub nombre: String,
    pub cedula: Option<String>,
    pub edad: Option<String>,
    pub valor_imc: Option<f64>,
    pub etiqueta_imc: Option<String>,
    pub estadio_codigo: Option<String>,
    pub estadio_titulo: Option<String>,
    pub version_instrumento: String,
}

impl CamposIndexados {
    pub fn extraer(
        informe: &InformeDiagnostico,
        respuestas: &Option<RespuestasEncuesta>,
    ) -> Self {
        let v = &informe.0;
        let nombre = v
            .get("nombre")
            .and_then(|s| s.as_str())
            .unwrap_or("Sin nombre registrado")
            .to_string();
        let cedula = respuestas
            .as_ref()
            .and_then(|r| r.0.get("cedula"))
            .and_then(|c| c.as_str())
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty());
        let edad = v
            .get("edad")
            .and_then(|s| s.as_str())
            .map(|s| s.to_string());
        let medicion = v.get("medicion");
        let valor_imc = medicion
            .and_then(|m| m.get("valorImc"))
            .and_then(|n| n.as_f64());
        let etiqueta_imc = medicion
            .and_then(|m| m.get("etiquetaImc"))
            .and_then(|s| s.as_str())
            .map(|s| s.to_string());
        let estadio = v.get("estadio");
        let estadio_codigo = estadio
            .and_then(|e| e.get("codigo"))
            .and_then(|s| s.as_str())
            .map(|s| s.to_string());
        let estadio_titulo = estadio
            .and_then(|e| e.get("tituloInforme"))
            .and_then(|s| s.as_str())
            .map(|s| s.to_string());
        let version_instrumento = v
            .get("versionInstrumento")
            .and_then(|s| s.as_str())
            .unwrap_or("desconocida")
            .to_string();

        Self {
            nombre,
            cedula,
            edad,
            valor_imc,
            etiqueta_imc,
            estadio_codigo,
            estadio_titulo,
            version_instrumento,
        }
    }
}
