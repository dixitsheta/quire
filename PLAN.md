# MDFileViewerEditor — Build Plan

## Overview
Cross-platform Markdown viewer/editor built on Electron + React + TypeScript.  
Modern native app feel with VS Code-like theming, split-pane layout, GFM + Math + Diagrams, and WYSIWYG toolbar.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Desktop Shell | Electron 33 | Battle-tested cross-platform, native menus/dialogs/file system |
| UI Framework | React 19 + TypeScript | Component model, ecosystem |
| Bundler | electron-vite | Fast HMR, native Electron+Vite integration |
| Editor | Monaco Editor (vscode editor) | Same engine as VS Code — syntax highlighting, line numbers, folding, auto-complete |
| Markdown Renderer | react-markdown + remark-gfm + rehype-highlight | GFM spec compliance, extensible plugin system |
| Math | KaTeX (via remark-math / rehype-katex) | Fast client-side math rendering |
| Diagrams | Mermaid (via rehype-mermaid) | Flowcharts, sequence, class, Gantt, pie |
| Styling | Tailwind CSS + CSS variables for theming | Utility-first, easy theme switching |
| State | Zustand | Lightweight, TS-first state management |
| Icons | Lucide React | Consistent, modern icon set |
| Export | html2canvas + jspdf (PDF) | Client-side export without server |

---

## Project Structure

```
MDFileViewerEditor/
├── package.json
├── electron.vite.config.ts
├── tsconfig.json / tsconfig.node.json / tsconfig.web.json
├── tailwind.config.ts
├── src/
│   ├── main/                        # Electron main process
│   │   ├── index.ts                 # App entry, window creation
│   │   ├── menu.ts                  # Native app menu
│   │   ├── ipc.ts                   # IPC handlers (file dialogs, fs ops)
│   │   └── updater.ts              # Auto-updater
│   ├── preload/                     # Preload (contextBridge)
│   │   ├── index.ts
│   │   └── types.ts
│   └── renderer/                    # React app
│       ├── index.html
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/
│       │   ├── AppShell.tsx         # Main layout: sidebar + split + statusbar
│       │   ├── header/
│       │   │   ├── Header.tsx       # Menu bar replacement (file, edit, view, help)
│       │   │   ├── FileTabs.tsx     # Open file tabs
│       │   │   └── ViewControls.tsx # Show/hide editor/preview toggles
│       │   ├── editor/
│       │   │   ├── MarkdownEditor.tsx  # Monaco wrapper
│       │   │   └── Toolbar.tsx      # WYSIWYG formatting toolbar
│       │   ├── preview/
│       │   │   ├── MarkdownPreview.tsx # Renders GFM + Math + Mermaid
│       │   │   ├── ScrollSync.tsx   # Syncs scroll between editor & preview
│       │   │   └── TableOfContents.tsx
│       │   ├── sidebar/
│       │   │   ├── FileTree.tsx     # File explorer sidebar
│       │   │   └── SearchPanel.tsx  # Search in file
│       │   ├── split/
│       │   │   └── SplitPane.tsx    # Draggable resizable split pane
│       │   ├── statusbar/
│       │   │   └── StatusBar.tsx    # Word count, line count, cursor pos, encoding
│       │   └── modals/
│       │       ├── ThemeSelector.tsx
│       │       ├── SettingsModal.tsx
│       │       └── ExportModal.tsx
│       ├── hooks/
│       │   ├── useFileSystem.ts     # Open/save via IPC
│       │   ├── useTheme.ts          # Theme switching
│       │   ├── useAutoSave.ts       # Debounced auto-save
│       │   ├── useKeyboardShortcuts.ts
│       │   └── useScrollSync.ts
│       ├── stores/
│       │   ├── editorStore.ts       # Editor content, cursor, history
│       │   ├── fileStore.ts         # Open files, active tab, dirty state
│       │   ├── uiStore.ts           # Panel visibility, theme, settings
│       │   └── settingsStore.ts     # Persisted preferences
│       ├── themes/
│       │   ├── registry.ts          # Theme definitions
│       │   └── presets.ts           # Light, Dark, High Contrast, Sepia, Nord, Dracula, Solarized ...
│       ├── lib/
│       │   ├── markdown.ts          # Custom remark/rehype plugins
│       │   └── formatting.ts        # Toolbar insert/format helpers
│       └── styles/
│           ├── globals.css
│           ├── markdown.css          # Preview styling
│           └── themes.css           # CSS variable definitions per theme
```

