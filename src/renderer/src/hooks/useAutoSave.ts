import { useEffect, useRef, useCallback } from 'react'
import { useEditorStore } from '../stores/editorStore'

export function useAutoSave() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const unsub = useEditorStore.subscribe((state, prev) => {
      if (!state.autoSave) return
      const activeFile = state.openFiles.find((f) => f.id === state.activeFileId)
      if (!activeFile || !activeFile.isDirty || !activeFile.filePath) return

      if (timerRef.current) clearTimeout(timerRef.current)

      timerRef.current = setTimeout(async () => {
        if (!window.electronAPI) return
        try {
          await window.electronAPI.file.save(activeFile.filePath, activeFile.content)
          useEditorStore.getState().markSaved(activeFile.id)
        } catch {
          // Silently fail on auto-save
        }
      }, 1500)
    })

    return () => {
      unsub()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])
}
