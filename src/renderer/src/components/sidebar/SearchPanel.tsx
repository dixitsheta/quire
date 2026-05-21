import { useState, useCallback, useEffect, useRef } from 'react'
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'

interface SearchMatch {
  line: number
  column: number
  text: string
}

export function SearchPanel() {
  const [query, setQuery] = useState('')
  const [matches, setMatches] = useState<SearchMatch[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const getActiveFile = useEditorStore((s) => s.getActiveFile)
  const activeFile = getActiveFile()

  const doSearch = useCallback(
    (q: string) => {
      setQuery(q)
      if (!q || !activeFile?.content) {
        setMatches([])
        return
      }
      const lines = activeFile.content.split('\n')
      const results: SearchMatch[] = []
      const lower = q.toLowerCase()
      lines.forEach((line, i) => {
        const idx = line.toLowerCase().indexOf(lower)
        if (idx !== -1) {
          results.push({ line: i + 1, column: idx + 1, text: line.trim() })
        }
      })
      setMatches(results)
      setActiveIndex(0)
    },
    [activeFile?.content]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.shiftKey) {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : matches.length - 1))
      } else {
        setActiveIndex((prev) => (prev < matches.length - 1 ? prev + 1 : 0))
      }
    }
    if (e.key === 'Escape') {
      setQuery('')
      setMatches([])
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!query && matches.length === 0) {
    return null
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        width: 300,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 100,
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', gap: 4 }}>
        <Search size={14} style={{ color: 'var(--text-muted)' }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => doSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-primary)',
            outline: 'none',
            fontSize: 13
          }}
          autoFocus
        />
        {matches.length > 0 && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {activeIndex + 1}/{matches.length}
          </span>
        )}
        <button
          onClick={() => { setQuery(''); setMatches([]) }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            borderRadius: 3
          }}
        >
          <X size={14} />
        </button>
      </div>
      {matches.length > 0 && (
        <div
          style={{
            maxHeight: 200,
            overflow: 'auto',
            borderTop: '1px solid var(--border)',
            padding: '4px 0'
          }}
        >
          {matches.map((m, i) => (
            <div
              key={i}
              style={{
                padding: '2px 12px',
                fontSize: 12,
                color: 'var(--text-secondary)',
                background: i === activeIndex ? 'var(--button-active)' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <span style={{ color: 'var(--text-muted)', marginRight: 8 }}>
                Ln {m.line}
              </span>
              {m.text.slice(0, 80)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
