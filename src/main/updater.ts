import { autoUpdater } from 'electron-updater'
import { BrowserWindow } from 'electron'

let initialized = false

export function initAutoUpdater(mainWindow: BrowserWindow): void {
  if (initialized) return
  initialized = true

  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('update:checking')
  })

  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update:available', info.version)
  })

  autoUpdater.on('update-not-available', () => {
    mainWindow.webContents.send('update:not-available')
  })

  autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('update:error', err.message)
  })

  autoUpdater.on('download-progress', (progress) => {
    mainWindow.webContents.send('update:progress', progress.percent)
  })

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update:downloaded')
  })
}

export function checkForUpdates(): void {
  autoUpdater.checkForUpdates().catch(() => {
    // silent fail — dev environments have no publish config
  })
}

export function downloadUpdate(): void {
  autoUpdater.downloadUpdate()
}

export function quitAndInstall(): void {
  autoUpdater.quitAndInstall()
}
