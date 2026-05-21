import { useCallback, useRef, useState } from 'react'
import {
  FilePlus, FolderOpen, Save, Eye, EyeOff, Edit3, PanelRightOpen, PanelRightClose,
  BookText, Monitor, Sun, Moon, ChevronDown, Settings, Command, Scan, Palette
} from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'
import { useUiStore, type ThemeName } from '../../stores/uiStore'

const themes: { label: string; value: ThemeName; icon: React.ReactNode }[] = [
  { label: 'Dark', value: 'dark', icon: <Moon size={14} /> },
  { label: 'Light', value: 'light', icon: <Sun size={14} /> },
  { label: 'Sepia', value: 'sepia', icon: <span style={{ fontSize: 14 }}>📜</span> },
  { label: 'High Contrast', value: 'high-contrast', icon: <Monitor size={14} /> },
  { label: 'Nord', value: 'nord', icon: <span style={{ fontSize: 14 }}>❄️</span> },
  { label: 'Dracula', value: 'dracula', icon: <span style={{ fontSize: 14 }}>🧛</span> },
  { label: 'Solarized Dark', value: 'solarized-dark', icon: <span style={{ fontSize: 14 }}>🌙</span> },
  { label: 'Solarized Light', value: 'solarized-light', icon: <span style={{ fontSize: 14 }}>☀️</span> },
  { label: 'GitHub Dark', value: 'github-dark', icon: <span style={{ fontSize: 14 }}>🐙</span> },
  { label: 'GitHub Light', value: 'github-light', icon: <span style={{ fontSize: 14 }}>⭐</span> },
  { label: 'One Dark', value: 'one-dark', icon: <span style={{ fontSize: 14 }}>🌃</span> },
  { label: 'One Light', value: 'one-light', icon: <span style={{ fontSize: 14 }}>☕</span> }
]

export function Header() {
  const openFile = useEditorStore((s) => s.openFile)
  const saveFile = useEditorStore((s) => s.markSaved)
  const getActiveFile = useEditorStore((s) => s.getActiveFile)
  const newFile = useEditorStore((s) => s.newFile)
  const addRecentFile = useEditorStore((s) => s.openFile)

  const { showEditor, showPreview, toggleEditor, togglePreview, showSidebar, toggleSidebar,
    showToc, toggleToc, focusMode, toggleFocusMode, theme, setTheme } = useUiStore()

  const themeRef = useRef<HTMLDetailsElement>(null)

  const handleOpen = useCallback(async () => {
    if (!window.electronAPI) return
    const result = await window.electronAPI.file.open()
    if (result) {
      result.forEach((f) => {
        const store = useEditorStore.getState()
        store.openFile(f.filePath, f.fileName, f.content)
      })
    }
  }, [])

  const handleSave = useCallback(async () => {
    const active = getActiveFile()
    if (!active) return
    if (!window.electronAPI) return

    if (active.filePath) {
      await window.electronAPI.file.save(active.filePath, active.content)
      saveFile(active.id)
    } else {
      const result = await window.electronAPI.file.saveAs(active.content)
      if (result) {
        saveFile(active.id, result.filePath)
        useEditorStore.getState().openFile(result.filePath, result.fileName, active.content)
      }
    }
  }, [getActiveFile, saveFile])

  const btnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    borderRadius: 4,
    fontSize: 12,
    whiteSpace: 'nowrap'
  }

  const separator: React.CSSProperties = {
    width: 1,
    height: 20,
    background: 'var(--border)',
    margin: '0 4px'
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: '4px 8px',
        background: 'var(--toolbar-bg)',
        borderBottom: '1px solid var(--toolbar-border)',
        WebkitAppRegion: 'no-drag' as unknown as string,
        flexWrap: 'wrap'
      }}
    >
      <button style={btnStyle} onClick={newFile} title="New file (Cmd+N)">
        <FilePlus size={15} /> New
      </button>
      <button style={btnStyle} onClick={handleOpen} title="Open file (Cmd+O)">
        <FolderOpen size={15} /> Open
      </button>
      <button style={btnStyle} onClick={handleSave} title="Save (Cmd+S)">
        <Save size={15} /> Save
      </button>

      <div style={separator} />

      <button
        style={{
          ...btnStyle,
          background: showEditor ? 'var(--button-hover)' : 'transparent',
          color: showEditor ? 'var(--text-primary)' : 'var(--text-muted)'
        }}
        onClick={toggleEditor}
        title="Toggle Editor (Cmd+1)"
      >
        {showEditor ? <Edit3 size={15} /> : <EyeOff size={15} />} Editor
      </button>
      <button
        style={{
          ...btnStyle,
          background: showPreview ? 'var(--button-hover)' : 'transparent',
          color: showPreview ? 'var(--text-primary)' : 'var(--text-muted)'
        }}
        onClick={togglePreview}
        title="Toggle Preview (Cmd+2)"
      >
        {showPreview ? <Eye size={15} /> : <EyeOff size={15} />} Preview
      </button>

      <div style={separator} />

      <button
        style={{
          ...btnStyle,
          background: showSidebar ? 'var(--button-hover)' : 'transparent'
        }}
        onClick={toggleSidebar}
        title="Toggle Sidebar (Cmd+B)"
      >
        {showSidebar ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />} Files
      </button>
      <button
        style={{
          ...btnStyle,
          background: showToc ? 'var(--button-hover)' : 'transparent'
        }}
        onClick={toggleToc}
        title="Toggle Table of Contents"
      >
        <BookText size={15} /> TOC
      </button>
      <button
        style={{
          ...btnStyle,
          background: focusMode ? 'var(--button-hover)' : 'transparent',
          color: focusMode ? 'var(--accent)' : 'var(--text-secondary)'
        }}
        onClick={toggleFocusMode}
        title="Toggle Focus Mode"
      >
        <Scan size={15} /> Focus
      </button>

      <button
        style={btnStyle}
        onClick={() => {
          const ev = new CustomEvent('md:open-css-inject')
          window.dispatchEvent(ev)
        }}
        title="Custom CSS"
      >
        <Palette size={15} /> CSS
      </button>

      <div style={{ flex: 1 }} />

      <button
        style={btnStyle}
        onClick={() => {
          const ev = new CustomEvent('md:open-settings')
          window.dispatchEvent(ev)
        }}
        title="Settings"
      >
        <Settings size={15} /> Settings
      </button>
      <button
        style={btnStyle}
        onClick={() => {
          const ev = new CustomEvent('md:open-shortcuts')
          window.dispatchEvent(ev)
        }}
        title="Keyboard Shortcuts"
      >
        <Command size={15} /> Shortcuts
      </button>

      <div style={separator} />

      <div style={{ position: 'relative' }}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as ThemeName)}
          style={{
            ...btnStyle,
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
            cursor: 'pointer',
            paddingRight: 20,
            appearance: 'none',
            WebkitAppearance: 'none'
          }}
        >
          {themes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--text-muted)'
          }}
        />
      </div>
    </div>
  )
}
