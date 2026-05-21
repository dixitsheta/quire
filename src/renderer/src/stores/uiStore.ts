import { create } from 'zustand'

export type ThemeName =
  | 'dark' | 'light' | 'sepia' | 'high-contrast'
  | 'nord' | 'dracula' | 'solarized-dark' | 'solarized-light'
  | 'github-dark' | 'github-light' | 'one-dark' | 'one-light'

interface UiState {
  theme: ThemeName
  showEditor: boolean
  showPreview: boolean
  showSidebar: boolean
  showToc: boolean
  zenMode: boolean
  focusMode: boolean
  splitOrientation: 'vertical' | 'horizontal'
  setTheme: (theme: ThemeName) => void
  toggleEditor: () => void
  togglePreview: () => void
  toggleSidebar: () => void
  toggleToc: () => void
  toggleZenMode: () => void
  toggleFocusMode: () => void
  setSplitOrientation: (orientation: 'vertical' | 'horizontal') => void
  showBoth: () => void
}

export const useUiStore = create<UiState>((set) => ({
  theme: (localStorage.getItem('md-editor-theme') as ThemeName) || 'dark',
  showEditor: true,
  showPreview: true,
  showSidebar: false,
  showToc: false,
  zenMode: false,
  focusMode: false,
  splitOrientation: 'vertical',

  setTheme: (theme) => {
    localStorage.setItem('md-editor-theme', theme)
    set({ theme })
  },

  toggleEditor: () => set((s) => ({ showEditor: !s.showEditor })),
  togglePreview: () => set((s) => ({ showPreview: !s.showPreview })),
  toggleSidebar: () => set((s) => ({ showSidebar: !s.showSidebar })),
  toggleToc: () => set((s) => ({ showToc: !s.showToc })),

  toggleZenMode: () =>
    set((s) => ({
      zenMode: !s.zenMode,
      showSidebar: s.zenMode ? false : false,
      showToc: false
    })),

  toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),

  setSplitOrientation: (orientation) => set({ splitOrientation: orientation }),

  showBoth: () => set({ showEditor: true, showPreview: true })
}))
