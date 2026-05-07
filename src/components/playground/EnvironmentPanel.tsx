'use client'
import { useEnvStore } from '@/stores'

interface Props {
  onClose: () => void
}

export function EnvironmentPanel({ onClose }: Props) {
  const variables = useEnvStore((s) => s.variables)
  const addVariable = useEnvStore((s) => s.addVariable)
  const updateVariable = useEnvStore((s) => s.updateVariable)
  const toggleVariable = useEnvStore((s) => s.toggleVariable)
  const removeVariable = useEnvStore((s) => s.removeVariable)

  return (
    <div className="absolute inset-0 z-10 bg-gray-950 flex flex-col">
      <div className="flex items-start justify-between px-4 py-3 border-b border-gray-800 shrink-0">
        <div>
          <span className="text-sm font-semibold text-gray-200">Environment Variables</span>
          <p className="text-xs text-gray-500 mt-0.5">
            URL · 헤더 · 바디에서{' '}
            <code className="text-indigo-400 font-mono">{'{{변수명}}'}</code> 으로 사용
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-200 text-xl leading-none transition-colors mt-0.5"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
        {variables.map((v) => (
          <div key={v.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={v.enabled}
              onChange={() => toggleVariable(v.id)}
              className="accent-indigo-500 shrink-0"
            />
            <input
              type="text"
              value={v.key}
              onChange={(e) => updateVariable(v.id, 'key', e.target.value.replace(/\s/g, ''))}
              placeholder="VARIABLE_NAME"
              className="w-40 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs font-mono
                text-indigo-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={v.value}
              onChange={(e) => updateVariable(v.id, 'value', e.target.value)}
              placeholder="value"
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs font-mono
                text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={() => removeVariable(v.id)}
              className="text-gray-600 hover:text-red-400 text-lg leading-none px-1 transition-colors shrink-0"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={addVariable}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          + 추가
        </button>

        {variables.length > 0 && (
          <div className="mt-6 p-3 bg-gray-900 rounded border border-gray-800 space-y-1">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
              사용 예시
            </p>
            <p className="text-xs font-mono text-gray-400">
              URL: https://
              <span className="text-indigo-400">{'{{BASE_URL}}'}</span>
              /api/users
            </p>
            <p className="text-xs font-mono text-gray-400">
              Authorization: Bearer{' '}
              <span className="text-indigo-400">{'{{TOKEN}}'}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
