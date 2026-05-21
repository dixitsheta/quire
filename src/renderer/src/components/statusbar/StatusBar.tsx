import { ToggleLeft, ToggleRight } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'

export function StatusBar() {
  const { cursorLine, cursorColumn, wordCount, charCount, autoSave, setAutoSave } =
    useEditorStore()
  const getActiveFile = useEditorStore((s) => s.getActiveFile)
  const activeFile = getActiveFile()

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '0 10px',
    height: '100%',
    fontSize: 12,
    color: 'var(--statusbar-text)',
    cursor: 'default',
    whiteSpace: 'nowrap'
  }

  const clickable: React.CSSProperties = {
    ...itemStyle,
    cursor: 'pointer'
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 24,
        background: 'var(--statusbar-bg)',
        borderTop: '1px solid var(--border)',
        fontSize: 12,
        color: 'var(--statusbar-text)',
        WebkitAppRegion: 'no-drag' as unknown as string,
        flexShrink: 0,
        gap: 0
      }}
    >
      <div
        style={clickable}
        onClick={() => setAutoSave(!autoSave)}
        title="Toggle auto-save"
      >
        {autoSave ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
        <span>Auto-save: {autoSave ? 'ON' : 'OFF'}</span>
      </div>

      <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />

      <div style={itemStyle}>
        Ln {cursorLine}, Col {cursorColumn}
      </div>

      <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />

      <div style={itemStyle}>
        Words: {wordCount}
      </div>

      <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />

      <div style={itemStyle}>
        Chars: {charCount}
      </div>

      <div style={{ flex: 1 }} />

      <div style={itemStyle}>
        UTF-8
      </div>

      {activeFile?.filePath && (
        <>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />
          <div
            style={{
              ...itemStyle,
              maxWidth: 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            title={activeFile.filePath}
          >
            {activeFile.filePath}
          </div>
        </>
      )}
    </div>
  )
}
