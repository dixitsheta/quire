import { useMemo, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { useEditorStore } from '../../stores/editorStore'

import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'

export function MarkdownPreview() {
  const getActiveFile = useEditorStore((s) => s.getActiveFile)
  const previewRef = useRef<HTMLDivElement>(null)
  const activeFile = getActiveFile()

  const content = activeFile?.content ?? ''

  return (
    <div
      ref={previewRef}
      style={{
        flex: 1,
        overflow: 'auto',
        background: 'var(--bg-preview)',
        position: 'relative'
      }}
    >
      {content ? (
        <div className="md-preview">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
            components={{
              a: ({ href, children, ...props }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              ),
              input: (props) => <input {...props} />,
              pre: ({ children, ...props }) => (
                <pre {...props}>{children}</pre>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-muted)',
            fontSize: 14
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>
              ✨
            </div>
            <div>Start typing to see the preview</div>
          </div>
        </div>
      )}
    </div>
  )
}
