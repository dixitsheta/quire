import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron'

export function buildMenu(mainWindow: BrowserWindow): Menu {
  const isMac = process.platform === 'darwin'

  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' as const },
              { type: 'separator' as const },
              { role: 'hide' as const },
              { role: 'hideOthers' as const },
              { role: 'unhide' as const },
              { type: 'separator' as const },
              { role: 'quit' as const }
            ]
          } as MenuItemConstructorOptions
        ]
      : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('menu:new-file')
        },
        {
          label: 'Open File...',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow.webContents.send('menu:open-file')
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('menu:save')
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow.webContents.send('menu:save-as')
        },
        { type: 'separator' },
        {
          label: 'Export HTML...',
          click: () => mainWindow.webContents.send('menu:export-html')
        },
        {
          label: 'Export PDF...',
          click: () => mainWindow.webContents.send('menu:export-pdf')
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Find...',
          accelerator: 'CmdOrCtrl+F',
          click: () => mainWindow.webContents.send('menu:find')
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Editor',
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow.webContents.send('menu:toggle-editor')
        },
        {
          label: 'Toggle Preview',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow.webContents.send('menu:toggle-preview')
        },
        {
          label: 'Show Both',
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow.webContents.send('menu:show-both')
        },
        { type: 'separator' },
        {
          label: 'Toggle Sidebar',
          accelerator: 'CmdOrCtrl+B',
          click: () => mainWindow.webContents.send('menu:toggle-sidebar')
        },
        { type: 'separator' },
        {
          label: 'Zen Mode',
          accelerator: 'CmdOrCtrl+Shift+Z',
          click: () => mainWindow.webContents.send('menu:zen-mode')
        },
        { type: 'separator' },
        {
          label: 'Theme Gallery...',
          click: () => mainWindow.webContents.send('menu:theme-gallery')
        },
        {
          label: 'Custom CSS...',
          click: () => mainWindow.webContents.send('menu:custom-css')
        },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Theme',
      submenu: [
        {
          label: 'Light',
          click: () => mainWindow.webContents.send('menu:set-theme', 'light')
        },
        {
          label: 'Dark',
          click: () => mainWindow.webContents.send('menu:set-theme', 'dark')
        },
        {
          label: 'Sepia',
          click: () => mainWindow.webContents.send('menu:set-theme', 'sepia')
        },
        {
          label: 'High Contrast',
          click: () => mainWindow.webContents.send('menu:set-theme', 'high-contrast')
        },
        { type: 'separator' },
        {
          label: 'Nord',
          click: () => mainWindow.webContents.send('menu:set-theme', 'nord')
        },
        {
          label: 'Dracula',
          click: () => mainWindow.webContents.send('menu:set-theme', 'dracula')
        },
        {
          label: 'Solarized Dark',
          click: () => mainWindow.webContents.send('menu:set-theme', 'solarized-dark')
        },
        {
          label: 'Solarized Light',
          click: () => mainWindow.webContents.send('menu:set-theme', 'solarized-light')
        },
        { type: 'separator' },
        {
          label: 'GitHub Dark',
          click: () => mainWindow.webContents.send('menu:set-theme', 'github-dark')
        },
        {
          label: 'GitHub Light',
          click: () => mainWindow.webContents.send('menu:set-theme', 'github-light')
        },
        { type: 'separator' },
        {
          label: 'One Dark',
          click: () => mainWindow.webContents.send('menu:set-theme', 'one-dark')
        },
        {
          label: 'One Light',
          click: () => mainWindow.webContents.send('menu:set-theme', 'one-light')
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Keyboard Shortcuts',
          accelerator: 'CmdOrCtrl+/',
          click: () => mainWindow.webContents.send('menu:shortcuts')
        },
        { type: 'separator' },
        { role: 'about' }
      ]
    }
  ]

  return Menu.buildFromTemplate(template)
}
