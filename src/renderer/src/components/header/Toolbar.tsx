import { useCallback } from 'react'
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, CheckSquare, Code, Quote, Link, Image,
  Table, Minus, Sigma, GitBranch, Undo2, Redo2, SplitSquareVertical
} from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'
import { useUiStore } from '../../stores/uiStore'

export function Toolbar() {
  const getActiveFile = useEditorStore((s) => s.getActiveFile)
  const updateContent = useEditorStore((s) => s.updateContent)
  const { splitOrientation, setSplitOrientation } = useUiStore()

  const exec = useCallback(
    (before: string, after = '', placeholder = '') => {
      const file = getActiveFile()
      if (!file) return

      const textarea = document.querySelector('.monaco-editor textarea') as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
        document.execCommand('insertText', false, before + placeholder + after)
        return
      }

      const newContent = file.content + `\n${before}${placeholder}${after}\n`
      updateContent(file.id, newContent)
    },
    [getActiveFile, updateContent]
  )

  const insertWrap = useCallback(
    (wrapper: string) => {
      const file = getActiveFile()
      if (!file) return
      const newContent = file.content + `\n${wrapper}\n\n${wrapper}\n`
      updateContent(file.id, newContent)
    },
    [getActiveFile, updateContent]
  )

  const btnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 28,
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    borderRadius: 4,
    fontSize: 13
  }

  const separator: React.CSSProperties = {
    width: 1,
    height: 18,
    background: 'var(--border)',
    margin: '0 2px'
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: '2px 8px',
        background: 'var(--toolbar-bg)',
        borderBottom: '1px solid var(--toolbar-border)',
        WebkitAppRegion: 'no-drag' as unknown as string,
        flexWrap: 'wrap'
      }}
    >
      <button style={btnStyle} onClick={() => exec('**', '**', 'bold')} title="Bold (Cmd+B)">
        <Bold size={15} />
      </button>
      <button style={btnStyle} onClick={() => exec('*', '*', 'italic')} title="Italic (Cmd+I)">
        <Italic size={15} />
      </button>
      <button style={btnStyle} onClick={() => exec('~~', '~~', 'strikethrough')} title="Strikethrough">
        <Strikethrough size={15} />
      </button>

      <div style={separator} />

      <button style={btnStyle} onClick={() => exec('# ', '', 'Heading 1')} title="Heading 1">
        <Heading1 size={15} />
      </button>
      <button style={btnStyle} onClick={() => exec('## ', '', 'Heading 2')} title="Heading 2">
        <Heading2 size={15} />
      </button>
      <button style={btnStyle} onClick={() => exec('### ', '', 'Heading 3')} title="Heading 3">
        <Heading3 size={15} />
      </button>

      <div style={separator} />

      <button style={btnStyle} onClick={() => exec('- ')} title="Unordered List">
        <List size={15} />
      </button>
      <button style={btnStyle} onClick={() => exec('1. ')} title="Ordered List">
        <ListOrdered size={15} />
      </button>
      <button style={btnStyle} onClick={() => exec('- [ ] ')} title="Task List">
        <CheckSquare size={15} />
      </button>

      <div style={separator} />

      <button style={btnStyle} onClick={() => insertWrap('```')} title="Code Block">
        <Code size={15} />
      </button>
      <button style={btnStyle} onClick={() => exec('> ', '', 'quote')} title="Blockquote">
        <Quote size={15} />
      </button>
      <button style={btnStyle} onClick={() => exec('[', '](url)', 'link text')} title="Link">
        <Link size={15} />
      </button>
      <button style={btnStyle} onClick={() => exec('![', '](url)', 'alt text')} title="Image">
        <Image size={15} />
      </button>

      <div style={separator} />

      <button
        style={btnStyle}
        onClick={() => {
          const file = getActiveFile()
          if (!file) return
          updateContent(
            file.id,
            file.content +
              '\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n'
          )
        }}
        title="Insert Table"
      >
        <Table size={15} />
      </button>
      <button style={btnStyle} onClick={() => exec('\n---\n')} title="Horizontal Rule">
        <Minus size={15} />
      </button>

      <div style={separator} />

      <button
        style={btnStyle}
        onClick={() => exec('$$', '$$', '\\sum_{i=1}^{n} i')}
        title="Math Block"
      >
        <Sigma size={15} />
      </button>
      <button
        style={btnStyle}
        onClick={() => {
          const file = getActiveFile()
          if (!file) return
          updateContent(
            file.id,
            file.content +
              '\n```mermaid\ngraph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;\n```\n'
          )
        }}
        title="Insert Mermaid Diagram"
      >
        <GitBranch size={15} />
      </button>

      <div style={separator} />

      <button
        style={{
          ...btnStyle,
          color: splitOrientation === 'horizontal' ? 'var(--accent)' : 'var(--text-secondary)'
        }}
        onClick={() =>
          setSplitOrientation(splitOrientation === 'vertical' ? 'horizontal' : 'vertical')
        }
        title="Toggle Split Orientation"
      >
        <SplitSquareVertical size={15} />
      </button>
    </div>
  )
}