---

## Features — Full Scope

### Phase 1: Core Editor (MVP)
| Feature | Detail |
|---------|--------|
| Split pane layout | Editor left, Preview right. Draggable divider. |
| Header view controls | Button to `Hide Editor` / `Hide Preview` / `Show Both` |
| Monaco editor | Syntax highlighting, line numbers, bracket matching, auto-closing |
| GFM rendering | Tables, task lists, strikethrough, auto-links, images |
| Code syntax highlighting | In preview code blocks via rehype-highlight |
| File operations | New, Open (native dialog), Save, Save As |
| Auto-save toggle | Debounced auto-save (1.5s after last keystroke) OR manual Cmd+S |
| Multiple themes | Light, Dark, High Contrast, Sepia — switchable from header |
| Word/char/line count | Live in status bar |
| Draggable split | Mouse drag to resize editor/preview ratio |
| Full-screen | Cmd+Shift+F to toggle |

### Phase 2: Productivity
| Feature | Detail |
|---------|--------|
| WYSIWYG Toolbar | Bold, Italic, Strike, H1-H6, UL, OL, Task, Code, Blockquote, Link, Image, Table, HR, Math, Diagram buttons that insert MD syntax |
| File tabs | Multiple open files, each with its own tab, dirty indicator (dot) |
| File tree sidebar | Browse and open files from directory tree |
| Search in document | Cmd+F find bar with match highlighting |
| Scroll sync | Scrolling editor scrolls preview to match (and vice versa) |
| Undo/Redo | Monaco built-in + toolbar buttons |
| Keyboard shortcuts | Customizable shortcut cheatsheet (Cmd+B = bold, etc.) |

### Phase 3: Advanced
| Feature | Detail |
|---------|--------|
| KaTeX math | `$...$` inline and `$$...$$` block rendering |
| Mermaid diagrams | `\`\`\`mermaid` code blocks rendered as diagrams |
| Table of contents | Auto-generated from headings, toggleable sidebar |
| Export to HTML | Save rendered HTML file |
| Export to PDF | Via window.print() or jspdf |
| Zen mode | Hide everything except editor, centered, minimal UI |
| Focus mode | Dim everything except current line/paragraph |
| Image paste | Paste from clipboard, save as local asset |
| Split orientation | Toggle horizontal/vertical split |
| Recent files | List in File menu + quick access |

### Phase 4: Polish
| Feature | Detail |
|---------|--------|
| Session restore | Reopen last files and cursor position on launch |
| Custom CSS | User can inject custom CSS for preview styling |
| Live preview of theme | Theme gallery modal |
| Drag & drop files | Drag .md files into window to open |
| Auto-check for updates | electron-updater |
| Multi-monitor DPI | Handle HiDPI correctly |
| Spell check | Monaco built-in spell checker |

---

## UI Layout (High-Fidelity Wireframe)

```
┌──────────────────────────────────────────────────────────────┐
│  [📁] [📂] [💾] [💾*]   │  file1.md │ file2.md ✕ │  [🔍]  │  ── Header
│  B I U S  H1 H2 H3  UL OL  🔗 🖼 📊 ∑ 📐  ↩ ↪  [👁] [✏️]  │  ── Toolbar
├──────────┬───────────────────────┬───────────────────────────┤
│          │                       │                           │
│  Files   │  # Heading            │  # Heading                │
│  ├─ docs │                      │                           │
│  │ ├─ a  │  **Bold** text       │  **Bold** text            │
│  │ └─ b  │                       │                           │
│          │  - List item          │  • List item              │
│  ...     │                       │                           │
│          │  ```js                │  ```js (highlighted)      │
│  [TOC]   │  console.log()        │  console.log()            │
│  # H1   │  ```                  │  ```                      │
│  ## H2  │                       │                           │
│          │  $$\\sum_{i=1}^n$$    │  ∑ (rendered KaTeX)       │
│          │                       │                           │
│          │  ```mermaid           │  [flowchart rendered]     │
│          │  graph TD;            │                           │
│          │  A-->B;               │                           │
│          │  ```                  │                           │
│          │                       │                           │
├──────────┴───────────────────────┴───────────────────────────┤
│  Ln 12  Col 34  │  Words: 450  │  UTF-8  │  💾 Auto-save ON │  ── StatusBar
└──────────────────────────────────────────────────────────────┘
     ↑ Sidebar       ↑ Editor                ↑ Preview
```

