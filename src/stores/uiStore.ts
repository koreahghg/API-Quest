import { create } from 'zustand'

export type AppView = 'home' | 'mission'
export type ActivePanel = 'history' | 'env' | null

interface UiState {
  view: AppView
  setView: (view: AppView) => void
  activePanel: ActivePanel
  openPanel: (panel: Exclude<ActivePanel, null>) => void
  closePanel: () => void
}

export const useUiStore = create<UiState>((set) => ({
  view: 'home',
  setView: (view) => set({ view }),
  activePanel: null,
  openPanel: (panel) => set({ activePanel: panel }),
  closePanel: () => set({ activePanel: null }),
}))
