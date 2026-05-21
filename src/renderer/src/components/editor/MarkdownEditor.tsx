import { useCallback, useRef, useEffect } from 'react'
import Editor, { type OnMount, type OnChange } from '@monaco-editor/react'
import { useEditorStore } from '../../stores/editorStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useUiStore } from '../../stores/uiStore'

export function MarkdownEditor() {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
  const getActiveFile = useEditorStore((s) => s.getActiveFile)
  const updateContent = useEditorStore((s) => s.updateContent)
  const setCursorPosition = useEditorStore((s) => s.setCursorPosition)
  const setCounts = useEditorStore((s) => s.setCounts)
  const { fontSize, tabSize, wordWrap, minimap, lineNumbers } = useSettingsStore()
  const { theme } = useUiStore()

  const activeFile = getActiveFile()

  const handleEditorDidMount: OnMount = useCallback((editor) => {
    editorRef.current = editor

    editor.onDidChangeCursorPosition((e) => {
      useEditorStore.getState().setCursorPosition(e.position.lineNumber, e.position.column)
    })

    editor.onDidChangeModelContent(() => {
      const model = editor.getModel()
      if (!model) return
      const value = model.getValue()
      const words = value.trim() ? value.trim().split(/\s+/).length : 0
      const chars = value.length
      useEditorStore.getState().setCounts(words, chars)
    })
  }, [])

  const handleChange: OnChange = useCallback(
    (value) => {
      const file = getActiveFile()
      if (file && value !== undefined) {
        updateContent(file.id, value)
      }
    },
    [getActiveFile, updateContent]
  )

  const editorTheme = theme === 'light' || theme === 'github-light' || theme === 'one-light' || theme === 'solarized-light'
    ? 'vs' : 'vs-dark'

  return (
    <div style={{ flex: 1, overflow: 'hidden', background: 'var(--bg-editor)' }}>
      <Editor
        key={activeFile?.id ?? 'empty'}
        height="100%"
        defaultLanguage="markdown"
        theme={editorTheme}
        value={activeFile?.content ?? ''}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize,
          tabSize,
          wordWrap: wordWrap as 'on' | 'off' | 'wordWrapColumn',
          minimap: { enabled: minimap },
          lineNumbers: lineNumbers ? 'on' : 'off',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          bracketPairColorization: { enabled: true },
          matchBrackets: 'always',
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          padding: { top: 16 },
          lineHeight: 24,
          folding: true,
          foldingHighlight: true,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'all',
          fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', 'Consolas', monospace",
          fontLigatures: true
        }}
      />
    </div>
  )
}
