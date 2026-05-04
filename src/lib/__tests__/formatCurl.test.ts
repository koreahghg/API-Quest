import { describe, expect, it } from 'vitest'
import { formatAsCurl } from '../formatCurl'
import type { HttpRequest } from '@/types'

const makeRequest = (overrides: Partial<HttpRequest> = {}): HttpRequest => ({
  method: 'GET',
  url: 'https://example.com/posts',
  headers: [],
  queryParams: [],
  body: '',
  ...overrides,
})

describe('formatAsCurl', () => {
  describe('HTTP 메서드', () => {
    it('GET 요청은 -X 플래그를 포함하지 않는다', () => {
      const result = formatAsCurl(makeRequest({ method: 'GET' }))
      expect(result).not.toContain('-X')
    })

    it('POST 요청은 -X POST를 포함한다', () => {
      const result = formatAsCurl(makeRequest({ method: 'POST' }))
      expect(result).toContain('-X POST')
    })

    it('PUT 요청은 -X PUT을 포함한다', () => {
      const result = formatAsCurl(makeRequest({ method: 'PUT' }))
      expect(result).toContain('-X PUT')
    })

    it('DELETE 요청은 -X DELETE를 포함한다', () => {
      const result = formatAsCurl(makeRequest({ method: 'DELETE' }))
      expect(result).toContain('-X DELETE')
    })
  })

  describe('URL', () => {
    it('URL이 단일 따옴표로 감싸진다', () => {
      const result = formatAsCurl(makeRequest({ url: 'https://example.com' }))
      expect(result).toContain("'https://example.com'")
    })

    it("URL 안의 단일 따옴표를 '\\'' 로 이스케이프한다", () => {
      const result = formatAsCurl(makeRequest({ url: "https://example.com/it's" }))
      expect(result).toContain("'https://example.com/it'\\''s'")
    })
  })

  describe('헤더', () => {
    it('enabled=true 헤더는 -H 플래그로 포함된다', () => {
      const result = formatAsCurl(
        makeRequest({
          headers: [{ id: '1', key: 'Content-Type', value: 'application/json', enabled: true }],
        }),
      )
      expect(result).toContain("-H 'Content-Type: application/json'")
    })

    it('enabled=false 헤더는 제외된다', () => {
      const result = formatAsCurl(
        makeRequest({
          headers: [{ id: '1', key: 'Authorization', value: 'Bearer token', enabled: false }],
        }),
      )
      expect(result).not.toContain('Authorization')
    })

    it('key가 빈 문자열인 헤더는 제외된다', () => {
      const result = formatAsCurl(
        makeRequest({
          headers: [{ id: '1', key: '', value: 'something', enabled: true }],
        }),
      )
      expect(result).not.toContain('-H')
    })

    it("헤더 값 안의 단일 따옴표를 '\\'' 로 이스케이프한다", () => {
      const result = formatAsCurl(
        makeRequest({
          headers: [{ id: '1', key: 'X-Token', value: "it's-a-token", enabled: true }],
        }),
      )
      expect(result).toContain("'X-Token: it'\\''s-a-token'")
    })
  })

  describe('바디', () => {
    it('POST 요청의 바디는 -d 플래그로 포함된다', () => {
      const result = formatAsCurl(
        makeRequest({ method: 'POST', body: '{"title":"hello"}' }),
      )
      expect(result).toContain("-d '{\"title\":\"hello\"}'")
    })

    it('GET 요청은 바디가 있어도 -d를 포함하지 않는다', () => {
      const result = formatAsCurl(makeRequest({ body: '{"key":"val"}' }))
      expect(result).not.toContain('-d')
    })

    it('DELETE 요청은 바디가 있어도 -d를 포함하지 않는다', () => {
      const result = formatAsCurl(makeRequest({ method: 'DELETE', body: '{"id":1}' }))
      expect(result).not.toContain('-d')
    })

    it('바디가 빈 문자열이면 -d를 포함하지 않는다', () => {
      const result = formatAsCurl(makeRequest({ method: 'POST', body: '' }))
      expect(result).not.toContain('-d')
    })
  })

  describe('출력 형식', () => {
    it('여러 옵션이 있으면 줄바꿈(\\\\\\n  )으로 구분된다', () => {
      const result = formatAsCurl(
        makeRequest({
          method: 'POST',
          headers: [{ id: '1', key: 'Content-Type', value: 'application/json', enabled: true }],
          body: '{}',
        }),
      )
      expect(result).toContain('\\\n  ')
    })
  })
})
