import { useEffect, useState } from 'react'
import { useUiStore } from './stores/uiStore'
import { useEditorStore } from './stores/editorStore'
import { AppShell } from './components/AppShell'
import { ExportModal } from './components/modals/ExportModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { ShortcutsModal } from './components/modals/ShortcutsModal'
import { CssInjectModal } from './components/modals/CssInjectModal'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useAutoSave } from './hooks/useAutoSave'

export default function App() {
  const theme = useUiStore((s) => s.theme)
  const [showExport, setShowExport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showCssInject, setShowCssInject] = useState(false)

  useKeyboardShortcuts()
  useAutoSave()

  const focusMode = useUiStore((s) => s.focusMode)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-focus-mode', String(focusMode))
  }, [focusMode])

  useEffect(() => {
    const editorStore = useEditorStore.getState()
    const restoreSession = async () => {
      const saved = localStorage.getItem('md-editor-session')
      if (saved) {
        try {
          const paths: string[] = JSON.parse(saved)
          if (paths.length > 0 && window.electronAPI) {
            const results = await window.electronAPI.file.openPaths(paths)
            results.forEach((f) => editorStore.openFile(f.filePath, f.fileName, f.content))
          }
        } catch {
          // ignore corrupted session data
        }
      }
      if (editorStore.openFiles.length === 0) {
        editorStore.newFile()
      }
    }
    restoreSession()
  }, [])

  useEffect(() => {
    if (!window.electronAPI) return
    const unsubscribers: (() => void)[] = []

    unsubscribers.push(
      window.electronAPI.on('menu:new-file', () => useEditorStore.getState().newFile()),
      window.electronAPI.on('menu:open-file', async () => {
        if (!window.electronAPI) return
        const result = await window.electronAPI.file.open()
        if (result) {
          result.forEach((f) => useEditorStore.getState().openFile(f.filePath, f.fileName, f.content))
        }
      }),
      window.electronAPI.on('menu:save', async () => {
        const store = useEditorStore.getState()
        const active = store.getActiveFile()
        if (!active || !window.electronAPI) return
        if (active.filePath) {
          await window.electronAPI.file.save(active.filePath, active.content)
          store.markSaved(active.id)
        } else {
          const result = await window.electronAPI.file.saveAs(active.content)
          if (result) store.markSaved(active.id, result.filePath)
        }
      }),
      window.electronAPI.on('menu:save-as', async () => {
        const store = useEditorStore.getState()
        const active = store.getActiveFile()
        if (!active || !window.electronAPI) return
        const result = await window.electronAPI.file.saveAs(active.content)
        if (result) store.markSaved(active.id, result.filePath)
      }),
      window.electronAPI.on('menu:toggle-editor', () => useUiStore.getState().toggleEditor()),
      window.electronAPI.on('menu:toggle-preview', () => useUiStore.getState().togglePreview()),
      window.electronAPI.on('menu:show-both', () => useUiStore.getState().showBoth()),
      window.electronAPI.on('menu:toggle-sidebar', () => useUiStore.getState().toggleSidebar()),
      window.electronAPI.on('menu:zen-mode', () => useUiStore.getState().toggleZenMode()),
      window.electronAPI.on('menu:set-theme', (theme) => useUiStore.getState().setTheme(theme as string)),
      window.electronAPI.on('menu:export-html', () => setShowExport(true)),
      window.electronAPI.on('menu:export-pdf', () => setShowExport(true)),
      window.electronAPI.on('menu:shortcuts', () => setShowShortcuts(true)),
      window.electronAPI.on('menu:custom-css', () => setShowCssInject(true)),
      window.electronAPI.on('menu:find', () => {
        const searchInput = document.querySelector<HTMLInputElement>('[placeholder="Search..."]')
        searchInput?.focus()
      }),
      window.electronAPI.on('file:opened', async (filePath) => {
        if (!window.electronAPI) return
        const content = await window.electronAPI.file.read(filePath as string)
        if (content) {
          const name = (filePath as string).split('/').pop() || (filePath as string).split('\\').pop() || 'untitled'
          useEditorStore.getState().openFile(filePath as string, name!, content)
        }
      })
    )

    return () => unsubscribers.forEach((unsub) => unsub())
  }, [])

  useEffect(() => {
    const onSettings = () => setShowSettings(true)
    const onShortcuts = () => setShowShortcuts(true)
    const onCssInject = () => setShowCssInject(true)
    window.addEventListener('md:open-settings', onSettings)
    window.addEventListener('md:open-shortcuts', onShortcuts)
    window.addEventListener('md:open-css-inject', onCssInject)
    return () => {
      window.removeEventListener('md:open-settings', onSettings)
      window.removeEventListener('md:open-shortcuts', onShortcuts)
      window.removeEventListener('md:open-css-inject', onCssInject)
    }
  }, [])

  return (
    <>
      <AppShell />
      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {showCssInject && <CssInjectModal onClose={() => setShowCssInject(false)} />}
    </>
  )
}
