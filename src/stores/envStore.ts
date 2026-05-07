'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EnvVariable } from '@/types'

interface EnvState {
  variables: EnvVariable[]
  addVariable: () => void
  updateVariable: (id: string, field: 'key' | 'value', value: string) => void
  toggleVariable: (id: string) => void
  removeVariable: (id: string) => void
  getVariableMap: () => Record<string, string>
}

export const useEnvStore = create<EnvState>()(
  persist(
    (set, get) => ({
      variables: [],

      addVariable: () =>
        set((s) => ({
          variables: [
            ...s.variables,
            { id: crypto.randomUUID(), key: '', value: '', enabled: true },
          ],
        })),

      updateVariable: (id, field, value) =>
        set((s) => ({
          variables: s.variables.map((v) =>
            v.id === id ? { ...v, [field]: value } : v
          ),
        })),

      toggleVariable: (id) =>
        set((s) => ({
          variables: s.variables.map((v) =>
            v.id === id ? { ...v, enabled: !v.enabled } : v
          ),
        })),

      removeVariable: (id) =>
        set((s) => ({ variables: s.variables.filter((v) => v.id !== id) })),

      getVariableMap: () => {
        const { variables } = get()
        return Object.fromEntries(
          variables.filter((v) => v.enabled && v.key).map((v) => [v.key, v.value])
        )
      },
    }),
    { name: 'api-quest-env' }
  )
)
