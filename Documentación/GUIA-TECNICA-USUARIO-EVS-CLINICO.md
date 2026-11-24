# Guía técnica de usuario — EVS Clínico

**Versión del software:** 2.0.0  
**Desarrollo:** Michael Lozada — Ing. en TIC — EBZ  
**Fecha de referencia:** 2026

---

## 1. ¿Qué es EVS Clínico?

**EVS Clínico** es el nombre comercial de la aplicación. La sigla **EVS** corresponde a **Evaluación de estilos de vida**, instrumento clínico orientado a registrar determinantes del estilo de vida y el estado de cambio motivacional de una persona.

En su versión actual, la aplicación implementa la **Evaluación de Determinantes de Estilos de vida y Estado de Cambio**, un cuestionario estructurado que permite:

- Registrar datos antropométricos (peso, talla) y calcular el IMC.
- Evaluar factores de riesgo en los determinantes del estilo de vida.
- Clasificar el estadio de cambio según el modelo transteórico (TTM).
- Generar un **informe diagnóstico** para uso del personal de salud.

La información se almacena **únicamente en el equipo local** donde está instalada la aplicación. No requiere conexión a internet para su funcionamiento habitual.

---

## 2. Tipo de software

EVS Clínico es una **aplicación de escritorio nativa multiplataforma**, desarrollada con las siguientes características técnicas:

| Característica | Descripción |
|----------------|-------------|
| **Categoría** | Software clínico / de apoyo a la evaluación en salud ocupacional o laboral |
| **Arquitectura** | Cliente local (thick client): interfaz + lógica + base de datos en el mismo equipo |
| **Paradigma** | Aplicación híbrida: interfaz web embebida (React) dentro de un contenedor nativo (Tauri) |
| **Persistencia** | Base de datos SQLite local en un único archivo |
| **Conectividad** | Offline-first; no depende de servidor remoto para encuesta, informes ni almacenamiento |
| **Seguridad de acceso** | PIN profesional (hash Argon2id) para el panel de informes |
| **Distribución** | Instalador Windows (NSIS) generado como ejecutable `.exe` |

No es una aplicación web en navegador, ni un servicio en la nube. Es un programa instalable que se ejecuta como cualquier otra aplicación de Windows.

---

## 3. Descripción técnica del software

### 3.1. Stack tecnológico

El software fue construido migrando un prototipo web a una aplicación de escritorio. Los componentes principales son:

**Capa de presentación (frontend)**

- **React 19** — biblioteca de interfaz de usuario.
- **TypeScript** — tipado estático del código frontend.
- **Vite 8** — empaquetador y servidor de desarrollo.
- **Tailwind CSS 4** — estilos de la interfaz.
- **React Router** — navegación entre pantallas (encuesta, informes, acceso profesional).

**Capa nativa (backend / shell de escritorio)**

- **Tauri 2** — framework que empaqueta la aplicación como ejecutable nativo y expone APIs del sistema operativo.
- **Rust** — lenguaje del backend nativo (comandos, base de datos, seguridad del PIN).
- **rusqlite** — acceso a SQLite embebido.
- **Argon2id** — algoritmo de hash para el PIN profesional.

**Lógica clínica**

- Módulos TypeScript puros en `src/lib/clinica/`:
  - Cálculo de IMC y categorización (OMS).
  - Evaluación de factores de riesgo por dimensión.
  - Clasificación del estadio de cambio (TTM).
  - Generación del informe diagnóstico.

El backend Rust **no recalcula** la lógica clínica: persiste el JSON del informe y campos desnormalizados (nombre, IMC, fecha) para listados y consultas.

### 3.2. Estructura funcional

```
Usuario final                    Personal autorizado (PIN)
      │                                    │
      ▼                                    ▼
  Iniciar encuesta              Acceso profesional
      │                                    │
      ▼                                    ▼
  Cuestionario guiado           Panel de informes
  (bloques clínicos + TTM)      (listar / ver / eliminar)
      │                                    │
      └──────────────┬─────────────────────┘
                     ▼
            Base de datos SQLite local
            (%APPDATA%\com.ebztec.evs\evs.sqlite)
```

