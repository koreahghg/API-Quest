import type { Scenario } from '@/types'

export const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 'http-basics',
    title: 'HTTP 기초',
    description: 'GET, POST, DELETE 메서드와 상태코드를 직접 경험으로 익힙니다.',
    difficulty: 'beginner',
    tags: ['GET', 'POST', 'DELETE', '상태코드'],
    order: 1,
    missions: [
      {
        id: 'hb-1',
        scenarioId: 'http-basics',
        order: 1,
        title: '첫 GET 요청',
        description:
          'JSONPlaceholder에서 게시글 목록을 조회하세요.\nGET 메서드로 아래 URL에 요청을 보내보세요.\n\nhttps://jsonplaceholder.typicode.com/posts',
        targetMethod: 'GET',
        targetEndpoint: 'https://jsonplaceholder.typicode.com/posts',
        conditions: [
          { type: 'method_equals', target: 'method', expected: 'GET' },
          { type: 'status_equals', target: 'status', expected: 200 },
        ],
        hints: [
          'HTTP 메서드 중 데이터를 "읽을 때" 사용하는 것은 GET입니다.',
          'URL을 입력하고 메서드를 GET으로 설정한 뒤 Send를 눌러보세요.',
          '정답 URL: https://jsonplaceholder.typicode.com/posts',
        ],
        status: 'active',
        attempts: 0,
      },
      {
        id: 'hb-2',
        scenarioId: 'http-basics',
        order: 2,
        title: '단일 리소스 조회',
        description:
          'ID가 1인 게시글을 조회하세요.\nURL 경로에 리소스 ID를 포함하는 것이 REST API의 기본 설계입니다.\n\nhttps://jsonplaceholder.typicode.com/posts/1',
        targetMethod: 'GET',
        targetEndpoint: 'https://jsonplaceholder.typicode.com/posts/1',
        conditions: [
          { type: 'status_equals', target: 'status', expected: 200 },
          { type: 'body_field_exists', target: 'id' },
        ],
        hints: [
          'URL 경로 끝에 리소스 ID를 붙이면 단일 리소스를 조회할 수 있습니다.',
          '/posts 뒤에 /1을 추가해보세요.',
          '정답 URL: https://jsonplaceholder.typicode.com/posts/1',
        ],
        status: 'locked',
        attempts: 0,
      },
      {
        id: 'hb-3',
        scenarioId: 'http-basics',
        order: 3,
        title: '데이터 생성 (POST)',
        description:
          '새 게시글을 생성하세요.\nPOST 메서드와 JSON 바디가 필요합니다. 성공하면 201 Created가 반환됩니다.\n\nhttps://jsonplaceholder.typicode.com/posts',
        targetMethod: 'POST',
        targetEndpoint: 'https://jsonplaceholder.typicode.com/posts',
        conditions: [
          { type: 'method_equals', target: 'method', expected: 'POST' },
          { type: 'status_equals', target: 'status', expected: 201 },
        ],
        hints: [
          'POST는 새로운 리소스를 생성할 때 사용합니다. 성공 시 201 Created가 반환됩니다.',
          'Body 탭에서 JSON 형식으로 데이터를 입력하고 메서드를 POST로 바꾸세요.',
          '바디에 이렇게 입력해보세요: {"title": "나의 첫 게시글", "body": "내용입니다", "userId": 1}',
        ],
        status: 'locked',
        attempts: 0,
      },
      {
        id: 'hb-4',
        scenarioId: 'http-basics',
        order: 4,
        title: '404를 직접 경험하기',
        description:
          '존재하지 않는 리소스에 접근해서 404를 경험하세요.\n404는 "리소스를 찾을 수 없음"을 의미합니다.\n\nhttps://jsonplaceholder.typicode.com/posts/9999',
        targetMethod: 'GET',
        targetEndpoint: 'https://jsonplaceholder.typicode.com/posts/9999',
        conditions: [
          { type: 'status_equals', target: 'status', expected: 404 },
        ],
        hints: [
          '404는 "Not Found"입니다. 존재하지 않는 ID로 요청을 보내보세요.',
          '/posts 뒤에 아주 큰 숫자를 붙여보세요 (예: 9999).',
          '정답 URL: https://jsonplaceholder.typicode.com/posts/9999',
        ],
        status: 'locked',
        attempts: 0,
      },
      {
        id: 'hb-5',
        scenarioId: 'http-basics',
        order: 5,
        title: '리소스 삭제 (DELETE)',
        description:
          'DELETE 메서드로 게시글을 삭제하세요.\nURL은 /posts/1 그대로이지만 메서드만 바꾸면 됩니다.\n\nhttps://jsonplaceholder.typicode.com/posts/1',
        targetMethod: 'DELETE',
        targetEndpoint: 'https://jsonplaceholder.typicode.com/posts/1',
        conditions: [
          { type: 'method_equals', target: 'method', expected: 'DELETE' },
          { type: 'status_equals', target: 'status', expected: 200 },
        ],
        hints: [
          'DELETE 메서드는 리소스를 삭제할 때 사용합니다.',
          'URL은 그대로 두고 메서드 드롭다운에서 DELETE를 선택해보세요.',
          'URL: https://jsonplaceholder.typicode.com/posts/1  메서드: DELETE',
        ],
        status: 'locked',
        attempts: 0,
      },
    ],
  },
  {
    id: 'auth-mastery',
    title: '인증 마스터',
    description: '401, 400 에러와 Bearer 토큰 인증 흐름을 reqres.in으로 실습합니다.',
    difficulty: 'intermediate',
    tags: ['인증', 'Bearer', '401', '400', 'POST'],
    order: 2,
    missions: [
      {
        id: 'am-1',
        scenarioId: 'auth-mastery',
        order: 1,
        title: '사용자 정보 조회',
        description:
          'reqres.in에서 사용자 정보를 조회하세요.\n이 API는 실제 서비스와 유사한 응답 구조를 갖고 있습니다.\n\nhttps://reqres.in/api/users/2',
        targetMethod: 'GET',
        targetEndpoint: 'https://reqres.in/api/users/2',
        conditions: [
          { type: 'status_equals', target: 'status', expected: 200 },
          { type: 'body_field_exists', target: 'data' },
        ],
        hints: [
          'reqres.in은 테스트용 공개 API입니다. GET /api/users/2에 요청해보세요.',
          '응답 바디에 data 필드가 있는지 확인하세요.',
          '정답 URL: https://reqres.in/api/users/2',
        ],
        status: 'active',
        attempts: 0,
      },
      {
        id: 'am-2',
        scenarioId: 'auth-mastery',
        order: 2,
        title: '로그인으로 토큰 발급',
        description:
          'POST 요청으로 로그인해서 토큰을 받으세요.\n성공하면 응답 바디에 token 필드가 포함됩니다.\n\nhttps://reqres.in/api/login',
        targetMethod: 'POST',
        targetEndpoint: 'https://reqres.in/api/login',
        conditions: [
          { type: 'status_equals', target: 'status', expected: 200 },
          { type: 'body_field_exists', target: 'token' },
        ],
        hints: [
          'POST /api/login에 자격증명을 Body에 담아 보내야 합니다.',
          '메서드를 POST로 설정하고 Body 탭에 JSON을 입력하세요.',
          '바디: {"email": "eve.holt@reqres.in", "password": "cityslicka"}',
        ],
        status: 'locked',
        attempts: 0,
      },
      {
        id: 'am-3',
        scenarioId: 'auth-mastery',
        order: 3,
        title: '잘못된 자격증명 (400)',
        description:
          '이번엔 의도적으로 틀린 요청을 보내서 400 에러를 경험하세요.\n에러 응답 바디의 error 필드를 꼭 읽어보세요.\n\nhttps://reqres.in/api/login',
        targetMethod: 'POST',
        targetEndpoint: 'https://reqres.in/api/login',
        conditions: [
          { type: 'status_equals', target: 'status', expected: 400 },
          { type: 'body_field_exists', target: 'error' },
        ],
        hints: [
          '400은 "Bad Request"입니다. 잘못된 형식의 요청을 보내면 발생합니다.',
          'password 필드 없이 email만 보내보세요.',
          '바디: {"email": "eve.holt@reqres.in"} (password 없이)',
        ],
        status: 'locked',
        attempts: 0,
      },
    ],
  },
]
