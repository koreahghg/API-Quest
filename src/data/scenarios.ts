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
  {
    id: 'auth-advanced',
    title: '인증과 권한의 벽',
    description: '로그인 성공부터 401·403·500·지연 응답까지, 실제 인증 시스템의 동작을 단계적으로 경험합니다.',
    difficulty: 'advanced',
    tags: ['인증', 'Bearer', '401', '403', '500', '지연'],
    order: 3,
    missions: [
      {
        id: 'aa-1',
        scenarioId: 'auth-advanced',
        order: 1,
        title: '로그인 성공',
        description:
          '올바른 자격증명으로 로그인하고 토큰을 발급받으세요.\n\n[상황] 이 API는 로그인 성공 시 응답 바디에 token을 반환합니다.\n[목표] 200 응답을 받고, 응답에 token 필드가 있어야 합니다.\n[실패 조건] 잘못된 자격증명 사용, GET 메서드 사용, token 없는 응답.\n\nhttps://api.quest/v1/auth/login',
        targetMethod: 'POST',
        targetEndpoint: 'https://api.quest/v1/auth/login',
        conditions: [
          { type: 'method_equals', target: 'method', expected: 'POST' },
          { type: 'status_equals', target: 'status', expected: 200 },
          { type: 'body_field_exists', target: 'token' },
        ],
        hints: [
          '로그인은 POST 메서드로 자격증명을 바디에 담아 보냅니다.',
          'Body 탭에 JSON 형식으로 이메일과 비밀번호를 입력하세요.',
          '바디: {"email": "user@example.com", "password": "secret123"}',
        ],
        status: 'active',
        attempts: 0,
      },
      {
        id: 'aa-2',
        scenarioId: 'auth-advanced',
        order: 2,
        title: '로그인 실패 — 401 Unauthorized',
        description:
          '이번엔 의도적으로 틀린 비밀번호를 보내서 401을 경험하세요.\n\n[상황] 서버는 자격증명이 틀리면 401을 반환합니다.\n[목표] 401 응답과 에러 메시지(message 필드)를 확인하세요.\n[실패 조건] 올바른 자격증명 사용, 다른 상태코드 수신.\n\nhttps://api.quest/v1/auth/login',
        targetMethod: 'POST',
        targetEndpoint: 'https://api.quest/v1/auth/login',
        conditions: [
          { type: 'status_equals', target: 'status', expected: 401 },
          { type: 'body_field_exists', target: 'message' },
        ],
        hints: [
          '401 Unauthorized — 신원 확인에 실패했다는 의미입니다.',
          '같은 URL에 같은 email, 다른 password를 보내보세요.',
          '바디: {"email": "user@example.com", "password": "wrong"}',
        ],
        status: 'locked',
        attempts: 0,
      },
      {
        id: 'aa-3',
        scenarioId: 'auth-advanced',
        order: 3,
        title: '토큰 없이 보호된 엔드포인트 접근 — 401',
        description:
          'Authorization 헤더 없이 프로필 엔드포인트에 접근해보세요.\n\n[상황] 이 엔드포인트는 로그인한 사용자만 접근 가능합니다.\n[목표] 헤더 없이 GET 요청을 보내 401 응답을 받으세요.\n[실패 조건] Authorization 헤더를 포함한 요청, 200 응답 수신.\n\nhttps://api.quest/v1/profile',
        targetMethod: 'GET',
        targetEndpoint: 'https://api.quest/v1/profile',
        conditions: [{ type: 'status_equals', target: 'status', expected: 401 }],
        hints: [
          '보호된 엔드포인트는 반드시 토큰이 있어야 200을 반환합니다.',
          'Headers 탭에 아무것도 추가하지 말고 GET 요청을 보내보세요.',
          'URL: https://api.quest/v1/profile  (헤더 없이)',
        ],
        status: 'locked',
        attempts: 0,
      },
      {
        id: 'aa-4',
        scenarioId: 'auth-advanced',
        order: 4,
        title: '권한 없는 관리자 리소스 접근 — 403 Forbidden',
        description:
          '일반 사용자 권한으로 관리자 전용 엔드포인트에 접근해보세요.\n\n[상황] 401과 403은 다릅니다. 401은 "당신이 누구인지 모름", 403은 "알지만 권한이 없음"입니다.\n[목표] GET 요청을 보내 403 응답과 message 필드를 확인하세요.\n[실패 조건] 다른 상태코드 수신.\n\nhttps://api.quest/v1/admin/users',
        targetMethod: 'GET',
        targetEndpoint: 'https://api.quest/v1/admin/users',
        conditions: [
          { type: 'status_equals', target: 'status', expected: 403 },
          { type: 'body_field_exists', target: 'message' },
        ],
        hints: [
          '403 Forbidden — 인증은 됐지만 해당 리소스에 대한 권한이 없습니다.',
          '401과 403의 차이: 401은 로그인 필요, 403은 권한 부족입니다.',
          'URL: https://api.quest/v1/admin/users  (GET 메서드)',
        ],
        status: 'locked',
        attempts: 0,
      },
      {
        id: 'aa-5',
        scenarioId: 'auth-advanced',
        order: 5,
        title: '서버 오류 경험 — 500 Internal Server Error',
        description:
          '서버 내부 오류를 직접 경험해보세요.\n\n[상황] 500은 클라이언트 요청이 잘못된 게 아니라 서버 쪽 문제입니다.\n[목표] GET 요청을 보내 500 응답과 code 필드를 확인하세요.\n[실패 조건] 다른 상태코드 수신.\n\nhttps://api.quest/v1/trigger-error',
        targetMethod: 'GET',
        targetEndpoint: 'https://api.quest/v1/trigger-error',
        conditions: [
          { type: 'status_equals', target: 'status', expected: 500 },
          { type: 'body_field_exists', target: 'code' },
        ],
        hints: [
          '500 Internal Server Error — 서버가 요청을 처리하다 예상치 못한 오류를 만났습니다.',
          '이 경우 재시도하거나, 서버 담당자에게 알려야 합니다. 클라이언트 잘못이 아닙니다.',
          'URL: https://api.quest/v1/trigger-error  (GET 메서드)',
        ],
        status: 'locked',
        attempts: 0,
      },
      {
        id: 'aa-6',
        scenarioId: 'auth-advanced',
        order: 6,
        title: '느린 응답 — 네트워크 지연 체감',
        description:
          '응답이 느린 엔드포인트에 요청을 보내고 기다려보세요.\n\n[상황] 이 엔드포인트는 응답에 2초가 걸립니다. 실제 서비스에서는 이런 경우 로딩 표시가 필요합니다.\n[목표] GET 요청을 보내 2초 후 200 응답과 data 필드를 확인하세요.\n[실패 조건] 응답 전에 취소, 다른 상태코드 수신.\n\nhttps://api.quest/v1/slow-data',
        targetMethod: 'GET',
        targetEndpoint: 'https://api.quest/v1/slow-data',
        conditions: [
          { type: 'status_equals', target: 'status', expected: 200 },
          { type: 'body_field_exists', target: 'data' },
        ],
        hints: [
          '서버가 느릴 수 있습니다. 요청을 보내고 응답을 기다려보세요.',
          '실제 프론트엔드에서는 이 2초 동안 사용자에게 로딩 스피너를 보여줘야 합니다.',
          'URL: https://api.quest/v1/slow-data  — 그냥 보내고 기다리면 됩니다.',
        ],
        status: 'locked',
        attempts: 0,
      },
    ],
  },
]
