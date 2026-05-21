import { useEffect, useState, useCallback } from 'react'
import { useUiStore } from './stores/uiStore'
import { useEditorStore } from './stores/editorStore'
import { AppShell } from './components/AppShell'
import { ExportModal } from './components/modals/ExportModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { ShortcutsModal } from './components/modals/ShortcutsModal'
import { CssInjectModal } from './components/modals/CssInjectModal'
import { ThemeGalleryModal } from './components/modals/ThemeGalleryModal'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useAutoSave } from './hooks/useAutoSave'

export default function App() {
  const theme = useUiStore((s) => s.theme)
  const [showExport, setShowExport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showCssInject, setShowCssInject] = useState(false)
  const [showThemeGallery, setShowThemeGallery] = useState(false)
  const [updateMsg, setUpdateMsg] = useState<string | null>(null)
  const [updateVersion, setUpdateVersion] = useState<string | null>(null)

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
      window.electronAPI.on('menu:theme-gallery', () => setShowThemeGallery(true)),
      window.electronAPI.on('menu:check-update', () => {
        setUpdateMsg('Checking for updates...')
        window.electronAPI?.update.check()
      }),
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
    const onThemeGallery = () => setShowThemeGallery(true)
    window.addEventListener('md:open-settings', onSettings)
    window.addEventListener('md:open-shortcuts', onShortcuts)
    window.addEventListener('md:open-css-inject', onCssInject)
    window.addEventListener('md:open-theme-gallery', onThemeGallery)
    return () => {
      window.removeEventListener('md:open-settings', onSettings)
      window.removeEventListener('md:open-shortcuts', onShortcuts)
      window.removeEventListener('md:open-css-inject', onCssInject)
      window.removeEventListener('md:open-theme-gallery', onThemeGallery)
    }
  }, [])

  useEffect(() => {
    if (!window.electronAPI) return
    const unsub: (() => void)[] = []
    unsub.push(
      window.electronAPI.on('update:checking', () => setUpdateMsg('Checking for updates...')),
      window.electronAPI.on('update:available', (v) => {
        setUpdateMsg(`Update ${v} available. Downloading...`)
        setUpdateVersion(v as string)
        window.electronAPI?.update.download()
      }),
      window.electronAPI.on('update:not-available', () => {
        setUpdateMsg('You have the latest version')
        setTimeout(() => setUpdateMsg(null), 3000)
      }),
      window.electronAPI.on('update:error', (err) => {
        setUpdateMsg(`Update error: ${err}`)
        setTimeout(() => setUpdateMsg(null), 5000)
      }),
      window.electronAPI.on('update:progress', (pct) => {
        setUpdateMsg(`Downloading update... ${Math.round(pct as number)}%`)
      }),
      window.electronAPI.on('update:downloaded', () => {
        setUpdateMsg(`Update ${updateVersion} ready. Restart to install.`)
      })
    )
    return () => unsub.forEach((u) => u())
  }, [updateVersion])

  return (
    <>
      <AppShell />
      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {showCssInject && <CssInjectModal onClose={() => setShowCssInject(false)} />}
      {showThemeGallery && <ThemeGalleryModal onClose={() => setShowThemeGallery(false)} />}
      {updateMsg && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--statusbar-bg)', color: 'var(--statusbar-text)',
          padding: '8px 16px', borderRadius: 8, fontSize: 13, zIndex: 2000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: updateMsg.includes('ready') ? 'pointer' : 'default'
        }} onClick={() => {
          if (updateMsg.includes('ready')) {
            window.electronAPI?.update.install()
          }
        }}>
          {updateMsg}
          {updateMsg.includes('ready') && <span style={{ marginLeft: 8, fontWeight: 600 }}>Click to restart</span>}
        </div>
      )}
    </>
  )
}
