'use client'

type JsonPrimitive = string | number | boolean | null
type JsonObject = { [key: string]: JsonValue }
type JsonArray = JsonValue[]
type JsonValue = JsonPrimitive | JsonObject | JsonArray

function JsonNode({ value, depth = 0 }: { value: JsonValue; depth?: number }) {
  const pad = '  '.repeat(depth)
  const padInner = '  '.repeat(depth + 1)

  if (value === null) return <span className="text-red-400">null</span>

  if (typeof value === 'boolean') {
    return <span className="text-sky-400">{String(value)}</span>
  }

  if (typeof value === 'number') {
    return <span className="text-amber-400">{String(value)}</span>
  }

  if (typeof value === 'string') {
    const safe = value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
    return <span className="text-emerald-400">"{safe}"</span>
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-400">[]</span>
    return (
      <>
        {'[\n'}
        {value.map((item, i) => (
          <span key={i}>
            {padInner}
            <JsonNode value={item} depth={depth + 1} />
            {i < value.length - 1 ? ',' : ''}
            {'\n'}
          </span>
        ))}
        {pad}{']'}
      </>
    )
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, JsonValue>)
    if (entries.length === 0) return <span className="text-gray-400">{'{}'}</span>
    return (
      <>
        {'{\n'}
        {entries.map(([k, v], i) => (
          <span key={k}>
            {padInner}
            <span className="text-indigo-300">"{k}"</span>
            {': '}
            <JsonNode value={v} depth={depth + 1} />
            {i < entries.length - 1 ? ',' : ''}
            {'\n'}
          </span>
        ))}
        {pad}{'}'}
      </>
    )
  }

  return <>{String(value)}</>
}

export function JsonRenderer({ value }: { value: unknown }) {
  return (
    <pre className="p-4 text-xs font-mono text-gray-300 whitespace-pre-wrap break-all leading-5">
      <JsonNode value={value as JsonValue} />
    </pre>
  )
}
