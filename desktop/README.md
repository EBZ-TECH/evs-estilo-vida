# EVS Clínico — aplicación de escritorio

Aplicación de escritorio multiplataforma (Windows / macOS / Linux) para la
**evaluación clínica de estilos de vida y estadio de cambio**.

Migración del prototipo web Next.js (`web/`) a un binario nativo con:

- **Tauri 2** (shell de escritorio, backend en Rust)
- **React 19 + Vite + TypeScript + Tailwind CSS 4** (frontend)
- **SQLite** local (vía `rusqlite` con bundle estático), un único archivo
  guardado en el directorio de datos del usuario:
  - Windows: `%APPDATA%\com.ebztec.evs\evs.sqlite`
  - macOS: `~/Library/Application Support/com.ebztec.evs/evs.sqlite`
  - Linux: `~/.local/share/com.ebztec.evs/evs.sqlite`
- **Argon2id** para hashear el PIN del modo profesional.

## Estructura

```
desktop/
  src-tauri/                 backend Rust
    src/
      lib.rs                 entrypoint Tauri (registra plugins y comandos)
      db.rs                  inicialización de SQLite (WAL + migraciones)
      modelo.rs              tipos serde compartidos con el frontend
      error.rs               AppError serializable hacia JS
      comandos/
        informes.rs          guardar / listar / obtener / eliminar / contar
        auth.rs              pin_existe / definir_pin / verificar_pin / cambiar_pin
    migrations/001_init.sql  esquema inicial
    tauri.conf.json          identidad, ventanas, bundles
  src/                       frontend React (alias @/* → src/*)
    main.tsx                 entrypoint Vite
    App.tsx                  rutas (HashRouter)
    pages/                   Portada · SetupPin · IngresoPin · Encuesta · ...
    components/              EncuestaWizard, InformesProfesionalApp, ...
    lib/
      clinica/               lógica clínica pura (IMC, TTM, riesgos, evaluar)
      informes-storage.ts    wrapper sobre comandos Tauri (mismo API que web)
      tauri-api.ts           tipados de los comandos Rust
      sesion.tsx             estado en memoria del modo profesional
    data/encuesta.ts         catálogo del cuestionario
  scripts/
    smoke-test.mjs           script de validación end-to-end de la BD
```

## Flujo de autenticación (modo escritorio)

- **Modo formulario** → acceso libre, sin login.
- **Acceso profesional** → primer arranque pide definir un PIN (mínimo 4
  caracteres). Posteriormente solicita el mismo PIN para abrir el panel.
  Solo se almacena el hash Argon2id.

La sesión profesional vive en memoria (`SesionProvider`); al cerrar la
ventana se reinicia.

## Pre-requisitos para desarrollo

### Windows

1. **Node.js 22+**
2. **Rust** (rustup) → toolchain `stable-x86_64-pc-windows-msvc` (default).
3. **Visual Studio 2022 Build Tools** con la carga *Desktop development with
   C++* y el Windows SDK (necesario para el linker MSVC).
   - Instalación rápida:
     ```powershell
     winget install --id Microsoft.VisualStudio.2022.BuildTools -e `
       --override "--quiet --wait --norestart `
         --add Microsoft.VisualStudio.Workload.VCTools `
         --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 `
         --add Microsoft.VisualStudio.Component.Windows11SDK.22621"
     ```
4. **WebView2 Runtime** (preinstalado en Windows 10/11 modernos).

Antes de invocar `cargo` o `tauri`, cargar el entorno MSVC en la sesión:

```powershell
& "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvarsall.bat" x64
```

### macOS

- Xcode Command Line Tools (`xcode-select --install`).
- Rust (rustup, default `stable-aarch64-apple-darwin` o `x86_64-apple-darwin`).

### Linux (Debian/Ubuntu)

```bash
sudo apt install libwebkit2gtk-4.1-dev build-essential libssl-dev \
  libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

## Comandos

```bash
# instalar deps del frontend
npm install

# desarrollo (Vite + Tauri en paralelo, hot reload)
npm run tauri:dev

# build release + bundles para el sistema actual
npm run tauri:build

# (opcional) smoke test: arranca el binario release, valida BD
node scripts/smoke-test.mjs
```

## Salidas del build

```
src-tauri/target/release/
  evs-clinico.exe                                          (binario release ~4 MB)
  bundle/msi/EVS Clinico_<ver>_x64_es-ES.msi              (instalador MSI)
  bundle/nsis/EVS Clinico_<ver>_x64-setup.exe             (instalador NSIS)
```

En macOS aparecen `bundle/dmg/*.dmg` y en Linux `bundle/appimage/*.AppImage`,
`bundle/deb/*.deb` (para empacar los tres SO debe ejecutarse el build en cada
plataforma respectiva o configurarse cross-compilation con runners de CI).

## Backup / restauración

La BD es un único archivo (`evs.sqlite`) — copiar/restaurar el archivo
preserva todos los informes y el PIN. Para uso multi-equipo o sincronización
en red la app **no** incluye soporte (decisión deliberada: escenario local).

## Lógica clínica

La lógica de IMC, factores de riesgo y estadio TTM vive en
[`src/lib/clinica/`](src/lib/clinica/) y es código TypeScript puro,
compartido sin cambios desde la versión web original. El backend Rust solo
persiste el JSON resultante y campos desnormalizados (nombre, IMC, etc.)
para listados y filtros sin parsear JSON.
