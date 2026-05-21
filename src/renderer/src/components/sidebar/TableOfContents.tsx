import { useMemo } from 'react'
import { useEditorStore } from '../../stores/editorStore'
import { useUiStore } from '../../stores/uiStore'

interface TocItem {
  level: number
  text: string
  id: string
}

export function TableOfContents() {
  const getActiveFile = useEditorStore((s) => s.getActiveFile)
  const showToc = useUiStore((s) => s.showToc)

  const activeFile = getActiveFile()

  const toc = useMemo(() => {
    if (!activeFile?.content) return []
    const items: TocItem[] = []
    const regex = /^(#{1,6})\s+(.+)$/gm
    let match: RegExpExecArray | null
    while ((match = regex.exec(activeFile.content)) !== null) {
      items.push({
        level: match[1].length,
        text: match[2].trim(),
        id: match[2].trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      })
    }
    return items
  }, [activeFile?.content])

  if (!showToc || toc.length === 0) return null

  return (
    <div
      style={{
        width: 200,
        minWidth: 180,
        borderLeft: '1px solid var(--border)',
        background: 'var(--sidebar-bg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: 'var(--text-muted)',
          borderBottom: '1px solid var(--border)'
        }}
      >
        Contents
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
        {toc.map((item, i) => (
          <div
            key={i}
            style={{
              padding: '3px 12px',
              paddingLeft: 12 + (item.level - 1) * 12,
              fontSize: 12 + (6 - item.level) * 0.5,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              borderRadius: 3,
              margin: '1px 4px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--button-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  )
}
