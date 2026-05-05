import { beforeEach, describe, expect, it } from 'vitest'
import { useRequestStore } from '../requestStore'

describe('requestStore', () => {
  beforeEach(() => {
    useRequestStore.getState().reset()
  })

  describe('초기 상태', () => {
    it('method는 GET이다', () => {
      expect(useRequestStore.getState().method).toBe('GET')
    })

    it('url은 빈 문자열이다', () => {
      expect(useRequestStore.getState().url).toBe('')
    })

    it('Content-Type 헤더가 기본값으로 존재한다', () => {
      const headers = useRequestStore.getState().headers
      expect(headers.some((h) => h.key === 'Content-Type')).toBe(true)
    })

    it('queryParams는 빈 배열이다', () => {
      expect(useRequestStore.getState().queryParams).toHaveLength(0)
    })
  })

  describe('setMethod', () => {
    it('메서드를 변경한다', () => {
      useRequestStore.getState().setMethod('POST')
      expect(useRequestStore.getState().method).toBe('POST')
    })
  })

  describe('setUrl', () => {
    it('URL을 변경한다', () => {
      useRequestStore.getState().setUrl('https://example.com')
      expect(useRequestStore.getState().url).toBe('https://example.com')
    })
  })

  describe('헤더 CRUD', () => {
    it('addHeader로 빈 헤더를 추가한다', () => {
      const before = useRequestStore.getState().headers.length
      useRequestStore.getState().addHeader()
      expect(useRequestStore.getState().headers).toHaveLength(before + 1)
    })

    it('추가된 헤더는 key, value가 빈 문자열이고 enabled=true다', () => {
      useRequestStore.getState().addHeader()
      const headers = useRequestStore.getState().headers
      const last = headers[headers.length - 1]
      expect(last.key).toBe('')
      expect(last.value).toBe('')
      expect(last.enabled).toBe(true)
    })

    it('updateHeader로 헤더 값을 수정한다', () => {
      useRequestStore.getState().addHeader()
      const headers = useRequestStore.getState().headers
      const target = headers[headers.length - 1]
      useRequestStore.getState().updateHeader(target.id, { key: 'Authorization', value: 'Bearer abc' })
      const updated = useRequestStore.getState().headers.find((h) => h.id === target.id)
      expect(updated?.key).toBe('Authorization')
      expect(updated?.value).toBe('Bearer abc')
    })

    it('removeHeader로 특정 헤더를 삭제한다', () => {
      useRequestStore.getState().addHeader()
      const headers = useRequestStore.getState().headers
      const target = headers[headers.length - 1]
      useRequestStore.getState().removeHeader(target.id)
      expect(useRequestStore.getState().headers.find((h) => h.id === target.id)).toBeUndefined()
    })

    it('setHeaders로 헤더 목록을 통째로 교체한다', () => {
      const newHeaders = [{ id: 'x1', key: 'X-Custom', value: 'yes', enabled: true }]
      useRequestStore.getState().setHeaders(newHeaders)
      expect(useRequestStore.getState().headers).toEqual(newHeaders)
    })
  })

  describe('쿼리 파라미터 CRUD', () => {
    it('addQueryParam으로 파라미터를 추가한다', () => {
      useRequestStore.getState().addQueryParam()
      expect(useRequestStore.getState().queryParams).toHaveLength(1)
    })

    it('updateQueryParam으로 파라미터 값을 수정한다', () => {
      useRequestStore.getState().addQueryParam()
      const params = useRequestStore.getState().queryParams
      useRequestStore.getState().updateQueryParam(params[0].id, { key: 'page', value: '2' })
      expect(useRequestStore.getState().queryParams[0].key).toBe('page')
      expect(useRequestStore.getState().queryParams[0].value).toBe('2')
    })

    it('removeQueryParam으로 파라미터를 삭제한다', () => {
      useRequestStore.getState().addQueryParam()
      const params = useRequestStore.getState().queryParams
      useRequestStore.getState().removeQueryParam(params[0].id)
      expect(useRequestStore.getState().queryParams).toHaveLength(0)
    })
  })

  describe('toHttpRequest', () => {
    it('enabled 파라미터는 URL 쿼리스트링에 포함된다', () => {
      useRequestStore.getState().setUrl('https://example.com/posts')
      useRequestStore.getState().addQueryParam()
      const params = useRequestStore.getState().queryParams
      useRequestStore.getState().updateQueryParam(params[0].id, { key: 'page', value: '1', enabled: true })

      const req = useRequestStore.getState().toHttpRequest()
      expect(req.url).toContain('page=1')
    })

    it('enabled=false 파라미터는 URL에 포함되지 않는다', () => {
      useRequestStore.getState().setUrl('https://example.com/posts')
      useRequestStore.getState().addQueryParam()
      const params = useRequestStore.getState().queryParams
      useRequestStore.getState().updateQueryParam(params[0].id, { key: 'page', value: '1', enabled: false })

      const req = useRequestStore.getState().toHttpRequest()
      expect(req.url).not.toContain('page')
    })

    it('기존 URL에 ?가 있으면 &로 파라미터를 이어붙인다', () => {
      useRequestStore.getState().setUrl('https://example.com/posts?sort=asc')
      useRequestStore.getState().addQueryParam()
      const params = useRequestStore.getState().queryParams
      useRequestStore.getState().updateQueryParam(params[0].id, { key: 'page', value: '2', enabled: true })

      const req = useRequestStore.getState().toHttpRequest()
      expect(req.url).toContain('sort=asc&page=2')
    })

    it('파라미터가 없으면 URL에 ? 없이 반환한다', () => {
      useRequestStore.getState().setUrl('https://example.com/posts')
      const req = useRequestStore.getState().toHttpRequest()
      expect(req.url).toBe('https://example.com/posts')
    })
  })

  describe('reset', () => {
    it('reset 후 method는 GET, url은 빈 문자열로 초기화된다', () => {
      useRequestStore.getState().setMethod('DELETE')
      useRequestStore.getState().setUrl('https://example.com')
      useRequestStore.getState().reset()
      expect(useRequestStore.getState().method).toBe('GET')
      expect(useRequestStore.getState().url).toBe('')
    })
  })
})
