import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'

// ── JSONPlaceholder ───────────────────────────────────────────────────────────

describe('JSONPlaceholder', () => {
  describe('GET /posts', () => {
    it('10개의 게시글 배열을 반환한다', async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
      expect(data).toHaveLength(10)
    })

    it('각 게시글에 id, title, body, userId가 있다', async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      const [first] = await res.json()
      expect(first).toHaveProperty('id')
      expect(first).toHaveProperty('title')
      expect(first).toHaveProperty('body')
      expect(first).toHaveProperty('userId')
    })
  })

  describe('GET /posts/:id', () => {
    it('유효한 ID(1) → 해당 게시글 반환', async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts/1')
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data.id).toBe(1)
    })

    it('범위 초과 ID(999) → 404', async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts/999')
      expect(res.status).toBe(404)
    })

    it('경계값 ID(10) → 200', async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts/10')
      expect(res.status).toBe(200)
    })

    it('경계값 초과 ID(11) → 404', async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts/11')
      expect(res.status).toBe(404)
    })
  })

  describe('POST /posts', () => {
    it('201을 반환하고 id=101을 포함한다', async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '새 게시글', body: '내용', userId: 1 }),
      })
      const data = await res.json()
      expect(res.status).toBe(201)
      expect(data.id).toBe(101)
    })

    it('전송한 바디 필드가 응답에 병합된다', async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '테스트' }),
      })
      const data = await res.json()
      expect(data.title).toBe('테스트')
    })

    it('바디 없이 요청해도 201을 반환한다', async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
      })
      expect(res.status).toBe(201)
    })
  })

  describe('DELETE /posts/:id', () => {
    it('빈 객체와 200을 반환한다', async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'DELETE',
      })
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data).toEqual({})
    })
  })
})

// ── reqres.in ─────────────────────────────────────────────────────────────────

describe('reqres.in', () => {
  describe('GET /api/users/:id', () => {
    it('사용자 데이터를 반환한다', async () => {
      const res = await fetch('https://reqres.in/api/users/2')
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data.data).toHaveProperty('id', 2)
      expect(data.data).toHaveProperty('email')
      expect(data.data).toHaveProperty('first_name')
    })
  })

  describe('POST /api/login', () => {
    it('password 포함 → 200 + 토큰 반환', async () => {
      const res = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@example.com', password: 'anypass' }),
      })
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data.token).toBeDefined()
    })

    it('password 누락 → 400 + 에러 메시지', async () => {
      const res = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@example.com' }),
      })
      const data = await res.json()
      expect(res.status).toBe(400)
      expect(data.error).toBe('Missing password')
    })
  })
})

// ── api.quest ─────────────────────────────────────────────────────────────────

describe('api.quest', () => {
  describe('POST /v1/auth/login', () => {
    it('올바른 자격증명 → 200 + token + user 반환', async () => {
      const res = await fetch('https://api.quest/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@example.com', password: 'secret123' }),
      })
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data.token).toBeDefined()
      expect(data.user.email).toBe('user@example.com')
      expect(data.user.role).toBe('user')
    })

    it('잘못된 비밀번호 → 401', async () => {
      const res = await fetch('https://api.quest/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@example.com', password: 'wrongpass' }),
      })
      expect(res.status).toBe(401)
    })

    it('존재하지 않는 이메일 → 401', async () => {
      const res = await fetch('https://api.quest/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nobody@example.com', password: 'secret123' }),
      })
      expect(res.status).toBe(401)
    })

    it('JSON이 아닌 바디 → 400', async () => {
      const res = await fetch('https://api.quest/v1/auth/login', {
        method: 'POST',
        body: 'not-json',
      })
      expect(res.status).toBe(400)
    })
  })

  describe('GET /v1/profile', () => {
    it('유효한 토큰 → 200 + 프로필 반환', async () => {
      const res = await fetch('https://api.quest/v1/profile', {
        headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.mock-token' },
      })
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data.email).toBe('user@example.com')
      expect(data.name).toBe('홍길동')
    })

    it('Authorization 헤더 없음 → 401', async () => {
      const res = await fetch('https://api.quest/v1/profile')
      expect(res.status).toBe(401)
    })

    it('잘못된 토큰 → 401', async () => {
      const res = await fetch('https://api.quest/v1/profile', {
        headers: { Authorization: 'Bearer invalid-token' },
      })
      expect(res.status).toBe(401)
    })
  })

  describe('GET /v1/admin/users', () => {
    it('Authorization 헤더 없음 → 401', async () => {
      const res = await fetch('https://api.quest/v1/admin/users')
      const data = await res.json()
      expect(res.status).toBe(401)
      expect(data.message).toContain('인증')
    })

    it('토큰이 있어도 일반 유저 → 403 (권한 부족)', async () => {
      const res = await fetch('https://api.quest/v1/admin/users', {
        headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.mock-token' },
      })
      const data = await res.json()
      expect(res.status).toBe(403)
      expect(data.message).toContain('관리자')
    })
  })

  describe('GET /v1/trigger-error', () => {
    it('항상 500을 반환한다', async () => {
      const res = await fetch('https://api.quest/v1/trigger-error')
      const data = await res.json()
      expect(res.status).toBe(500)
      expect(data.code).toBe('INTERNAL_ERROR')
    })
  })

  describe('GET /v1/slow-data (handler override)', () => {
    it('지연 없이 오버라이드하면 200 + 데이터 반환', async () => {
      // 테스트에서는 delay를 제거한 핸들러로 덮어씀
      server.use(
        http.get('https://api.quest/v1/slow-data', () =>
          HttpResponse.json({ data: '느린 응답이 도착했습니다.', timestamp: Date.now() }),
        ),
      )
      const res = await fetch('https://api.quest/v1/slow-data')
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data.data).toBe('느린 응답이 도착했습니다.')
    })
  })
})
