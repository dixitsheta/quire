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
import { SearchPanel } from './sidebar/SearchPanel'

export function AppShell() {
  const { showEditor, showPreview, zenMode, showSidebar, splitOrientation } = useUiStore()

  const handleKeyDown = (e: KeyboardEvent) => {
    const store = useEditorStore.getState()
    const ui = useUiStore.getState()

    if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
      switch (e.key) {
        case 'E':
          e.preventDefault()
          ui.toggleSidebar()
          break
        case 'F':
          e.preventDefault()
          ui.toggleZenMode()
          break
        case 'T':
          e.preventDefault()
          ui.toggleToc()
          break
        case 'P':
          e.preventDefault()
          store.newFile()
          break
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const editorVisible = showEditor
  const previewVisible = showPreview

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
              width: '250px',
              minWidth: '200px',
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
                fontSize: '14px'
              }}
            >
              Both panels are hidden. Use View menu or toolbar buttons to show them.
            </div>
          )}
        </div>
      </div>

      {!zenMode && <StatusBar />}
    </div>
  )
}
