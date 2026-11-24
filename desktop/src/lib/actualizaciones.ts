import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

/**
 * Consulta el servidor configurado en `tauri.conf.json` y, si hay versión
 * más nueva firmada, descarga e instala el actualizador y reinicia la app.
 */
export async function buscarActualizacionEInstalar(): Promise<void> {
  let update;
  try {
    update = await check({ timeout: 60_000 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    window.alert(
      `No se pudo comprobar si hay actualizaciones (red, HTTPS o dirección del servidor).\n\nDetalle: ${msg}`
    );
    return;
  }

  if (!update) {
    window.alert(
      "No hay una versión nueva publicada, o ya está usando la última disponible según el servidor."
    );
    return;
  }

  const notas = update.body?.trim() ? `\n\nNotas:\n${update.body}` : "";
  const ok = window.confirm(
    `Hay una nueva versión: ${update.version} (actual: ${update.currentVersion}).${notas}\n\n¿Descargar e instalar ahora? La aplicación se cerrará y volverá a abrir.`
  );
  if (!ok) return;

  await update.downloadAndInstall();
  await relaunch();
}
