export interface FileResult {
  filePath: string
  fileName: string
  content: string
}

export interface SaveAsResult {
  filePath: string
  fileName: string
}

export interface DirEntry {
  name: string
  path: string
  isDirectory: boolean
  isFile: boolean
  size: number
  mtimeMs: number
}

export interface OpenFileEvent {
  filePath: string
  fileName: string
  content: string
}

export interface ElectronAPI {
  file: {
    open: () => Promise<FileResult[] | null>
    save: (filePath: string, content: string) => Promise<boolean>
    saveAs: (content: string) => Promise<SaveAsResult | null>
    read: (filePath: string) => Promise<string | null>
    checkExists: (filePath: string) => Promise<boolean>
    getDirectory: (dirPath: string) => Promise<DirEntry[] | null>
    openPaths: (filePaths: string[]) => Promise<FileResult[]>,
    pasteImage: (currentFilePath: string | null) => Promise<{ markdown: string; filePath: string } | null>
  }
  dialog: {
    openDirectory: () => Promise<string | null>
    confirm: (message: string, title: string) => Promise<number>
  }
  platform: string
  on: (channel: string, callback: (...args: unknown[]) => void) => () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