### 3.3. Datos almacenados localmente

| Elemento | Ubicación en Windows |
|----------|----------------------|
| Base de datos | `%APPDATA%\com.ebztec.evs\evs.sqlite` |
| Hash del PIN profesional | Dentro de la misma base de datos (tabla `config_seguridad`) |
| Informes diagnósticos | Tabla `informes` (JSON completo + metadatos) |

**Identificador de la aplicación:** `com.ebztec.evs`

### 3.4. Modos de acceso

1. **Modo encuesta (acceso libre):** cualquier usuario puede iniciar y completar el cuestionario sin autenticación.
2. **Modo profesional (protegido por PIN):** permite consultar la biblioteca de informes, ver detalle, imprimir/exportar PDF e importar/exportar copias de seguridad.

La sesión profesional se mantiene en memoria mientras la aplicación está abierta; al cerrar la ventana, la sesión termina y debe ingresarse el PIN nuevamente.

---

## 4. Requisitos del sistema

### 4.1. Hardware mínimo (usuario final)

| Componente | Requisito mínimo | Recomendado |
|------------|------------------|-------------|
| **Procesador** | 64 bits, dual-core, 1,5 GHz o superior | Intel Core i3 / AMD equivalente o superior |
| **Memoria RAM** | 4 GB | 8 GB o más |
| **Almacenamiento** | 200 MB libres (aplicación + base de datos) | 500 MB o más |
| **Pantalla** | Resolución mínima 960 × 640 píxeles | 1280 × 820 o superior |
| **Entrada** | Teclado y mouse (o trackpad) | — |

### 4.2. Sistema operativo compatible

| Sistema operativo | Versión | Arquitectura | Estado |
|-------------------|---------|--------------|--------|
| **Microsoft Windows** | Windows 10 (64 bits) o superior | x64 | Plataforma principal de distribución |
| **Microsoft Windows** | Windows 11 (64 bits) | x64 | Compatible |
| **macOS** | 10.15 o superior | x64 / Apple Silicon | Soportado en compilación (no es el instalador entregado por defecto) |
| **Linux** | Distribuciones con WebKitGTK 4.1 | x64 | Soportado en compilación |

> **Nota:** El instalador `.exe` (NSIS) provisto para usuarios finales está orientado a **Windows 64 bits**.

### 4.3. Dependencias necesarias

#### Para el usuario final (instalación con `.exe`)

El instalador incluye la aplicación empaquetada. En Windows, el único requisito adicional habitual es:

| Dependencia | Descripción |
|-------------|-------------|
| **Microsoft Edge WebView2 Runtime** | Motor de renderizado web embebido. Preinstalado en Windows 11 y en la mayoría de instalaciones recientes de Windows 10. Si falta, Windows o el instalador pueden solicitar su descarga. |

**No se requiere** instalar Node.js, Rust, bases de datos externas ni servidores web para usar la aplicación.

#### Para desarrollo o compilación del software (equipo del desarrollador)

| Dependencia | Versión / detalle |
|-------------|-------------------|
| **Node.js** | 22 o superior |
| **npm** | Incluido con Node.js |
| **Rust (rustup)** | Toolchain `stable`, edición 2021 |
| **Visual Studio Build Tools 2022** | Carga *Desktop development with C++* + Windows SDK (solo Windows) |
| **WebView2 Runtime** | Para ejecutar en modo desarrollo |

Comando de compilación del instalador:

```powershell
cd desktop
npm install
npm run tauri:build
```

Salida del instalador:

```
desktop\src-tauri\target\release\bundle\nsis\EVS Clínico_2.0.0_x64-setup.exe
```

---

## 5. Instalación y configuración

### 5.1. Pasos para instalar el software

