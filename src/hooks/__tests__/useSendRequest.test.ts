import { act, renderHook } from '@testing-library/react'
import { http } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSendRequest } from '../useSendRequest'
import { useEvaluationStore } from '@/stores/evaluationStore'
import { useHistoryStore } from '@/stores/historyStore'
import { useRequestStore } from '@/stores/requestStore'
import { useResponseStore } from '@/stores/responseStore'
import { useScenarioStore } from '@/stores/scenarioStore'
import { server } from '@/test/mocks/server'

// ── 공통 초기화 ───────────────────────────────────────────────────────────────

beforeEach(() => {
  useRequestStore.getState().reset()
  useResponseStore.getState().reset()
  useEvaluationStore.getState().reset()
  useHistoryStore.getState().clear()
  useScenarioStore.setState({ scenarios: [], activeScenarioId: null, activeMissionId: null, missionRevealedHints: {} })
})

// ── URL 유효성 검사 ───────────────────────────────────────────────────────────

describe('URL 유효성 검사', () => {
  it('빈 URL → invalid_url 에러', async () => {
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    expect(useResponseStore.getState().status).toBe('error')
    expect(useResponseStore.getState().error?.kind).toBe('invalid_url')
  })

  it('프로토콜 없는 URL(example.com) → invalid_url 에러', async () => {
    useRequestStore.getState().setUrl('example.com')
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    expect(useResponseStore.getState().error?.kind).toBe('invalid_url')
  })

  it('invalid_url 에러는 history에 기록되지 않는다', async () => {
    useRequestStore.getState().setUrl('not-a-url')
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    expect(useHistoryStore.getState().entries).toHaveLength(0)
  })
})

// ── 성공 응답 ─────────────────────────────────────────────────────────────────

describe('성공 응답', () => {
  it('GET 요청 성공 → status="success", 응답 status=200', async () => {
    useRequestStore.getState().setUrl('https://jsonplaceholder.typicode.com/posts')
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    expect(useResponseStore.getState().status).toBe('success')
    expect(useResponseStore.getState().response?.status).toBe(200)
  })

  it('성공 응답은 history에 추가된다', async () => {
    useRequestStore.getState().setUrl('https://jsonplaceholder.typicode.com/posts')
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    expect(useHistoryStore.getState().entries).toHaveLength(1)
    expect(useHistoryStore.getState().entries[0].error).toBeNull()
  })

  it('POST 요청 → 201 응답', async () => {
    const store = useRequestStore.getState()
    store.setMethod('POST')
    store.setUrl('https://jsonplaceholder.typicode.com/posts')
    store.setBody(JSON.stringify({ title: 'test' }))
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    expect(useResponseStore.getState().response?.status).toBe(201)
  })

  it('응답 body가 JSON으로 파싱된다', async () => {
    useRequestStore.getState().setUrl('https://jsonplaceholder.typicode.com/posts/1')
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    const body = useResponseStore.getState().response?.body
    expect(typeof body).toBe('object')
    expect((body as Record<string, unknown>).id).toBe(1)
  })

  it('요청 시작 시 evaluation 상태가 초기화된다', async () => {
    // 먼저 이전 evaluation 상태를 만들어 놓음
    const mission = {
      id: 'm1', scenarioId: 's1', order: 1, title: '', description: '',
      targetMethod: 'GET' as const, targetEndpoint: '/',
      conditions: [{ type: 'status_equals' as const, target: 'status', expected: 200 }],
      hints: [], status: 'active' as const, attempts: 0,
    }
    useEvaluationStore.getState().evaluate(
      mission,
      { method: 'GET', url: '', headers: [], queryParams: [], body: '' },
      { status: 200, statusText: 'OK', headers: {}, body: {}, bodyRaw: '{}', duration: 0, timestamp: 0, size: 0 },
    )
    expect(useEvaluationStore.getState().status).toBe('pass')

    useRequestStore.getState().setUrl('https://jsonplaceholder.typicode.com/posts')
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    // 새 요청 시작 시 reset 후 다시 평가 없이 idle이어야 함
    // (활성 미션이 없으면 evaluation은 idle 유지)
    expect(useEvaluationStore.getState().status).toBe('idle')
  })
})

// ── 에러 처리 ─────────────────────────────────────────────────────────────────

describe('에러 처리', () => {
  it('네트워크 오류 → cors 또는 network 에러', async () => {
    server.use(
      http.get('https://jsonplaceholder.typicode.com/posts', () => {
        throw new Error('Failed to fetch')
      }),
    )
    useRequestStore.getState().setUrl('https://jsonplaceholder.typicode.com/posts')
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    const state = useResponseStore.getState()
    expect(state.status).toBe('error')
    expect(['cors', 'network']).toContain(state.error?.kind)
  })

  it('네트워크 오류도 history에 기록된다 (error 필드 포함)', async () => {
    server.use(
      http.get('https://jsonplaceholder.typicode.com/posts', () => {
        throw new Error('Failed to fetch')
      }),
    )
    useRequestStore.getState().setUrl('https://jsonplaceholder.typicode.com/posts')
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    const entries = useHistoryStore.getState().entries
    expect(entries).toHaveLength(1)
    expect(entries[0].error).not.toBeNull()
    expect(entries[0].response).toBeNull()
  })

  it('404 응답은 에러가 아닌 success로 처리된다 (HTTP 에러 ≠ 네트워크 에러)', async () => {
    useRequestStore.getState().setUrl('https://jsonplaceholder.typicode.com/posts/999')
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    expect(useResponseStore.getState().status).toBe('success')
    expect(useResponseStore.getState().response?.status).toBe(404)
  })

  it('500 응답도 success로 처리된다', async () => {
    useRequestStore.getState().setUrl('https://api.quest/v1/trigger-error')
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    expect(useResponseStore.getState().status).toBe('success')
    expect(useResponseStore.getState().response?.status).toBe(500)
  })
})

// ── 헤더 처리 ─────────────────────────────────────────────────────────────────

describe('헤더 처리', () => {
  it('enabled 헤더가 요청에 포함된다', async () => {
    // Authorization 헤더가 필요한 엔드포인트로 확인
    useRequestStore.getState().setUrl('https://api.quest/v1/profile')
    useRequestStore.getState().setHeaders([
      { id: '1', key: 'Authorization', value: 'Bearer eyJhbGciOiJIUzI1NiJ9.mock-token', enabled: true },
    ])
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    expect(useResponseStore.getState().response?.status).toBe(200)
  })

  it('disabled 헤더는 요청에서 제외된다', async () => {
    useRequestStore.getState().setUrl('https://api.quest/v1/profile')
    useRequestStore.getState().setHeaders([
      { id: '1', key: 'Authorization', value: 'Bearer eyJhbGciOiJIUzI1NiJ9.mock-token', enabled: false },
    ])
    const { result } = renderHook(() => useSendRequest())
    await act(async () => {
      await result.current.send()
    })
    // 헤더가 비활성화되어 있으므로 401 응답
    expect(useResponseStore.getState().response?.status).toBe(401)
  })
})
