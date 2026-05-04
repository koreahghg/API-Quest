import { beforeEach, describe, expect, it } from 'vitest'
import { useEvaluationStore } from '../evaluationStore'
import type { HttpRequest, HttpResponse, Mission } from '@/types'

// ── 팩토리 헬퍼 ──────────────────────────────────────────────────────────────

const makeRequest = (overrides: Partial<HttpRequest> = {}): HttpRequest => ({
  method: 'GET',
  url: 'https://jsonplaceholder.typicode.com/posts',
  headers: [],
  queryParams: [],
  body: '',
  ...overrides,
})

const makeResponse = (overrides: Partial<HttpResponse> = {}): HttpResponse => ({
  status: 200,
  statusText: 'OK',
  headers: { 'content-type': 'application/json' },
  body: {},
  bodyRaw: '{}',
  duration: 100,
  timestamp: Date.now(),
  size: 2,
  ...overrides,
})

const makeMission = (overrides: Partial<Mission> = {}): Mission => ({
  id: 'm1',
  scenarioId: 's1',
  order: 1,
  title: 'Test Mission',
  description: 'Test',
  targetMethod: 'GET',
  targetEndpoint: '/posts',
  conditions: [],
  hints: [],
  status: 'active',
  attempts: 0,
  ...overrides,
})

// ── 테스트 ────────────────────────────────────────────────────────────────────

