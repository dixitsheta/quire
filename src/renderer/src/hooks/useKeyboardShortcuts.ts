import { useEffect } from 'react'
import { useUiStore } from '../stores/uiStore'
import { useEditorStore } from '../stores/editorStore'

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return

      const ui = useUiStore.getState()
      const editor = useEditorStore.getState()

      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault()
          if (e.shiftKey) {
            handleSaveAs()
          } else {
            handleSave()
          }
          break
        case 'o':
          if (!e.shiftKey) {
            e.preventDefault()
            handleOpen()
          }
          break
        case 'n':
          if (!e.shiftKey && !e.altKey) {
            e.preventDefault()
            editor.newFile()
          }
          break
        case '1':
          if (!e.shiftKey) {
            e.preventDefault()
            ui.toggleEditor()
          }
          break
        case '2':
          if (!e.shiftKey) {
            e.preventDefault()
            ui.togglePreview()
          }
          break
        case '3':
          if (!e.shiftKey) {
            e.preventDefault()
            ui.showBoth()
          }
          break
        case 'b':
          if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault()
            ui.toggleSidebar()
          }
          break
        case '\\':
          e.preventDefault()
          ui.setSplitOrientation(ui.splitOrientation === 'vertical' ? 'horizontal' : 'vertical')
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}

async function handleSave() {
  const store = useEditorStore.getState()
  const active = store.getActiveFile()
  if (!active || !window.electronAPI) return

  if (active.filePath) {
    await window.electronAPI.file.save(active.filePath, active.content)
    store.markSaved(active.id)
  } else {
    await handleSaveAs()
  }
}

async function handleSaveAs() {
  const store = useEditorStore.getState()
  const active = store.getActiveFile()
  if (!active || !window.electronAPI) return

  const result = await window.electronAPI.file.saveAs(active.content)
  if (result) {
    store.markSaved(active.id, result.filePath)
  }
}

async function handleOpen() {
  if (!window.electronAPI) return
  const result = await window.electronAPI.file.open()
  if (result) {
    result.forEach((f) => {
      useEditorStore.getState().openFile(f.filePath, f.fileName, f.content)
    })
  }
}
