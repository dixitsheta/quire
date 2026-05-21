import { create } from 'zustand'

interface FileEntry {
  name: string
  path: string
  isDirectory: boolean
  isFile: boolean
  size: number
  mtimeMs: number
}

interface SettingsState {
  currentDir: string | null
  directoryEntries: FileEntry[]
  recentFiles: string[]
  fontSize: number
  tabSize: number
  wordWrap: 'on' | 'off' | 'wordWrapColumn'
  minimap: boolean
  lineNumbers: boolean

  setCurrentDir: (dir: string | null) => void
  setDirectoryEntries: (entries: FileEntry[]) => void
  addRecentFile: (filePath: string) => void
  setFontSize: (size: number) => void
  setTabSize: (size: number) => void
  setWordWrap: (wrap: 'on' | 'off' | 'wordWrapColumn') => void
  setMinimap: (show: boolean) => void
  setLineNumbers: (show: boolean) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  currentDir: null,
  directoryEntries: [],
  recentFiles: JSON.parse(localStorage.getItem('md-editor-recent') || '[]'),
  fontSize: 14,
  tabSize: 2,
  wordWrap: 'on',
  minimap: true,
  lineNumbers: true,

  setCurrentDir: (dir) => set({ currentDir: dir }),

  setDirectoryEntries: (entries) => set({ directoryEntries: entries }),

  addRecentFile: (filePath) => {
    set((s) => {
      const recent = [filePath, ...s.recentFiles.filter((f) => f !== filePath)].slice(0, 20)
      localStorage.setItem('md-editor-recent', JSON.stringify(recent))
      return { recentFiles: recent }
    })
  },

  setFontSize: (size) => set({ fontSize: size }),
  setTabSize: (size) => set({ tabSize: size }),
  setWordWrap: (wrap) => set({ wordWrap: wrap }),
  setMinimap: (show) => set({ minimap: show }),
  setLineNumbers: (show) => set({ lineNumbers: show })
}))