describe('evaluationStore', () => {
  beforeEach(() => {
    useEvaluationStore.getState().reset()
  })

  describe('status_equals', () => {
    it('응답 status가 expected와 일치하면 passed=true', () => {
      const mission = makeMission({
        conditions: [{ type: 'status_equals', target: 'status', expected: 200 }],
      })
      const result = useEvaluationStore.getState().evaluate(mission, makeRequest(), makeResponse({ status: 200 }))
      expect(result.passed).toBe(true)
      expect(result.conditionResults[0].actual).toBe(200)
    })

    it('응답 status가 expected와 다르면 passed=false', () => {
      const mission = makeMission({
        conditions: [{ type: 'status_equals', target: 'status', expected: 201 }],
      })
      const result = useEvaluationStore.getState().evaluate(mission, makeRequest(), makeResponse({ status: 200 }))
      expect(result.passed).toBe(false)
    })

    it('201 조건 + POST 응답 — passed=true', () => {
      const mission = makeMission({
        conditions: [{ type: 'status_equals', target: 'status', expected: 201 }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest({ method: 'POST' }),
        makeResponse({ status: 201 }),
      )
      expect(result.passed).toBe(true)
    })

    it('404 조건 + 404 응답 — passed=true', () => {
      const mission = makeMission({
        conditions: [{ type: 'status_equals', target: 'status', expected: 404 }],
      })
      const result = useEvaluationStore.getState().evaluate(mission, makeRequest(), makeResponse({ status: 404 }))
      expect(result.passed).toBe(true)
    })
  })

  describe('method_equals', () => {
    it('요청 method가 expected와 일치하면 passed=true', () => {
      const mission = makeMission({
        conditions: [{ type: 'method_equals', target: 'method', expected: 'POST' }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest({ method: 'POST' }),
        makeResponse(),
      )
      expect(result.passed).toBe(true)
    })

    it('method가 다르면 passed=false', () => {
      const mission = makeMission({
        conditions: [{ type: 'method_equals', target: 'method', expected: 'POST' }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest({ method: 'GET' }),
        makeResponse(),
      )
      expect(result.passed).toBe(false)
    })
  })

  describe('header_present', () => {
    it('응답 헤더에 target 키가 있으면 passed=true', () => {
      const mission = makeMission({
        conditions: [{ type: 'header_present', target: 'content-type' }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest(),
        makeResponse({ headers: { 'content-type': 'application/json' } }),
      )
      expect(result.passed).toBe(true)
    })

    it('응답 헤더에 target 키가 없으면 passed=false', () => {
      const mission = makeMission({
        conditions: [{ type: 'header_present', target: 'authorization' }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest(),
        makeResponse({ headers: {} }),
      )
      expect(result.passed).toBe(false)
    })
  })

  describe('header_equals', () => {
    it('헤더 값이 expected와 일치하면 passed=true', () => {
      const mission = makeMission({
        conditions: [{ type: 'header_equals', target: 'content-type', expected: 'application/json' }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest(),
        makeResponse({ headers: { 'content-type': 'application/json' } }),
      )
      expect(result.passed).toBe(true)
    })

    it('헤더 값이 expected와 다르면 passed=false', () => {
      const mission = makeMission({
        conditions: [{ type: 'header_equals', target: 'content-type', expected: 'text/plain' }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest(),
        makeResponse({ headers: { 'content-type': 'application/json' } }),
      )
      expect(result.passed).toBe(false)
    })
  })

  describe('body_field_exists', () => {
    it('최상위 필드가 존재하면 passed=true', () => {
      const mission = makeMission({
        conditions: [{ type: 'body_field_exists', target: 'token' }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest(),
        makeResponse({ body: { token: 'abc123' } }),
      )
      expect(result.passed).toBe(true)
    })

    it('필드가 없으면 passed=false', () => {
      const mission = makeMission({
        conditions: [{ type: 'body_field_exists', target: 'token' }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest(),
        makeResponse({ body: {} }),
      )
      expect(result.passed).toBe(false)
    })

    it('중첩된 경로(user.id)가 존재하면 passed=true', () => {
      const mission = makeMission({
        conditions: [{ type: 'body_field_exists', target: 'user.id' }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest(),
        makeResponse({ body: { user: { id: 1 } } }),
      )
      expect(result.passed).toBe(true)
    })
  })

  describe('body_field_equals', () => {
    it('최상위 필드 값이 expected와 일치하면 passed=true', () => {
      const mission = makeMission({
        conditions: [{ type: 'body_field_equals', target: 'role', expected: 'user' }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest(),
        makeResponse({ body: { role: 'user' } }),
      )
      expect(result.passed).toBe(true)
    })

    it('필드 값이 expected와 다르면 passed=false', () => {
      const mission = makeMission({
        conditions: [{ type: 'body_field_equals', target: 'role', expected: 'admin' }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest(),
        makeResponse({ body: { role: 'user' } }),
      )
      expect(result.passed).toBe(false)
    })

    it('중첩 경로(user.email)가 expected와 일치하면 passed=true', () => {
      const mission = makeMission({
        conditions: [{ type: 'body_field_equals', target: 'user.email', expected: 'user@example.com' }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest(),
        makeResponse({ body: { user: { email: 'user@example.com' } } }),
      )
      expect(result.passed).toBe(true)
    })

    it('3단 중첩 경로(a.b.c)도 올바르게 추출한다', () => {
      const mission = makeMission({
        conditions: [{ type: 'body_field_equals', target: 'a.b.c', expected: 42 }],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest(),
        makeResponse({ body: { a: { b: { c: 42 } } } }),
      )
      expect(result.passed).toBe(true)
    })
  })

  describe('복합 조건', () => {
    it('모든 조건을 통과해야 passed=true', () => {
      const mission = makeMission({
        conditions: [
          { type: 'status_equals', target: 'status', expected: 201 },
          { type: 'body_field_exists', target: 'id' },
          { type: 'method_equals', target: 'method', expected: 'POST' },
        ],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest({ method: 'POST' }),
        makeResponse({ status: 201, body: { id: 101, title: '새 게시글' } }),
      )
      expect(result.passed).toBe(true)
      expect(result.conditionResults.every((r) => r.passed)).toBe(true)
    })

    it('하나라도 실패하면 passed=false', () => {
      const mission = makeMission({
        conditions: [
          { type: 'status_equals', target: 'status', expected: 201 },
          { type: 'body_field_equals', target: 'role', expected: 'admin' },
        ],
      })
      const result = useEvaluationStore.getState().evaluate(
        mission,
        makeRequest({ method: 'POST' }),
        makeResponse({ status: 201, body: { role: 'user' } }),
      )
      expect(result.passed).toBe(false)
      expect(result.conditionResults[0].passed).toBe(true)
      expect(result.conditionResults[1].passed).toBe(false)
    })
  })

  describe('스토어 상태 업데이트', () => {
    it('evaluate 성공 시 status가 "pass"로 변경된다', () => {
      const mission = makeMission({
        conditions: [{ type: 'status_equals', target: 'status', expected: 200 }],
      })
      useEvaluationStore.getState().evaluate(mission, makeRequest(), makeResponse({ status: 200 }))
      expect(useEvaluationStore.getState().status).toBe('pass')
    })

    it('evaluate 실패 시 status가 "fail"로 변경된다', () => {
      const mission = makeMission({
        conditions: [{ type: 'status_equals', target: 'status', expected: 404 }],
      })
      useEvaluationStore.getState().evaluate(mission, makeRequest(), makeResponse({ status: 200 }))
      expect(useEvaluationStore.getState().status).toBe('fail')
    })

    it('evaluate 후 evaluation 객체에 missionId와 evaluatedAt이 존재한다', () => {
      const mission = makeMission({ id: 'mission-42' })
      useEvaluationStore.getState().evaluate(mission, makeRequest(), makeResponse())
      const evaluation = useEvaluationStore.getState().evaluation
      expect(evaluation?.missionId).toBe('mission-42')
      expect(evaluation?.evaluatedAt).toBeTypeOf('number')
    })

    it('reset 후 status="idle", evaluation=null로 초기화된다', () => {
      const mission = makeMission({
        conditions: [{ type: 'status_equals', target: 'status', expected: 200 }],
      })
      useEvaluationStore.getState().evaluate(mission, makeRequest(), makeResponse())
      useEvaluationStore.getState().reset()
      expect(useEvaluationStore.getState().status).toBe('idle')
      expect(useEvaluationStore.getState().evaluation).toBeNull()
    })
  })
})
