import type { ConditionType } from './scenario'

export interface ConditionResult {
  type: ConditionType
  target: string
  expected?: unknown
  actual?: unknown
  passed: boolean
}

export interface MissionEvaluation {
  missionId: string
  passed: boolean
  conditionResults: ConditionResult[]
  evaluatedAt: number
}
