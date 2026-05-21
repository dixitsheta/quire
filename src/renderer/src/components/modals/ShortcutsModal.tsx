import { X, Command } from 'lucide-react'

interface ShortcutsModalProps {
  onClose: () => void
}

const shortcuts = [
  { keys: 'Cmd+N', action: 'New file' },
  { keys: 'Cmd+O', action: 'Open file' },
  { keys: 'Cmd+S', action: 'Save' },
  { keys: 'Cmd+Shift+S', action: 'Save As' },
  { keys: 'Cmd+Z', action: 'Undo' },
  { keys: 'Cmd+Shift+Z', action: 'Redo' },
  { keys: 'Cmd+B', action: 'Bold text' },
  { keys: 'Cmd+I', action: 'Italic text' },
  { keys: 'Cmd+F', action: 'Search in document' },
  { keys: 'Cmd+1', action: 'Toggle editor' },
  { keys: 'Cmd+2', action: 'Toggle preview' },
  { keys: 'Cmd+3', action: 'Show both panels' },
  { keys: 'Cmd+B', action: 'Toggle sidebar' },
  { keys: 'Cmd+\\', action: 'Toggle split orientation' },
  { keys: 'Cmd+Shift+F', action: 'Toggle zen mode' },
  { keys: 'Cmd+Shift+T', action: 'Toggle table of contents' },
  { keys: 'Cmd+Shift+P', action: 'New file' },
  { keys: 'Cmd+/', action: 'Show keyboard shortcuts' },
  { keys: 'F11', action: 'Toggle full screen' }
]

export function ShortcutsModal({ onClose }: ShortcutsModalProps) {
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
    minWidth: 400,
    maxWidth: 500,
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Command size={18} /> Keyboard Shortcuts
          </h2>
          <button onClick={onClose} style={{ display: 'flex', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {shortcuts.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: 6,
                background: i % 2 === 0 ? 'transparent' : 'var(--button-hover)'
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{s.action}</span>
              <kbd
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  fontSize: 12,
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  color: 'var(--accent)',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 4
                }}
              >
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
