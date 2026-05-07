'use client'

import { useEffect, useState } from 'react'

const USE_MSW = process.env.NEXT_PUBLIC_USE_MSW === 'true'

async function initMocks() {
  if (typeof window === 'undefined') return
  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!USE_MSW)

  useEffect(() => {
    if (!USE_MSW) return
    initMocks()
      .catch((error) => console.error('MSW initialization failed:', error))
      .finally(() => setReady(true))
  }, [])

  if (!ready) return null
  return <>{children}</>
}
