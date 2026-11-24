# EVS Clínico

Aplicación de **escritorio** para la Evaluación de Determinantes de Estilos de vida y Estado de Cambio.

> El prototipo web (Next.js) fue retirado. La versión vigente es la app nativa en `desktop/`.

## Stack

- **Tauri 2** + **Rust** (shell nativo, SQLite, PIN con Argon2id)
- **React 19** + **TypeScript** + **Vite 8** + **Tailwind CSS 4**

## Estructura

```
desktop/          → aplicación de escritorio (código fuente)
Documentación/    → guía técnica, arquitectura y materiales clínicos
```

## Desarrollo

```bash
cd desktop
npm install
npm run tauri:dev
```

## Build instalador Windows (.exe)

```bash
cd desktop
npm run tauri:build
```

Salida típica:

```
desktop/src-tauri/target/release/bundle/nsis/EVS Clínico_<ver>_x64-setup.exe
```

## Documentación

- [Guía técnica de usuario](Documentación/GUIA-TECNICA-USUARIO-EVS-CLINICO.md)
- [Arquitectura y mesa de trabajo](Documentación/ARQUITECTURA-Y-MESA-DE-TRABAJO.md)

## Autor

Michael Lozada — Ing. en TIC — EBZ
