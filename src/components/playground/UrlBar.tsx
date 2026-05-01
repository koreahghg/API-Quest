'use client'
import { useRequestStore, useResponseStore } from '@/stores'
import { useSendRequest } from '@/hooks/useSendRequest'
import { MethodSelector } from './MethodSelector'

export function UrlBar() {
  const url = useRequestStore((s) => s.url)
  const setUrl = useRequestStore((s) => s.setUrl)
  const responseStatus = useResponseStore((s) => s.status)
  const { send } = useSendRequest()

  const isLoading = responseStatus === 'loading'

  return (
    <div className="flex gap-2 p-3 border-b border-gray-800 shrink-0">
      <MethodSelector />
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !isLoading && send()}
        placeholder="https://api.example.com/endpoint"
        className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm font-mono
          text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <button
        onClick={send}
        disabled={isLoading}
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
          text-white text-sm font-bold rounded transition-colors shrink-0"
      >
        {isLoading ? '...' : 'Send'}
      </button>
    </div>
  )
}
