import { create } from 'zustand'
import type { Scenario, Mission } from '@/types'

interface ScenarioState {
  scenarios: Scenario[]
  activeScenarioId: string | null
  activeMissionId: string | null
  missionRevealedHints: Record<string, number>

  setScenarios: (scenarios: Scenario[]) => void
  setActiveScenario: (id: string) => void
  setActiveMission: (id: string) => void
  completeMission: (missionId: string) => void
  incrementAttempts: (missionId: string) => void
  revealNextHint: (missionId: string) => void

  getActiveScenario: () => Scenario | null
  getActiveMission: () => Mission | null
  getRevealedHintCount: (missionId: string) => number
}

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  scenarios: [],
  activeScenarioId: null,
  activeMissionId: null,
  missionRevealedHints: {},

  setScenarios: (scenarios) => set({ scenarios }),

  setActiveScenario: (id) => {
    const scenario = get().scenarios.find((s) => s.id === id)
    if (!scenario) return
    const firstActive = scenario.missions.find((m) => m.status === 'active')
    set({ activeScenarioId: id, activeMissionId: firstActive?.id ?? null })
  },

  setActiveMission: (id) => set({ activeMissionId: id }),

  completeMission: (missionId) =>
    set((s) => ({
      scenarios: s.scenarios.map((scenario) => {
        const idx = scenario.missions.findIndex((m) => m.id === missionId)
        if (idx === -1) return scenario
        return {
          ...scenario,
          missions: scenario.missions.map((m, i) => {
            if (m.id === missionId) return { ...m, status: 'completed' as const, completedAt: Date.now() }
            if (i === idx + 1 && m.status === 'locked') return { ...m, status: 'active' as const }
            return m
          }),
        }
      }),
    })),

  incrementAttempts: (missionId) =>
    set((s) => ({
      scenarios: s.scenarios.map((scenario) => ({
        ...scenario,
        missions: scenario.missions.map((m) =>
          m.id === missionId ? { ...m, attempts: m.attempts + 1 } : m,
        ),
      })),
    })),

  revealNextHint: (missionId) =>
    set((s) => {
      const activeMission = get().getActiveMission()
      const mission =
        activeMission?.id === missionId
          ? activeMission
          : s.scenarios.flatMap((sc) => sc.missions).find((m) => m.id === missionId)
      if (!mission) return {}
      const current = s.missionRevealedHints[missionId] ?? 0
      return {
        missionRevealedHints: {
          ...s.missionRevealedHints,
          [missionId]: Math.min(current + 1, mission.hints.length),
        },
      }
    }),

  getActiveScenario: () => {
    const { scenarios, activeScenarioId } = get()
    return scenarios.find((s) => s.id === activeScenarioId) ?? null
  },

  getActiveMission: () => {
    const { activeMissionId } = get()
    const scenario = get().getActiveScenario()
    return scenario?.missions.find((m) => m.id === activeMissionId) ?? null
  },

  getRevealedHintCount: (missionId) => get().missionRevealedHints[missionId] ?? 0,
}))
