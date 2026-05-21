import { useCallback } from 'react'
import { X, Circle } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'

export function FileTabs() {
  const { openFiles, activeFileId, setActiveFile, closeFile } = useEditorStore()

  if (openFiles.length === 0) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 35,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--tab-border)',
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitAppRegion: 'no-drag' as unknown as string
      }}
    >
      {openFiles.map((file) => {
        const isActive = file.id === activeFileId
        return (
          <div
            key={file.id}
            onClick={() => setActiveFile(file.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 12px',
              height: '100%',
              cursor: 'pointer',
              borderRight: '1px solid var(--tab-border)',
              background: isActive ? 'var(--tab-active-bg)' : 'var(--tab-inactive-bg)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              fontSize: 13,
              whiteSpace: 'nowrap',
              userSelect: 'none',
              minWidth: 0,
              flexShrink: 0
            }}
          >
            {file.isDirty && (
              <Circle size={10} fill="var(--accent)" color="var(--accent)" />
            )}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {file.fileName}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeFile(file.id)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 18,
                height: 18,
                border: 'none',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                borderRadius: 3,
                padding: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--button-hover)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              <X size={13} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
