import type { StatusHint } from '@/types'

export const STATUS_HINTS: Record<number | string, StatusHint> = {
  200: {
    code: 200,
    title: '200 OK — 요청 성공',
    explanation: '서버가 요청을 정상적으로 처리했습니다.',
    commonMistakes: [],
    nextSteps: ['응답 바디를 확인하세요', 'Content-Type 헤더를 확인하세요'],
  },
  201: {
    code: 201,
    title: '201 Created — 리소스 생성 완료',
    explanation: 'POST 요청으로 새 리소스가 성공적으로 생성되었습니다.',
    commonMistakes: [],
    nextSteps: ['Location 헤더에서 새 리소스 URL을 확인하세요'],
  },
  400: {
    code: 400,
    title: '400 Bad Request — 잘못된 요청',
    explanation: '서버가 요청 문법을 이해할 수 없습니다. 요청 형식이 잘못되었습니다.',
    commonMistakes: [
      'JSON 바디 형식이 올바르지 않은 경우',
      '필수 필드가 누락된 경우',
      'Content-Type 헤더가 application/json으로 설정되지 않은 경우',
    ],
    nextSteps: [
      '요청 바디가 유효한 JSON인지 확인하세요',
      'API 문서의 필수 파라미터를 확인하세요',
    ],
  },
  401: {
    code: 401,
    title: '401 Unauthorized — 인증 필요',
    explanation:
      '이 리소스에 접근하려면 인증이 필요합니다. 토큰이 없거나 유효하지 않습니다.',
    commonMistakes: [
      'Authorization 헤더가 누락된 경우',
      'Bearer 접두사 없이 토큰만 보낸 경우 (예: "abc123" → "Bearer abc123")',
      '만료된 토큰을 사용한 경우',
    ],
    nextSteps: [
      'Headers 탭에서 Authorization: Bearer <토큰> 을 추가하세요',
      '토큰이 만료되지 않았는지 확인하세요',
    ],
  },
  403: {
    code: 403,
    title: '403 Forbidden — 접근 권한 없음',
    explanation: '인증은 됐지만 이 리소스에 접근할 권한이 없습니다.',
    commonMistakes: [
      '읽기 권한만 있는데 쓰기 요청을 시도한 경우',
      '다른 사용자의 리소스에 접근하려는 경우',
      '관리자 전용 엔드포인트에 일반 계정으로 접근한 경우',
    ],
    nextSteps: [
      '사용 중인 계정의 권한 수준을 확인하세요',
      '올바른 API 키 또는 토큰을 사용하고 있는지 확인하세요',
    ],
  },
  404: {
    code: 404,
    title: '404 Not Found — 리소스 없음',
    explanation: '요청한 URL에 해당하는 리소스가 서버에 없습니다.',
    commonMistakes: [
      'URL 오타 (예: /usres → /users)',
      '존재하지 않는 ID로 요청한 경우',
      'API 버전 경로가 다른 경우 (예: /v1 vs /v2)',
    ],
    nextSteps: ['URL 철자를 다시 확인하세요', 'API 문서의 엔드포인트와 대조하세요'],
  },
  405: {
    code: 405,
    title: '405 Method Not Allowed — 허용되지 않는 메서드',
    explanation:
      '해당 URL은 존재하지만, 사용한 HTTP 메서드를 지원하지 않습니다.',
    commonMistakes: [
      'GET만 지원하는 엔드포인트에 POST를 보낸 경우',
      '읽기 전용 API에 DELETE를 시도한 경우',
    ],
    nextSteps: [
      'API 문서에서 해당 엔드포인트의 허용 메서드를 확인하세요',
      '응답의 Allow 헤더에 허용된 메서드 목록이 있습니다',
    ],
  },
  409: {
    code: 409,
    title: '409 Conflict — 충돌',
    explanation: '요청이 현재 서버 상태와 충돌합니다.',
    commonMistakes: [
      '이미 사용 중인 이메일로 회원가입을 시도한 경우',
      '이미 존재하는 리소스를 다시 생성하려는 경우',
    ],
    nextSteps: ['중복된 값(이메일, 아이디 등)이 없는지 확인하세요'],
  },
  422: {
    code: 422,
    title: '422 Unprocessable Entity — 유효성 검사 실패',
    explanation:
      '요청 형식은 맞지만 내용이 유효하지 않아 처리할 수 없습니다.',
    commonMistakes: [
      '이메일 형식이 올바르지 않은 경우',
      '비밀번호가 최소 길이를 충족하지 않는 경우',
      '숫자 필드에 문자열을 보낸 경우',
    ],
    nextSteps: [
      '각 필드의 유효성 조건을 확인하세요',
      '에러 응답 바디의 errors 필드에 상세 이유가 있습니다',
    ],
  },
  429: {
    code: 429,
    title: '429 Too Many Requests — 요청 한도 초과',
    explanation:
      '단시간에 너무 많은 요청을 보냈습니다. Rate Limit에 걸렸습니다.',
    commonMistakes: [
      '루프 안에서 API를 반복 호출한 경우',
      '무료 플랜의 분당 요청 한도를 초과한 경우',
    ],
    nextSteps: [
      '잠시 후 다시 시도하세요',
      'Retry-After 응답 헤더의 대기 시간을 확인하세요',
    ],
  },
  500: {
    code: 500,
    title: '500 Internal Server Error — 서버 내부 오류',
    explanation:
      '서버 내부에서 예상치 못한 오류가 발생했습니다. 요청이 아닌 서버 측 문제입니다.',
    commonMistakes: [],
    nextSteps: ['잠시 후 다시 시도하세요', '서비스 상태 페이지가 있다면 확인하세요'],
  },
  502: {
    code: 502,
    title: '502 Bad Gateway — 게이트웨이 오류',
    explanation:
      '서버가 게이트웨이 역할을 하다가 업스트림 서버로부터 잘못된 응답을 받았습니다.',
    commonMistakes: [],
    nextSteps: ['서버가 점검 중일 수 있습니다. 잠시 후 재시도하세요'],
  },
  503: {
    code: 503,
    title: '503 Service Unavailable — 서비스 일시 중단',
    explanation:
      '서버가 현재 요청을 처리할 수 없는 상태입니다 (점검 또는 과부하).',
    commonMistakes: [],
    nextSteps: ['Retry-After 헤더를 확인하고 대기 후 재시도하세요'],
  },
  cors: {
    code: 'cors',
    title: 'CORS Error — 교차 출처 차단',
    explanation:
      '브라우저가 다른 출처(Origin)의 응답을 보안 정책으로 차단했습니다. 서버의 Access-Control-Allow-Origin 설정이 없거나, 현재 출처가 허용 목록에 없습니다.',
    commonMistakes: [
      'React/Next.js에서 외부 API를 직접 호출할 때 발생',
      '서버 측에 CORS 설정이 전혀 없는 경우',
      'Postman에서는 성공해도 브라우저에서는 실패할 수 있습니다 — CORS는 브라우저 전용 정책이기 때문입니다',
    ],
    nextSteps: [
      '서버에 Access-Control-Allow-Origin 헤더를 추가하세요',
      'Next.js API Route 같은 프록시를 통해 우회하세요',
    ],
  },
  network: {
    code: 'network',
    title: 'Network Error — 네트워크 연결 실패',
    explanation:
      '서버에 연결할 수 없습니다. 인터넷이 끊겼거나, URL이 잘못됐거나, 서버가 오프라인 상태입니다.',
    commonMistakes: [
      'URL이 http:// 또는 https://로 시작하지 않는 경우',
      '로컬 서버가 실행 중이지 않은 경우',
      '포트 번호가 틀린 경우 (예: :3000 vs :8080)',
    ],
    nextSteps: [
      '인터넷 연결을 확인하세요',
      'URL 형식이 올바른지 확인하세요',
      '서버가 실행 중인지 확인하세요',
    ],
  },
  parse: {
    code: 'parse',
    title: 'Parse Error — 응답 파싱 실패',
    explanation:
      '서버가 응답을 보냈지만 JSON 형식이 아닙니다.',
    commonMistakes: [
      '서버가 JSON 대신 HTML 에러 페이지를 반환한 경우',
      'Content-Type이 application/json이 아닌 경우',
    ],
    nextSteps: [
      '응답 원문(raw)을 확인하세요',
      'Accept: application/json 헤더를 요청에 추가해보세요',
    ],
  },
  invalid_url: {
    code: 'invalid_url',
    title: 'Invalid URL — 잘못된 URL 형식',
    explanation: '입력한 URL 형식이 올바르지 않아 요청을 보낼 수 없습니다.',
    commonMistakes: [
      'http:// 또는 https:// 없이 도메인만 입력한 경우',
      '공백이나 특수문자가 인코딩되지 않은 경우',
    ],
    nextSteps: [
      'URL이 https://example.com/path 형식인지 확인하세요',
      '공백은 %20으로 인코딩하거나 쿼리 파라미터 탭을 활용하세요',
    ],
  },
}
