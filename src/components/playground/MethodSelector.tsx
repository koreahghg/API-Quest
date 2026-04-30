'use client'
import { useRequestStore } from '@/stores'
import type { HttpMethod } from '@/types'

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'text-emerald-400',
  POST: 'text-sky-400',
  PUT: 'text-amber-400',
  PATCH: 'text-violet-400',
  DELETE: 'text-red-400',
}

export function MethodSelector() {
  const method = useRequestStore((s) => s.method)
  const setMethod = useRequestStore((s) => s.setMethod)

  return (
    <select
      value={method}
      onChange={(e) => setMethod(e.target.value as HttpMethod)}
      className={`bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm font-mono font-bold
        focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shrink-0
        ${METHOD_COLORS[method]}`}
    >
      {METHODS.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  )
}
