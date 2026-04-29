import type { HttpMethod } from './http'

export type MissionStatus = 'locked' | 'active' | 'completed' | 'failed'

export type ConditionType =
  | 'status_equals'
  | 'header_present'
  | 'header_equals'
  | 'body_field_exists'
  | 'body_field_equals'
  | 'method_equals'

export interface MissionCondition {
  type: ConditionType
  target: string
  expected?: unknown
}

export interface Mission {
  id: string
  scenarioId: string
  order: number
  title: string
  description: string
  targetMethod: HttpMethod
  targetEndpoint: string
  conditions: MissionCondition[]
  hints: string[]
  status: MissionStatus
  attempts: number
  completedAt?: number
}

export type ScenarioDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Scenario {
  id: string
  title: string
  description: string
  difficulty: ScenarioDifficulty
  tags: string[]
  missions: Mission[]
  order: number
}
