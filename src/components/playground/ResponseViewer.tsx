'use client'
import { useResponseStore } from '@/stores'
import { STATUS_HINTS } from '@/constants/statusHints'

function StatusBadge({ status }: { status: number }) {
  const color =
    status < 300 ? 'text-emerald-400' : status < 400 ? 'text-sky-400' : 'text-red-400'
  return <span className={`font-mono font-bold text-sm ${color}`}>{status}</span>
}

export function ResponseViewer() {
  const status = useResponseStore((s) => s.status)
  const response = useResponseStore((s) => s.response)
  const error = useResponseStore((s) => s.error)

  if (status === 'idle') {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600 text-sm">Send 버튼을 눌러 요청을 보내보세요</p>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 text-sm">요청 중...</p>
      </div>
    )
  }

  if (status === 'error' && error) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <p className="text-red-400 font-mono font-bold text-sm">{error.hint.title}</p>
        <p className="text-gray-400 text-xs leading-relaxed">{error.hint.explanation}</p>
        {error.hint.commonMistakes.length > 0 && (
          <div>
            <p className="text-gray-500 text-xs font-medium mb-1">흔한 실수:</p>
            <ul className="space-y-1">
              {error.hint.commonMistakes.map((m, i) => (
                <li key={i} className="text-xs text-gray-400 flex gap-2">
                  <span className="text-red-500 shrink-0">•</span> {m}
                </li>
              ))}
            </ul>
          </div>
        )}
        {error.hint.nextSteps.length > 0 && (
          <div>
            <p className="text-gray-500 text-xs font-medium mb-1">다음 단계:</p>
            <ul className="space-y-1">
              {error.hint.nextSteps.map((step, i) => (
                <li key={i} className="text-xs text-gray-400 flex gap-2">
                  <span className="text-indigo-400 shrink-0">→</span> {step}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  if (status === 'success' && response) {
    const hint = STATUS_HINTS[response.status]
    const isError = response.status >= 400
    const bodyStr =
      typeof response.body === 'object'
        ? JSON.stringify(response.body, null, 2)
        : response.bodyRaw

    return (
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-800 bg-gray-900 shrink-0">
          <StatusBadge status={response.status} />
          <span className="text-gray-500 text-xs">{response.statusText}</span>
          <span className="ml-auto text-gray-600 text-xs">{response.duration}ms</span>
          <span className="text-gray-600 text-xs">{(response.size / 1024).toFixed(1)}KB</span>
        </div>

        {hint && (
          <div className={`px-4 py-2.5 border-b border-gray-800 ${isError ? 'bg-red-950/20' : 'bg-gray-900/40'}`}>
            <p className={`text-xs font-medium mb-0.5 ${isError ? 'text-red-400' : 'text-gray-400'}`}>
              {hint.title}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">{hint.explanation}</p>
            {isError && hint.nextSteps.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {hint.nextSteps.map((step, i) => (
                  <li key={i} className="text-xs text-gray-500 flex gap-1.5">
                    <span className="text-indigo-500 shrink-0">→</span> {step}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <pre className="p-4 text-xs font-mono text-gray-300 whitespace-pre-wrap break-all">
          {bodyStr}
        </pre>
      </div>
    )
  }

  return null
}
