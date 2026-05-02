import { http, HttpResponse } from 'msw'

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
]
