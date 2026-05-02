import type { Metadata } from 'next'
import './globals.css'
import { MSWProvider } from '@/components/MSWProvider'

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
      <body>
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  )
}
