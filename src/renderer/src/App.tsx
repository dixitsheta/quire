import { useEffect } from 'react'
import { useUiStore } from './stores/uiStore'
import { useEditorStore } from './stores/editorStore'
import { AppShell } from './components/AppShell'

export default function App() {
  const theme = useUiStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const editorStore = useEditorStore.getState()
    if (editorStore.openFiles.length === 0) {
      editorStore.newFile()
    }
  }, [])

  return <AppShell />
}
