import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  theme: 'dark',
  themeVariables: {
    primaryColor: '#2d2d2d',
    primaryTextColor: '#ccc',
    primaryBorderColor: '#444',
    lineColor: '#888',
    secondaryColor: '#1e1e1e',
    tertiaryColor: '#333'
  },
  startOnLoad: false,
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
})

interface MermaidRendererProps {
  chart: string
}

export function MermaidRenderer({ chart }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const id = useRef(`mermaid-${Math.random().toString(36).slice(2, 9)}`)

  useEffect(() => {
    const render = async () => {
      if (!containerRef.current) return
      containerRef.current.innerHTML = ''
      const { svg } = await mermaid.render(id.current, chart)
      containerRef.current.innerHTML = svg
    }
    render()
  }, [chart])

  return (
    <div
      ref={containerRef}
      style={{
        margin: '16px 0',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'auto'
      }}
    />
  )
}
