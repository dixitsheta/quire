import { useEffect, useRef } from 'react'

export function useScrollSync(editorRef: React.RefObject<HTMLDivElement | null>, previewRef: React.RefObject<HTMLDivElement | null>) {
  const syncing = useRef(false)

  useEffect(() => {
    const editor = editorRef.current
    const preview = previewRef.current
    if (!editor || !preview) return

    const onEditorScroll = () => {
      if (syncing.current) return
      syncing.current = true
      const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight)
      preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight)
      requestAnimationFrame(() => { syncing.current = false })
    }

    const onPreviewScroll = () => {
      if (syncing.current) return
      syncing.current = true
      const ratio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight)
      editor.scrollTop = ratio * (editor.scrollHeight - editor.clientHeight)
      requestAnimationFrame(() => { syncing.current = false })
    }

    editor.addEventListener('scroll', onEditorScroll)
    preview.addEventListener('scroll', onPreviewScroll)

    return () => {
      editor.removeEventListener('scroll', onEditorScroll)
      preview.removeEventListener('scroll', onPreviewScroll)
    }
  }, [editorRef.current, previewRef.current])
}
