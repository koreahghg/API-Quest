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

function evaluateCondition(
  condition: MissionCondition,
  request: HttpRequest,
  response: HttpResponse,
): ConditionResult {
  const base = { type: condition.type, target: condition.target, expected: condition.expected }

  switch (condition.type) {
    case 'status_equals': {
      const actual = response.status
      return { ...base, actual, passed: actual === condition.expected }
    }
    case 'header_present': {
      const actual = response.headers[condition.target.toLowerCase()]
      return { ...base, actual, passed: actual !== undefined }
    }
    case 'header_equals': {
      const actual = response.headers[condition.target.toLowerCase()]
      return { ...base, actual, passed: actual === condition.expected }
    }
    case 'body_field_exists': {
      const body = response.body
      const actual =
        typeof body === 'object' && body !== null
          ? (body as Record<string, unknown>)[condition.target]
          : undefined
      return { ...base, actual, passed: actual !== undefined }
    }
    case 'body_field_equals': {
      const body = response.body
      const actual =
        typeof body === 'object' && body !== null
          ? (body as Record<string, unknown>)[condition.target]
          : undefined
      return { ...base, actual, passed: actual === condition.expected }
    }
    case 'method_equals': {
      const actual = request.method
      return { ...base, actual, passed: actual === condition.expected }
    }
  }
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
