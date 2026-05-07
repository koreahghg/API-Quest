'use client'
import { useEffect } from 'react'

interface Props {
  onClose: () => void
  children: React.ReactNode
}

export function PanelOverlay({ onClose, children }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="absolute inset-0 z-10 bg-gray-950 flex flex-col">
      {children}
    </div>
  )
}
