'use client'

import { useEffect, useState } from 'react'

async function initMocks() {
  if (typeof window === 'undefined') return
  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(process.env.NODE_ENV !== 'development')

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      initMocks()
        .catch((error) => console.error('MSW initialization failed:', error))
        .finally(() => setReady(true))
    }
  }, [])

  if (!ready) return null
  return <>{children}</>
}
