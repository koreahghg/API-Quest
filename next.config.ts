import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // NEXT_PUBLIC_* 변수는 자동으로 클라이언트에 노출됨.
  // 서버 전용 비밀키는 여기서 절대 NEXT_PUBLIC_ 접두사 사용 금지.
}

export default nextConfig
