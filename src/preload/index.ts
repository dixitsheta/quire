import { contextBridge, ipcRenderer } from 'electron'
import type { ElectronAPI } from './types'

const electronAPI: ElectronAPI = {
  file: {
    open: () => ipcRenderer.invoke('file:open'),
    save: (filePath, content) => ipcRenderer.invoke('file:save', filePath, content),
    saveAs: (content) => ipcRenderer.invoke('file:save-as', content),
    read: (filePath) => ipcRenderer.invoke('file:read', filePath),
    checkExists: (filePath) => ipcRenderer.invoke('file:check-exists', filePath),
    getDirectory: (dirPath) => ipcRenderer.invoke('file:get-directory', dirPath)
  },
  dialog: {
    openDirectory: () => ipcRenderer.invoke('dialog:open-directory'),
    confirm: (message, title) => ipcRenderer.invoke('dialog:confirm', message, title)
  },
  platform: process.platform,
  on: (channel, callback) => {
    const listener = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => callback(...args)
    ipcRenderer.on(channel, listener)
    return () => ipcRenderer.removeListener(channel, listener)
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
