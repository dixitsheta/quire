# Quire

A modern, cross-platform Markdown viewer/editor with a native app feel. Built on Electron + React + TypeScript.

![macOS](https://img.shields.io/badge/platform-macOS-lightgrey) ![Windows](https://img.shields.io/badge/platform-Windows-blue) ![Linux](https://img.shields.io/badge/platform-Linux-orange) ![License](https://img.shields.io/badge/license-Apache%202.0-green)

## Features

- **Split-pane editing** — side-by-side or vertical editor/preview layout with draggable resize
- **Monaco Editor** — VS Code-grade editor with syntax highlighting, folding, minimap, and smooth scrolling
- **GFM + Math + Diagrams** — GitHub Flavored Markdown, KaTeX math, and Mermaid diagrams rendered live
- **12 Color Themes** — Dark, Light, Sepia, High Contrast, Nord, Dracula, Solarized, GitHub, One (each in dark/light variants)
- **Custom CSS** — inject your own styles into the preview with live feedback
- **Multi-file tabs** — open multiple files with dirty-dot indicators and close buttons
- **File tree sidebar** — browse your workspace directory
- **Search** — find within the current document (Cmd+F)
- **Table of Contents** — auto-generated from headings
- **Image paste** — paste images from clipboard, saved as local assets
- **Export** — export to standalone HTML or PDF
- **Focus mode** — dims header/toolbar/sidebars, keeps editor at full brightness
- **Zen mode** — full-screen distraction-free writing
- **Auto-save** — debounced 1.5s, toggle on/off
- **Session restore** — reopens your last files on launch
- **Keyboard shortcuts** — full reference dialog
- **Auto-updater** — checks GitHub Releases for updates (packaged builds only)

## Download

Pre-built binaries are available from [GitHub Releases](https://github.com/dixitsheta/quire/releases).

| Platform | Format |
|----------|--------|
| macOS    | .dmg, .zip |
| Windows  | .exe (NSIS installer) |
| Linux    | .AppImage, .deb |

## Development

### Prerequisites

- Node.js 20+
- npm 9+

### Setup

```sh
npm install --legacy-peer-deps
```

### Run in development

```sh
npm run dev
```

Launches the app with hot-reload on a random port. Pre-existing instances are killed automatically.

### Build

```sh
npm run build
```

Compiles main, preload, and renderer into `out/`.

### Package

```sh
# macOS
npm run package:mac

# Windows
npm run package:win

# Linux
npm run package:linux
```

Packaged binaries go to `release/`.

### Publish (with auto-update)

Set `GH_TOKEN` and run the package command. electron-builder will upload to GitHub Releases:

```sh
GH_TOKEN=ghp_xxx npm run package:mac
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+N` | New file |
| `Cmd+O` | Open file |
| `Cmd+S` | Save |
| `Cmd+Shift+S` | Save As |
| `Cmd+1` | Toggle editor |
| `Cmd+2` | Toggle preview |
| `Cmd+3` | Show both |
| `Cmd+B` | Toggle sidebar |
| `Cmd+F` | Find |
| `Cmd+/` | Shortcuts reference |
| `Cmd+Shift+Z` | Zen mode |

## Architecture

```
src/
├── main/          # Electron main process (window, menu, IPC, updater)
├── preload/       # Context bridge (typed Electron API)
└── renderer/      # React app
    ├── App.tsx
    ├── components/
    │   ├── editor/       # Monaco Editor wrapper (MarkdownEditor.tsx)
    │   ├── preview/      # Markdown preview + Mermaid renderer
    │   ├── header/       # Toolbar with all view controls
    │   ├── modals/       # Settings, Export, Shortcuts, CSS, Theme Gallery
    │   ├── sidebar/      # File tree, search, table of contents
    │   └── AppShell.tsx  # Main layout shell
    ├── hooks/            # useAutoSave, useKeyboardShortcuts, useScrollSync
    ├── stores/           # Zustand stores (uiStore, editorStore, settingsStore)
    └── styles/           # CSS themes, markdown styling, globals
```

## License

Apache 2.0 — see [LICENSE](LICENSE).