1. Obtener el archivo instalador: `EVS Clínico_2.0.0_x64-setup.exe`.
2. Hacer doble clic en el instalador.
3. Si Windows SmartScreen muestra una advertencia, seleccionar **Más información** → **Ejecutar de todas formas** (solo si el instalador proviene de una fuente confiable).
4. Seguir el asistente de instalación NSIS (idioma: español o inglés según configuración del instalador).
5. La aplicación se instala en el perfil del usuario actual (`installMode: currentUser`).
6. Al finalizar, la aplicación quedará disponible en el menú Inicio, carpeta **EVS · EBZ**.
7. Ejecutar **EVS Clínico** desde el menú Inicio o el acceso directo creado.

### 5.2. Configuración inicial

La primera vez que se accede al **modo profesional**, el sistema solicita definir un PIN:

1. En la pantalla de inicio, pulsar **Acceso profesional** → **Configurar PIN**.
2. Ingresar un PIN de **mínimo 4 caracteres** y **máximo 32 caracteres**.
3. Confirmar el PIN en el segundo campo.
4. Pulsar **Guardar y continuar**.

El PIN se almacena como **hash Argon2id** (no en texto plano). Solo el personal autorizado debe conocerlo.

> **Importante:** Si se pierde el PIN, no existe recuperación automática. Deberá restaurarse una copia de seguridad previa o reinstalar la aplicación (lo cual implica pérdida de datos si no hay respaldo).

### 5.3. Acceso al sistema

#### Pantalla de inicio (Portada)

Al abrir la aplicación se muestran dos opciones:

| Opción | Descripción | Autenticación |
|--------|-------------|---------------|
| **Iniciar encuesta** | Abre el cuestionario clínico para una nueva evaluación | No requiere PIN |
| **Acceso profesional** | Abre el panel de informes diagnósticos | Requiere PIN (o configuración inicial del PIN) |

#### Flujo — Modo encuesta

1. **Iniciar encuesta** → completar datos de identificación y antropometría.
2. Responder los bloques del cuestionario (condiciones de vida, sistema de salud, aspectos biológicos, conductuales, cognitivos, psicoemocionales, TTM).
3. Al finalizar, el sistema calcula el informe y lo guarda en la base de datos local.
4. Se muestra la pantalla **Evaluación guardada**.

#### Flujo — Modo profesional

1. **Acceso profesional** → ingresar PIN.
2. Acceder al **panel de informes**: listado de evaluaciones guardadas.
3. Seleccionar un informe para ver el detalle (IMC, factores de riesgo, estadio TTM, pautas).
4. Opciones disponibles: imprimir / guardar como PDF, eliminar informe, exportar o importar copia de seguridad.
5. **Cerrar sesión** para salir del modo profesional sin cerrar la aplicación.

#### Respaldo de datos (modo profesional)

- **Exportar:** genera un archivo JSON con informes y configuración de PIN.
- **Importar:** restaura datos desde un archivo de respaldo exportado previamente.

La base de datos también puede respaldarse copiando manualmente el archivo:

```
%APPDATA%\com.ebztec.evs\evs.sqlite
```

---

## 6. Resumen de especificaciones técnicas

| Parámetro | Valor |
|-----------|-------|
| Nombre del producto | EVS Clínico |
| Versión | 2.0.0 |
| Identificador | com.ebztec.evs |
| Tamaño aproximado del ejecutable | ~4–15 MB (según empaquetado) |
| Base de datos | SQLite 3 (modo WAL) |
| Resolución mínima de ventana | 960 × 640 px |
| Resolución predeterminada | 1280 × 820 px |
| Cifrado del PIN | Argon2id |
| Licencia | Propietaria (ver `LICENSE.txt`) |

---

## 7. Soporte y consideraciones

- La aplicación está diseñada para **uso local en un solo equipo**. No sincroniza datos entre dispositivos de forma automática.
- Los informes y pautas son **orientativos** para la entrevista clínica; deben ser interpretados y adaptados por el profesional de salud.
- Para actualizaciones, la pantalla de inicio incluye la opción **Buscar actualización** (requiere configuración de servidor de actualizaciones en el despliegue).

---

*Documento generado para uso técnico y operativo de EVS Clínico. Puede copiarse directamente a Microsoft Word conservando la estructura de títulos y tablas.*
