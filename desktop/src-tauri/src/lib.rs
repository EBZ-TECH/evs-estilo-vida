mod comandos;
mod db;
mod error;
mod modelo;

use tauri::Manager;

use crate::comandos::auth;
use crate::comandos::backup;
use crate::comandos::informes;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .level(if cfg!(debug_assertions) {
                    log::LevelFilter::Info
                } else {
                    log::LevelFilter::Warn
                })
                .build(),
        )
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            let estado = db::inicializar(app.handle())
                .map_err(|e| Box::<dyn std::error::Error>::from(e.to_string()))?;
            app.manage(estado);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            informes::guardar_informe,
            informes::listar_informes,
            informes::obtener_informe,
            informes::eliminar_informe,
            informes::contar_informes,
            auth::pin_existe,
            auth::definir_pin,
            auth::verificar_pin,
            auth::cambiar_pin,
            backup::exportar_datos,
            backup::exportar_datos_guardar_dialogo,
            backup::importar_datos,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
