'use client'
import { useState } from 'react'

interface Props {
  getText: () => string
  label?: string
  className?: string
}

export function CopyButton({ getText, label = 'Copy', className = '' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard 접근 거부 시 무시
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-xs transition-colors px-2 py-1 rounded ${
        copied
          ? 'text-emerald-400'
          : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
      } ${className}`}
    >
      {copied ? '✓ Copied' : label}
    </button>
  )
}
