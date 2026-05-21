import { ipcMain, dialog, BrowserWindow } from 'electron'
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, dirname, basename, extname } from 'path'

export function registerIpcHandlers(mainWindow: BrowserWindow): void {

  ipcMain.handle('file:open', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Markdown', extensions: ['md', 'mdx', 'markdown'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    if (result.canceled || result.filePaths.length === 0) return null

    return result.filePaths.map((filePath) => ({
      filePath,
      fileName: basename(filePath),
      content: readFileSync(filePath, 'utf-8')
    }))
  })

  ipcMain.handle('file:save', async (_event, filePath: string, content: string) => {
    writeFileSync(filePath, content, 'utf-8')
    return true
  })

  ipcMain.handle('file:save-as', async (_event, content: string) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      filters: [
        { name: 'Markdown', extensions: ['md'] }
      ]
    })
    if (result.canceled || !result.filePath) return null

    writeFileSync(result.filePath, content, 'utf-8')
    return { filePath: result.filePath, fileName: basename(result.filePath) }
  })

  ipcMain.handle('file:read', async (_event, filePath: string) => {
    try {
      return readFileSync(filePath, 'utf-8')
    } catch {
      return null
    }
  })

  ipcMain.handle('file:check-exists', async (_event, filePath: string) => {
    return existsSync(filePath)
  })

  ipcMain.handle('file:get-directory', async (_event, dirPath: string) => {
    try {
      const entries = readdirSync(dirPath)
      const result = entries.map((entry) => {
        const fullPath = join(dirPath, entry)
        try {
          const stats = statSync(fullPath)
          return {
            name: entry,
            path: fullPath,
            isDirectory: stats.isDirectory(),
            isFile: stats.isFile(),
            size: stats.size,
            mtimeMs: stats.mtimeMs
          }
        } catch {
          return null
        }
      }).filter(Boolean)
      return result
    } catch {
      return null
    }
  })

  ipcMain.handle('dialog:open-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })
    if (result.canceled || result.filePaths.length === 0) return null
    return result.filePaths[0]
  })

  ipcMain.handle('dialog:confirm', async (_event, message: string, title: string) => {
    const result = await dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['Cancel', 'Don\'t Save', 'Save'],
      defaultId: 2,
      title,
      message
    })
    return result.response
  })
}
