import { useState, useEffect, useCallback } from 'react'
import { Folder, FileText, ChevronRight, ChevronDown, ArrowUp, FolderOpen } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import { useEditorStore } from '../../stores/editorStore'
import type { DirEntry } from '../../../preload/types'

interface TreeNode {
  name: string
  path: string
  isDirectory: boolean
  expanded: boolean
  children: TreeNode[]
  depth: number
}

export function FileTree() {
  const [root, setRoot] = useState<string | null>(null)
  const [tree, setTree] = useState<TreeNode[]>([])
  const [loading, setLoading] = useState(false)

  const refreshDir = useCallback(async (dirPath: string) => {
    if (!window.electronAPI) return
    setLoading(true)
    try {
      const entries = await window.electronAPI.file.getDirectory(dirPath)
      if (!entries) return

      const buildTree = (entries: DirEntry[], depth: number): TreeNode[] => {
        const dirs = entries.filter((e) => e.isDirectory)
        const files = entries.filter((e) => e.isFile && e.name.endsWith('.md'))
        return [
          ...dirs.map((d) => ({ name: d.name, path: d.path, isDirectory: true, expanded: false, children: [], depth })),
          ...files.map((f) => ({ name: f.name, path: f.path, isDirectory: false, expanded: false, children: [], depth }))
        ].sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1
          if (!a.isDirectory && b.isDirectory) return 1
          return a.name.localeCompare(b.name)
        })
      }

      setTree(buildTree(entries, 0))
    } finally {
      setLoading(false)
    }
  }, [])

  const openDir = useCallback(async () => {
    if (!window.electronAPI) return
    const dir = await window.electronAPI.dialog.openDirectory()
    if (dir) {
      setRoot(dir)
      refreshDir(dir)
    }
  }, [refreshDir])

  const toggleNode = useCallback(async (node: TreeNode) => {
    if (!node.isDirectory) {
      if (!window.electronAPI) return
      const content = await window.electronAPI.file.read(node.path)
      if (content !== null) {
        useEditorStore.getState().openFile(node.path, node.name, content)
      }
      return
    }

    setTree((prev) => {
      const update = (nodes: TreeNode[]): TreeNode[] =>
        nodes.map((n) => {
          if (n.path === node.path) {
            return { ...n, expanded: !n.expanded }
          }
          return { ...n, children: update(n.children) }
        })
      return update(prev)
    })

    if (!node.expanded) {
      if (!window.electronAPI) return
      const entries = await window.electronAPI.file.getDirectory(node.path)
      if (!entries) return
      const children: TreeNode[] = entries
        .filter((e) => e.isDirectory || (e.isFile && e.name.endsWith('.md')))
        .map((e) => ({
          name: e.name,
          path: e.path,
          isDirectory: e.isDirectory,
          expanded: false,
          children: [],
          depth: node.depth + 1
        }))
        .sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1
          if (!a.isDirectory && b.isDirectory) return 1
          return a.name.localeCompare(b.name)
        })
      setTree((prev) => {
        const update = (nodes: TreeNode[]): TreeNode[] =>
          nodes.map((n) => {
            if (n.path === node.path) return { ...n, expanded: true, children }
            return { ...n, children: update(n.children) }
          })
        return update(prev)
      })
    }
  }, [])

  useEffect(() => {
    if (window.electronAPI) {
      openDir()
    }
  }, [])

  const renderNode = (node: TreeNode) => (
    <div key={node.path}>
      <div
        onClick={() => toggleNode(node)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 8px',
          paddingLeft: 8 + node.depth * 16,
          cursor: 'pointer',
          fontSize: 13,
          color: 'var(--text-secondary)',
          borderRadius: 3,
          margin: '1px 4px',
          userSelect: 'none'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--button-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        {node.isDirectory ? (
          <>
            {node.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            {node.expanded ? <FolderOpen size={14} color="var(--accent)" /> : <Folder size={14} color="var(--accent)" />}
          </>
        ) : (
          <>
            <span style={{ width: 12 }} />
            <FileText size={14} />
          </>
        )}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.name}
        </span>
      </div>
      {node.expanded && node.children.map(renderNode)}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: 'var(--text-muted)',
          borderBottom: '1px solid var(--border)'
        }}
      >
        Files
        <button
          onClick={openDir}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            borderRadius: 3
          }}
          title="Open folder"
        >
          <FolderOpen size={14} />
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
        {loading && (
          <div style={{ padding: '12px', color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>
            Loading...
          </div>
        )}
        {!root && !loading && (
          <div
            onClick={openDir}
            style={{
              padding: '16px 12px',
              color: 'var(--text-muted)',
              fontSize: 12,
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <FolderOpen size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
            <div>Open a folder</div>
          </div>
        )}
        {tree.map(renderNode)}
      </div>
    </div>
  )
}
