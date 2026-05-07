import { describe, it, expect } from 'vitest'
import { interpolate } from '../interpolate'

describe('interpolate', () => {
  it('단일 변수를 치환한다', () => {
    expect(interpolate('{{BASE_URL}}/users', { BASE_URL: 'https://api.example.com' }))
      .toBe('https://api.example.com/users')
  })

  it('여러 변수를 치환한다', () => {
    expect(interpolate('{{HOST}}/{{PATH}}', { HOST: 'https://api.example.com', PATH: 'users' }))
      .toBe('https://api.example.com/users')
  })

  it('같은 변수가 여러 번 등장하면 모두 치환한다', () => {
    expect(interpolate('{{BASE}}/{{BASE}}/users', { BASE: 'api' }))
      .toBe('api/api/users')
  })

  it('정의되지 않은 변수는 원본 그대로 유지한다', () => {
    expect(interpolate('{{UNKNOWN}}/users', {}))
      .toBe('{{UNKNOWN}}/users')
  })

  it('변수 맵이 비어있으면 원본 문자열을 반환한다', () => {
    const url = 'https://api.example.com/users'
    expect(interpolate(url, {})).toBe(url)
  })

  it('변수가 없는 문자열은 그대로 반환한다', () => {
    expect(interpolate('https://api.example.com/users', { BASE_URL: 'ignored' }))
      .toBe('https://api.example.com/users')
  })

  it('헤더 값의 변수를 치환한다', () => {
    expect(interpolate('Bearer {{TOKEN}}', { TOKEN: 'abc123' }))
      .toBe('Bearer abc123')
  })

  it('변수 맵의 키가 없으면 {{변수명}} 을 그대로 남긴다', () => {
    expect(interpolate('{{MISSING}}', { OTHER: 'value' }))
      .toBe('{{MISSING}}')
  })
})
