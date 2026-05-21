import { useCallback, useState } from 'react'
import { X, FileDown, FileText } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'

interface ExportModalProps {
  onClose: () => void
}

export function ExportModal({ onClose }: ExportModalProps) {
  const getActiveFile = useEditorStore((s) => s.getActiveFile)
  const activeFile = getActiveFile()
  const [exporting, setExporting] = useState(false)

  const handleExportHtml = useCallback(() => {
    if (!activeFile) return
    const content = activeFile.content
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${activeFile.fileName.replace('.md', '')}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.0/styles/github-dark.min.css">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 900px; margin: 0 auto; padding: 40px 24px; line-height: 1.7; color: #1f1f1f; background: #fff; }
    h1, h2, h3 { margin-top: 24px; margin-bottom: 16px; }
    h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 6px; }
    pre { background: #f5f5f5; padding: 16px; border-radius: 6px; overflow-x: auto; }
    code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.875em; }
    blockquote { border-left: 4px solid #0078d4; padding: 0 16px; color: #666; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f5f5f5; }
    img { max-width: 100%; }
  </style>
</head>
<body>
  <div class="content">${escapeHtml(content)}</div>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = activeFile.fileName.replace('.md', '.html')
    a.click()
    URL.revokeObjectURL(url)
    onClose()
  }, [activeFile, onClose])

  const handleExportPdf = useCallback(() => {
    window.print()
    onClose()
  }, [onClose])

  if (!activeFile) return null

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'var(--overlay-bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000
  }

  const modalStyle: React.CSSProperties = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 24,
    minWidth: 360,
    maxWidth: 440,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Export</h2>
          <button onClick={onClose} style={{ display: 'flex', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
          Export "{activeFile.fileName}" as:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={handleExportHtml}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', border: '1px solid var(--border)',
              background: 'var(--input-bg)', color: 'var(--text-primary)',
              borderRadius: 8, cursor: 'pointer', fontSize: 14
            }}
          >
            <FileDown size={18} color="var(--accent)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 500 }}>HTML</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Export as standalone HTML file</div>
            </div>
          </button>

          <button
            onClick={handleExportPdf}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', border: '1px solid var(--border)',
              background: 'var(--input-bg)', color: 'var(--text-primary)',
              borderRadius: 8, cursor: 'pointer', fontSize: 14
            }}
          >
            <FileText size={18} color="var(--accent)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 500 }}>PDF</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Export as PDF via browser print</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
