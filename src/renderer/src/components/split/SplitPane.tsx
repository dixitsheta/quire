import { useState, useRef, useCallback, type ReactNode } from 'react'

interface SplitPaneProps {
  children: [ReactNode, ReactNode]
  orientation: 'vertical' | 'horizontal'
}

export function SplitPane({ children, orientation }: SplitPaneProps) {
  const [splitPos, setSplitPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const isVertical = orientation === 'vertical'

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dragging.current = true
    document.body.style.cursor = isVertical ? 'col-resize' : 'row-resize'
    document.body.style.userSelect = 'none'
  }, [isVertical])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pos = isVertical
      ? ((e.clientX - rect.left) / rect.width) * 100
      : ((e.clientY - rect.top) / rect.height) * 100
    setSplitPos(Math.min(Math.max(pos, 15), 85))
  }, [isVertical])

  const handleMouseUp = useCallback(() => {
    dragging.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: isVertical ? 'row' : 'column',
        overflow: 'hidden',
        minHeight: 0,
        minWidth: 0
      }}
    >
      <div
        style={{
          [isVertical ? 'width' : 'height']: `${splitPos}%`,
          overflow: 'hidden',
          minHeight: 0,
          minWidth: 0,
          display: 'flex'
        }}
      >
        {children[0]}
      </div>

      <div
        onMouseDown={handleMouseDown}
        style={{
          [isVertical ? 'width' : 'height']: 5,
          [isVertical ? 'cursor' : 'cursor']: isVertical ? 'col-resize' : 'row-resize',
          background: 'var(--border)',
          flexShrink: 0,
          position: 'relative',
          zIndex: 10
        }}
      >
        <div
          style={{
            position: 'absolute',
            [isVertical ? 'left' : 'top']: '50%',
            [isVertical ? 'top' : 'left']: '50%',
            transform: 'translate(-50%, -50%)',
            width: isVertical ? 4 : 24,
            height: isVertical ? 24 : 4,
            borderRadius: 2,
            background: 'var(--accent)',
            opacity: 0,
            transition: 'opacity 0.15s'
          }}
          className="split-handle-indicator"
        />
      </div>

      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          minHeight: 0,
          minWidth: 0,
          display: 'flex'
        }}
      >
        {children[1]}
      </div>
    </div>
  )
}
