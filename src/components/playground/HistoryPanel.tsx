'use client'
import { useHistoryStore, useRequestStore } from '@/stores'
import type { HistoryEntry } from '@/stores'
import type { HttpMethod } from '@/types'

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'text-emerald-400',
  POST: 'text-sky-400',
  PUT: 'text-amber-400',
  PATCH: 'text-violet-400',
  DELETE: 'text-red-400',
}

function getUrlPath(url: string): string {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

function StatusLabel({ entry }: { entry: HistoryEntry }) {
  if (entry.error) return <span className="text-red-400 text-xs font-mono">ERR</span>
  if (!entry.response) return null
  const { status } = entry.response
  const color =
    status < 300 ? 'text-emerald-400' : status < 400 ? 'text-sky-400' : 'text-red-400'
  return <span className={`${color} text-xs font-mono`}>{status}</span>
}

interface Props {
  onClose: () => void
}

export function HistoryPanel({ onClose }: Props) {
  const entries = useHistoryStore((s) => s.entries)
  const clear = useHistoryStore((s) => s.clear)
  const setMethod = useRequestStore((s) => s.setMethod)
  const setUrl = useRequestStore((s) => s.setUrl)
  const setBody = useRequestStore((s) => s.setBody)
  const setHeaders = useRequestStore((s) => s.setHeaders)
  const setQueryParams = useRequestStore((s) => s.setQueryParams)

  const handleLoad = (entry: HistoryEntry) => {
    setMethod(entry.request.method)
    setUrl(entry.request.url)
    setBody(entry.request.body)
    setHeaders(entry.request.headers)
    // url은 이미 파라미터가 포함된 resolved URL이므로 queryParams를 비워 중복 방지
    setQueryParams([])
    onClose()
  }

  return (
    <div className="absolute inset-0 z-10 bg-gray-950 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 shrink-0">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          History
        </span>
        <div className="flex items-center gap-3">
          {entries.length > 0 && (
            <button
              onClick={clear}
              className="text-xs text-gray-600 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-200 text-lg leading-none transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 text-xs">아직 요청 기록이 없습니다</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => handleLoad(entry)}
              className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-800/60 transition-colors text-left border-b border-gray-800/50"
            >
              <span
                className={`text-xs font-mono font-bold w-14 shrink-0 ${
                  METHOD_COLORS[entry.request.method] ?? 'text-gray-400'
                }`}
              >
                {entry.request.method}
              </span>
              <span className="flex-1 text-xs font-mono text-gray-300 truncate">
                {getUrlPath(entry.request.url)}
              </span>
              <StatusLabel entry={entry} />
              <span className="text-xs text-gray-600 shrink-0">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
