import { X } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'

interface CssInjectModalProps {
  onClose: () => void
}

export function CssInjectModal({ onClose }: CssInjectModalProps) {
  const customCSS = useSettingsStore((s) => s.customCSS)
  const setCustomCSS = useSettingsStore((s) => s.setCustomCSS)

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
    width: 560,
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Custom CSS</h2>
          <button onClick={onClose} style={{ display: 'flex', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
        <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--text-muted)' }}>
          Write CSS to style the preview pane. Changes apply in real time.
        </p>
        <textarea
          value={customCSS}
          onChange={(e) => setCustomCSS(e.target.value)}
          placeholder="/* e.g. */
.md-preview h1 { color: #e06c75; }
.md-preview p { line-height: 1.8; }
.md-preview img { border-radius: 8px; }"
          style={{
            flex: 1,
            minHeight: 300,
            padding: 12,
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
            color: 'var(--text-primary)',
            borderRadius: 8,
            fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
            fontSize: 13,
            lineHeight: 1.5,
            resize: 'vertical',
            outline: 'none'
          }}
        />
        <button
          onClick={() => setCustomCSS('')}
          style={{
            marginTop: 12,
            padding: '6px 14px',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
            alignSelf: 'flex-end'
          }}
        >
          Clear
        </button>
      </div>
    </div>
  )
}
