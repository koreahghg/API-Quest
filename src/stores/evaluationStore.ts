import { create } from 'zustand'
import type {
  Mission,
  MissionCondition,
  HttpRequest,
  HttpResponse,
  ConditionResult,
  MissionEvaluation,
} from '@/types'

export type EvaluationStatus = 'idle' | 'pass' | 'fail'

interface EvaluationState {
  status: EvaluationStatus
  evaluation: MissionEvaluation | null
  evaluate: (mission: Mission, request: HttpRequest, response: HttpResponse) => MissionEvaluation
  reset: () => void
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (typeof acc === 'object' && acc !== null) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function evaluateCondition(
  condition: MissionCondition,
  request: HttpRequest,
  response: HttpResponse,
): ConditionResult {
  const base = { type: condition.type, target: condition.target, expected: condition.expected }
  let actual: unknown

  if (condition.type === 'status_equals') {
    actual = response.status
  } else if (condition.type === 'method_equals') {
    actual = request.method
  } else if (condition.type.startsWith('header_')) {
    actual = response.headers[condition.target.toLowerCase()]
  } else if (condition.type.startsWith('body_')) {
    actual = getNestedValue(response.body, condition.target)
  }

  const isPresence = condition.type === 'header_present' || condition.type === 'body_field_exists'
  const passed = isPresence ? actual !== undefined : actual === condition.expected

  return { ...base, actual, passed }
}

export const useEvaluationStore = create<EvaluationState>((set) => ({
  status: 'idle',
  evaluation: null,

  evaluate: (mission, request, response) => {
    const conditionResults = mission.conditions.map((c) =>
      evaluateCondition(c, request, response),
    )
    const passed = conditionResults.every((r) => r.passed)
    const evaluation: MissionEvaluation = {
      missionId: mission.id,
      passed,
      conditionResults,
      evaluatedAt: Date.now(),
    }
    set({ status: passed ? 'pass' : 'fail', evaluation })
    return evaluation
  },

  reset: () => set({ status: 'idle', evaluation: null }),
}))
