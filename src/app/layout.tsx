import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'API Quest',
  description: '초보 개발자를 위한 인터랙티브 API 학습 플랫폼',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