---

## Theme System

Each theme is a set of CSS variables. Users switch via header dropdown (like VS Code).

```css
/* Example: Dark theme variables */
[data-theme="dark"] {
  --bg-primary: #1e1e1e;
  --bg-secondary: #252526;
  --bg-editor: #1e1e1e;
  --bg-preview: #1e1e1e;
  --text-primary: #cccccc;
  --text-secondary: #969696;
  --border: #333333;
  --accent: #0078d4;
  --toolbar-bg: #333333;
  --statusbar-bg: #007acc;
  /* ... ~60 variables covering every surface */
}
```

**Planned themes:** Light, Dark, High Contrast, Sepia, Nord, Dracula, Solarized (light & dark), One Dark, One Light, GitHub Light, GitHub Dark.

---

## Auto-Save Architecture

- **Toggle** in status bar (like MS Office "AutoSave" toggle)
- When ON: debounced write to disk 1.5s after last edit. No user prompt.
- When OFF: manual Cmd+S only. Dirty indicator dot on tab.
- State persists across sessions in settings store.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd+O | Open file |
| Cmd+S | Save |
| Cmd+Shift+S | Save As |
| Cmd+N | New file |
| Cmd+Z / Cmd+Shift+Z | Undo / Redo |
| Cmd+B | Bold `**text**` |
| Cmd+I | Italic `*text*` |
| Cmd+Shift+K | Code block |
| Cmd+Shift+M | Math block |
| Cmd+Shift+D | Insert Mermaid diagram |
| Cmd+P | Quick open file |
| Cmd+F | Search in document |
| Cmd+Shift+E | Toggle file tree sidebar |
| Cmd+Shift+F | Full-screen |
| Cmd+Shift+T | Toggle theme |
| Cmd+\ | Toggle split orientation |
| Cmd+1 | Show editor only |
| Cmd+2 | Show preview only |
| Cmd+3 | Show both |

---

## Implementation Order (Steps)

### Step 1 — Project scaffold
- Initialize electron-vite + React + TypeScript
- Configure Tailwind + CSS variables
- Set up preload with contextBridge for IPC
- Basic AppShell with empty split pane

### Step 2 — Header + Toolbar + StatusBar
- Header with file ops buttons + view toggles
- Toolbar with all formatting buttons
- StatusBar with word/char/line count

### Step 3 — Editor (Monaco)
- Integrate Monaco Editor
- Wire content state to Zustand store
- Line/cursor tracking for status bar
- Toolbar buttons insert MD syntax at cursor

### Step 4 — Preview (Markdown Renderer)
- react-markdown with GFM plugins
- rehype-highlight for code blocks
- KaTeX for math rendering
- Mermaid for diagrams
- ScrollSync between editor and preview

### Step 5 — File System
- IPC handlers for open/save/save-as dialogs
- File tabs with dirty state
- Auto-save with toggle
- Drag-and-drop file opening
- Recent files tracking

### Step 6 — Sidebars
- File tree sidebar
- Search/Find panel
- Table of Contents sidebar

### Step 7 — Themes
- Theme registry and switcher
- 12+ preset themes
- Persist choice

### Step 8 — Advanced Features
- Export to HTML/PDF
- Zen mode / Focus mode
- Session restore
- Image paste
- Split orientation toggle
- Custom CSS injection
- Settings modal

### Step 9 — Polish
- Keyboard shortcut cheatsheet
- HiDPI / multi-monitor
- Auto-updater
- Performance optimization for large files

---

## Open Questions for You

1. **Sidebar default state** — Show file tree by default, or hidden until toggled?
2. **Split orientation** — Always vertical (editor left / preview right), or allow horizontal split too?
3. **File tree scope** — Single folder workspace (like VS Code) or just open individual files?
4. **Diagrams** — Mermaid only, or also support PlantUML / other diagram engines?
5. **Spell check** — Built-in or skip for v1?
