import { http, HttpResponse, delay } from 'msw'

const POSTS = Array.from({ length: 10 }, (_, i) => ({
  userId: 1,
  id: i + 1,
  title: `게시글 제목 ${i + 1}`,
  body: `게시글 내용 ${i + 1}`,
}))

export const handlers = [
  // JSONPlaceholder — GET /posts
  http.get('https://jsonplaceholder.typicode.com/posts', () => {
    return HttpResponse.json(POSTS)
  }),

  // JSONPlaceholder — GET /posts/:id  (ID 범위 초과 시 404)
  http.get('https://jsonplaceholder.typicode.com/posts/:id', ({ params }) => {
    const id = parseInt(params.id as string)
    const post = POSTS.find((p) => p.id === id)
    if (!post) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(post)
  }),

  // JSONPlaceholder — POST /posts (201 반환)
  http.post('https://jsonplaceholder.typicode.com/posts', async ({ request }) => {
    let body: object = {}
    try {
      body = (await request.json()) as object
    } catch {
      // 바디 없이 온 요청도 201로 통과
    }
    return HttpResponse.json({ id: 101, ...body }, { status: 201 })
  }),

  // JSONPlaceholder — DELETE /posts/:id
  http.delete('https://jsonplaceholder.typicode.com/posts/:id', () => {
    return HttpResponse.json({})
  }),

  // reqres.in — GET /api/users/:id
  http.get('https://reqres.in/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      data: {
        id: parseInt(params.id as string),
        email: 'janet.weaver@reqres.in',
        first_name: 'Janet',
        last_name: 'Weaver',
        avatar: 'https://reqres.in/img/faces/2-image.jpg',
      },
    })
  }),

  // reqres.in — POST /api/login (password 누락 시 400)
  http.post('https://reqres.in/api/login', async ({ request }) => {
    let body: Record<string, string> = {}
    try {
      body = (await request.json()) as Record<string, string>
    } catch {
      return HttpResponse.json({ error: 'Missing password' }, { status: 400 })
    }
    if (!body.password) {
      return HttpResponse.json({ error: 'Missing password' }, { status: 400 })
    }
    return HttpResponse.json({ token: 'QpwL5tpe83ilfN2' })
  }),

  // api.quest — POST /v1/auth/login (올바른 자격증명: user@example.com / secret123)
  http.post('https://api.quest/v1/auth/login', async ({ request }) => {
    let body: Record<string, string> = {}
    try {
      body = (await request.json()) as Record<string, string>
    } catch {
      return HttpResponse.json({ message: '요청 바디가 올바르지 않습니다.' }, { status: 400 })
    }
    if (body.email === 'user@example.com' && body.password === 'secret123') {
      return HttpResponse.json({
        token: 'eyJhbGciOiJIUzI1NiJ9.mock-token',
        user: { id: 1, email: 'user@example.com', role: 'user' },
      })
    }
    return HttpResponse.json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' }, { status: 401 })
  }),

  // api.quest — GET /v1/profile (aa-1에서 발급한 토큰과 일치해야 200)
  http.get('https://api.quest/v1/profile', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (auth !== 'Bearer eyJhbGciOiJIUzI1NiJ9.mock-token') {
      return HttpResponse.json({ message: '유효하지 않거나 없는 토큰입니다.' }, { status: 401 })
    }
    return HttpResponse.json({ id: 1, email: 'user@example.com', name: '홍길동', role: 'user' })
  }),

  // api.quest — GET /v1/admin/users (항상 403, 일반 사용자 접근 불가)
  http.get('https://api.quest/v1/admin/users', () => {
    return HttpResponse.json({ message: '관리자 권한이 필요합니다.' }, { status: 403 })
  }),

  // api.quest — GET /v1/trigger-error (항상 500)
  http.get('https://api.quest/v1/trigger-error', () => {
    return HttpResponse.json(
      { message: '내부 서버 오류가 발생했습니다.', code: 'INTERNAL_ERROR' },
      { status: 500 },
    )
  }),

  // api.quest — GET /v1/slow-data (2초 지연 후 200)
  http.get('https://api.quest/v1/slow-data', async () => {
    await delay(2000)
    return HttpResponse.json({ data: '느린 응답이 도착했습니다.', timestamp: Date.now() })
  }),
]
