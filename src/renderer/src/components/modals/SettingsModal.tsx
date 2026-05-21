import { X } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import { useUiStore, type ThemeName } from '../../stores/uiStore'

interface SettingsModalProps {
  onClose: () => void
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { fontSize, tabSize, wordWrap, minimap, lineNumbers, setFontSize, setTabSize, setWordWrap, setMinimap, setLineNumbers } = useSettingsStore()
  const { theme, setTheme } = useUiStore()

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

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    color: 'var(--text-secondary)',
    marginBottom: 6,
    fontWeight: 500
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid var(--border)'
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Settings</h2>
          <button onClick={onClose} style={{ display: 'flex', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Font Size</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Editor font size in pixels</div>
          </div>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Math.max(10, Math.min(32, parseInt(e.target.value) || 14)))}
            style={{
              width: 64, padding: '4px 8px',
              background: 'var(--input-bg)', border: '1px solid var(--input-border)',
              color: 'var(--text-primary)', borderRadius: 4, textAlign: 'center'
            }}
          />
        </div>

        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Tab Size</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Spaces per tab</div>
          </div>
          <select
            value={tabSize}
            onChange={(e) => setTabSize(parseInt(e.target.value))}
            style={{
              padding: '4px 8px',
              background: 'var(--input-bg)', border: '1px solid var(--input-border)',
              color: 'var(--text-primary)', borderRadius: 4
            }}
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={8}>8</option>
          </select>
        </div>

        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Word Wrap</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Wrap long lines in editor</div>
          </div>
          <select
            value={wordWrap}
            onChange={(e) => setWordWrap(e.target.value as 'on' | 'off' | 'wordWrapColumn')}
            style={{
              padding: '4px 8px',
              background: 'var(--input-bg)', border: '1px solid var(--input-border)',
              color: 'var(--text-primary)', borderRadius: 4
            }}
          >
            <option value="on">On</option>
            <option value="off">Off</option>
            <option value="wordWrapColumn">Column</option>
          </select>
        </div>

        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Minimap</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Show code minimap</div>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: 40, height: 22, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={minimap}
              onChange={(e) => setMinimap(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute', inset: 0, background: minimap ? 'var(--accent)' : 'var(--border)',
              borderRadius: 11, transition: '0.2s'
            }}>
              <span style={{
                position: 'absolute', left: minimap ? 20 : 3, top: 3,
                width: 16, height: 16, background: '#fff', borderRadius: '50%', transition: '0.2s'
              }} />
            </span>
          </label>
        </div>

        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Line Numbers</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Show line numbers in gutter</div>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: 40, height: 22, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={lineNumbers}
              onChange={(e) => setLineNumbers(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute', inset: 0, background: lineNumbers ? 'var(--accent)' : 'var(--border)',
              borderRadius: 11, transition: '0.2s'
            }}>
              <span style={{
                position: 'absolute', left: lineNumbers ? 20 : 3, top: 3,
                width: 16, height: 16, background: '#fff', borderRadius: '50%', transition: '0.2s'
              }} />
            </span>
          </label>
        </div>

        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Theme</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Color theme (also in View menu)</div>
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeName)}
            style={{
              padding: '4px 8px',
              background: 'var(--input-bg)', border: '1px solid var(--input-border)',
              color: 'var(--text-primary)', borderRadius: 4
            }}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="sepia">Sepia</option>
            <option value="high-contrast">High Contrast</option>
            <option value="nord">Nord</option>
            <option value="dracula">Dracula</option>
            <option value="solarized-dark">Solarized Dark</option>
            <option value="solarized-light">Solarized Light</option>
            <option value="github-dark">GitHub Dark</option>
            <option value="github-light">GitHub Light</option>
            <option value="one-dark">One Dark</option>
            <option value="one-light">One Light</option>
          </select>
        </div>
      </div>
    </div>
  )
}
