import { create } from 'zustand'

export interface OpenFile {
  id: string
  filePath: string | null
  fileName: string
  content: string
  savedContent: string
  isDirty: boolean
}

interface EditorState {
  openFiles: OpenFile[]
  activeFileId: string | null
  autoSave: boolean
  cursorLine: number
  cursorColumn: number
  wordCount: number
  charCount: number

  setActiveFile: (id: string) => void
  openFile: (filePath: string, fileName: string, content: string) => void
  closeFile: (id: string) => void
  updateContent: (id: string, content: string) => void
  markSaved: (id: string, filePath?: string) => void
  setAutoSave: (on: boolean) => void
  setCursorPosition: (line: number, column: number) => void
  setCounts: (words: number, chars: number) => void
  getActiveFile: () => OpenFile | undefined
  newFile: () => string
}

let fileCounter = 0

function persistSession(files: OpenFile[]): void {
  const paths = files.map((f) => f.filePath).filter(Boolean) as string[]
  localStorage.setItem('md-editor-session', JSON.stringify(paths))
}

export const useEditorStore = create<EditorState>((set, get) => ({
  openFiles: [],
  activeFileId: null,
  autoSave: true,
  cursorLine: 1,
  cursorColumn: 1,
  wordCount: 0,
  charCount: 0,

  setActiveFile: (id) => set({ activeFileId: id }),

  openFile: (filePath, fileName, content) => {
    const id = filePath
    const existing = get().openFiles.find((f) => f.id === id)
    if (existing) {
      set({ activeFileId: id })
      return
    }
    const file: OpenFile = {
      id,
      filePath,
      fileName,
      content,
      savedContent: content,
      isDirty: false
    }
    set((s) => ({
      openFiles: [...s.openFiles, file],
      activeFileId: id
    }))
    persistSession(get().openFiles)
  },

  closeFile: (id) => {
    set((s) => {
      const files = s.openFiles.filter((f) => f.id !== id)
      let newActive = s.activeFileId
      if (s.activeFileId === id) {
        const idx = s.openFiles.findIndex((f) => f.id === id)
        newActive = files[Math.min(idx, files.length - 1)]?.id ?? null
      }
      persistSession(files)
      return { openFiles: files, activeFileId: newActive }
    })
  },

  updateContent: (id, content) => {
    set((s) => ({
      openFiles: s.openFiles.map((f) =>
        f.id === id ? { ...f, content, isDirty: content !== f.savedContent } : f
      )
    }))
  },

  markSaved: (id, filePath) => {
    set((s) => ({
      openFiles: s.openFiles.map((f) =>
        f.id === id
          ? { ...f, savedContent: f.content, isDirty: false, ...(filePath ? { filePath } : {}) }
          : f
      )
    }))
  },

  setAutoSave: (on) => set({ autoSave: on }),

  setCursorPosition: (line, column) => set({ cursorLine: line, cursorColumn: column }),

  setCounts: (words, chars) => set({ wordCount: words, charCount: chars }),

  getActiveFile: () => {
    const { openFiles, activeFileId } = get()
    return openFiles.find((f) => f.id === activeFileId)
  },

  newFile: () => {
    fileCounter++
    const id = `file_new_${Date.now()}`
    const file: OpenFile = {
      id,
      filePath: null,
      fileName: `untitled-${fileCounter}.md`,
      content: '',
      savedContent: '',
      isDirty: false
    }
    set((s) => ({
      openFiles: [...s.openFiles, file],
      activeFileId: id
    }))
    return id
  }
}))
