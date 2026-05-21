import { X } from 'lucide-react'
import { useUiStore, type ThemeName } from '../../stores/uiStore'

interface ThemeGalleryModalProps {
  onClose: () => void
}

const allThemes: { name: ThemeName; label: string }[] = [
  { name: 'dark', label: 'Dark' },
  { name: 'light', label: 'Light' },
  { name: 'sepia', label: 'Sepia' },
  { name: 'high-contrast', label: 'High Contrast' },
  { name: 'nord', label: 'Nord' },
  { name: 'dracula', label: 'Dracula' },
  { name: 'solarized-dark', label: 'Solarized Dark' },
  { name: 'solarized-light', label: 'Solarized Light' },
  { name: 'github-dark', label: 'GitHub Dark' },
  { name: 'github-light', label: 'GitHub Light' },
  { name: 'one-dark', label: 'One Dark' },
  { name: 'one-light', label: 'One Light' }
]

const themeColors: Record<string, { bg: string; text: string; accent: string; border: string }> = {
  'dark': { bg: '#1e1e1e', text: '#cccccc', accent: '#0078d4', border: '#333' },
  'light': { bg: '#ffffff', text: '#1f1f1f', accent: '#0078d4', border: '#e0e0e0' },
  'sepia': { bg: '#fbf1c9', text: '#433422', accent: '#aa6f3a', border: '#d8cba3' },
  'high-contrast': { bg: '#000000', text: '#ffffff', accent: '#6fc3ff', border: '#6fc3ff' },
  'nord': { bg: '#2e3440', text: '#eceff4', accent: '#88c0d0', border: '#4c566a' },
  'dracula': { bg: '#282a36', text: '#f8f8f2', accent: '#bd93f9', border: '#44475a' },
  'solarized-dark': { bg: '#002b36', text: '#839496', accent: '#2aa198', border: '#124352' },
  'solarized-light': { bg: '#fdf6e3', text: '#657b83', accent: '#268bd2', border: '#d5cfb8' },
  'github-dark': { bg: '#0d1117', text: '#c9d1d9', accent: '#58a6ff', border: '#30363d' },
  'github-light': { bg: '#ffffff', text: '#24292f', accent: '#0969da', border: '#d0d7de' },
  'one-dark': { bg: '#282c34', text: '#abb2bf', accent: '#61afef', border: '#3e4452' },
  'one-light': { bg: '#fafafa', text: '#383a42', accent: '#4078f2', border: '#e0e0e0' }
}

export function ThemeGalleryModal({ onClose }: ThemeGalleryModalProps) {
  const currentTheme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)

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
    width: 640,
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Theme Gallery</h2>
          <button onClick={onClose} style={{ display: 'flex', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {allThemes.map((t) => {
            const c = themeColors[t.name]
            const isActive = currentTheme === t.name
            return (
              <button
                key={t.name}
                onClick={() => setTheme(t.name)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: isActive ? '2px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 12,
                  cursor: 'pointer',
                  background: c.bg,
                  textAlign: 'left',
                  transition: 'border-color 0.15s',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: c.accent }} />
                  <span style={{ width: 16, height: 16, borderRadius: '50%', border: `1px solid ${c.border}`, background: c.bg }} />
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: c.text, opacity: 0.3 }} />
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: c.border }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 4 }}>{t.label}</div>
                <div style={{ height: 4, borderRadius: 2, background: c.border, marginBottom: 4 }} />
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ flex: 1, height: 6, borderRadius: 2, background: c.accent }} />
                  <span style={{ flex: 2, height: 6, borderRadius: 2, background: c.border }} />
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <span style={{ flex: 1, height: 4, borderRadius: 2, background: c.border }} />
                  <span style={{ flex: 1, height: 4, borderRadius: 2, background: c.border, opacity: 0.5 }} />
                </div>
                {isActive && (
                  <span style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'var(--accent)', color: '#fff',
                    fontSize: 10, padding: '1px 6px', borderRadius: 8,
                    fontWeight: 600
                  }}>
                    Active
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
