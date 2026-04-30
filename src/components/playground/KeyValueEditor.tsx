'use client'
import type { KeyValuePair } from '@/types'

interface Props {
  pairs: KeyValuePair[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<Omit<KeyValuePair, 'id'>>) => void
  onRemove: (id: string) => void
  placeholder?: { key: string; value: string }
}

export function KeyValueEditor({ pairs, onAdd, onUpdate, onRemove, placeholder }: Props) {
  return (
    <div className="space-y-1.5">
      {pairs.map((pair) => (
        <div key={pair.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={pair.enabled}
            onChange={(e) => onUpdate(pair.id, { enabled: e.target.checked })}
            className="accent-indigo-500 shrink-0"
          />
          <input
            type="text"
            value={pair.key}
            onChange={(e) => onUpdate(pair.id, { key: e.target.value })}
            placeholder={placeholder?.key ?? 'Key'}
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs font-mono
              text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={pair.value}
            onChange={(e) => onUpdate(pair.id, { value: e.target.value })}
            placeholder={placeholder?.value ?? 'Value'}
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs font-mono
              text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={() => onRemove(pair.id)}
            className="text-gray-600 hover:text-red-400 text-lg leading-none px-1 transition-colors shrink-0"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        + 추가
      </button>
    </div>
  )
}
