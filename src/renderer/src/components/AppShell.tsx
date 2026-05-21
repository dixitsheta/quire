import { useEffect } from 'react'
import { useUiStore } from '../stores/uiStore'
import { useEditorStore } from '../stores/editorStore'
import { Header } from './header/Header'
import { Toolbar } from './header/Toolbar'
import { FileTabs } from './header/FileTabs'
import { SplitPane } from './split/SplitPane'
import { MarkdownEditor } from './editor/MarkdownEditor'
import { MarkdownPreview } from './preview/MarkdownPreview'
import { StatusBar } from './statusbar/StatusBar'
import { FileTree } from './sidebar/FileTree'
import { TableOfContents } from './sidebar/TableOfContents'

export function AppShell() {
  const { showEditor, showPreview, zenMode, showSidebar, showToc, splitOrientation } = useUiStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ui = useUiStore.getState()
      const editor = useEditorStore.getState()

      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'e':
            e.preventDefault()
            ui.toggleSidebar()
            break
          case 'f':
            e.preventDefault()
            ui.toggleZenMode()
            break
          case 't':
            e.preventDefault()
            ui.toggleToc()
            break
          case 'p':
            e.preventDefault()
            editor.newFile()
            break
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const editorVisible = zenMode ? true : showEditor
  const previewVisible = zenMode ? true : showPreview

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--bg-primary)'
      }}
    >
      {!zenMode && (
        <>
          <div
            style={{
              WebkitAppRegion: 'drag' as unknown as string,
              height: '38px',
              background: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '90px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              borderBottom: '1px solid var(--border)',
              userSelect: 'none'
            }}
          >
            MD Editor
          </div>
          <Header />
          <Toolbar />
          <FileTabs />
        </>
      )}

      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden'
        }}
      >
        {showSidebar && (
          <div
            style={{
              width: 250,
              minWidth: 200,
              borderRight: '1px solid var(--border)',
              background: 'var(--sidebar-bg)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <FileTree />
          </div>
        )}

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: splitOrientation === 'horizontal' ? 'column' : 'row',
            overflow: 'hidden'
          }}
        >
          {editorVisible && previewVisible ? (
            <SplitPane orientation={splitOrientation}>
              <MarkdownEditor />
              <MarkdownPreview />
            </SplitPane>
          ) : editorVisible ? (
            <MarkdownEditor />
          ) : previewVisible ? (
            <MarkdownPreview />
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: 14
              }}
            >
              Both panels are hidden. Use toolbar buttons to show them.
            </div>
          )}
        </div>

        {showToc && <TableOfContents />}
      </div>

      {!zenMode && <StatusBar />}

      {zenMode && (
        <div
          style={{
            position: 'fixed',
            top: 12,
            right: 16,
            display: 'flex',
            gap: 8,
            zIndex: 100
          }}
        >
          <button
            onClick={() => useUiStore.getState().toggleZenMode()}
            style={{
              padding: '6px 14px',
              border: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              opacity: 0.6
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
          >
            Exit Zen Mode
          </button>
        </div>
      )}
    </div>
  )
}
