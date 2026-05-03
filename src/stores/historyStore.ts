import { create } from 'zustand'
import type { HttpRequest, HttpResponse, ApiError } from '@/types'

export interface HistoryEntry {
  id: string
  request: HttpRequest
  response: HttpResponse | null
  error: ApiError | null
  timestamp: number
}

interface HistoryState {
  entries: HistoryEntry[]
  addEntry: (data: Omit<HistoryEntry, 'id'>) => void
  clear: () => void
}

const MAX_ENTRIES = 20

export const useHistoryStore = create<HistoryState>((set) => ({
  entries: [],
  addEntry: (data) =>
    set((s) => ({
      entries: [{ ...data, id: crypto.randomUUID() }, ...s.entries].slice(0, MAX_ENTRIES),
    })),
  clear: () => set({ entries: [] }),
}))
