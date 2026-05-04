import { beforeEach, describe, expect, it } from 'vitest'
import { useHistoryStore } from '../historyStore'
import type { HttpRequest } from '@/types'

const makeEntry = (overrides: { timestamp?: number } = {}) => ({
  request: {
    method: 'GET' as const,
    url: 'https://example.com',
    headers: [],
    queryParams: [],
    body: '',
  } satisfies HttpRequest,
  response: null,
  error: null,
  timestamp: Date.now(),
  ...overrides,
})

describe('historyStore', () => {
  beforeEach(() => {
    useHistoryStore.getState().clear()
  })

  describe('addEntry', () => {
    it('항목을 추가하면 entries 길이가 1 증가한다', () => {
      useHistoryStore.getState().addEntry(makeEntry())
      expect(useHistoryStore.getState().entries).toHaveLength(1)
    })

    it('각 항목에 고유한 id가 자동 부여된다', () => {
      useHistoryStore.getState().addEntry(makeEntry())
      useHistoryStore.getState().addEntry(makeEntry())
      const [first, second] = useHistoryStore.getState().entries
      expect(first.id).toBeDefined()
      expect(second.id).toBeDefined()
      expect(first.id).not.toBe(second.id)
    })

    it('최신 항목이 리스트 맨 앞에 위치한다', () => {
      useHistoryStore.getState().addEntry(makeEntry({ timestamp: 1000 }))
      useHistoryStore.getState().addEntry(makeEntry({ timestamp: 2000 }))
      expect(useHistoryStore.getState().entries[0].timestamp).toBe(2000)
      expect(useHistoryStore.getState().entries[1].timestamp).toBe(1000)
    })
  })

  describe('최대 20개 제한', () => {
    it('20개를 초과하면 entries 길이는 20으로 유지된다', () => {
      for (let i = 0; i < 25; i++) {
        useHistoryStore.getState().addEntry(makeEntry({ timestamp: i }))
      }
      expect(useHistoryStore.getState().entries).toHaveLength(20)
    })

    it('21번째 항목 추가 시 가장 오래된 항목(timestamp=0)이 제거된다', () => {
      for (let i = 0; i < 21; i++) {
        useHistoryStore.getState().addEntry(makeEntry({ timestamp: i }))
      }
      const entries = useHistoryStore.getState().entries
      expect(entries.find((e) => e.timestamp === 0)).toBeUndefined()
    })

    it('21번째 항목은 entries[0]에 위치한다', () => {
      for (let i = 0; i < 21; i++) {
        useHistoryStore.getState().addEntry(makeEntry({ timestamp: i }))
      }
      expect(useHistoryStore.getState().entries[0].timestamp).toBe(20)
    })
  })

  describe('clear', () => {
    it('clear 후 entries는 빈 배열이 된다', () => {
      useHistoryStore.getState().addEntry(makeEntry())
      useHistoryStore.getState().addEntry(makeEntry())
      useHistoryStore.getState().clear()
      expect(useHistoryStore.getState().entries).toHaveLength(0)
    })
  })
})
