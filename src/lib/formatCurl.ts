import type { HttpRequest } from '@/types'

export function formatAsCurl(request: HttpRequest): string {
  const parts: string[] = ['curl']

  if (request.method !== 'GET') {
    parts.push(`-X ${request.method}`)
  }

  const sq = (s: string) => s.replace(/'/g, "'\\''")
  for (const h of request.headers.filter((h) => h.enabled && h.key)) {
    parts.push(`-H '${sq(h.key)}: ${sq(h.value)}'`)
  }

  const hasBody = request.method !== 'GET' && request.method !== 'DELETE'
  if (hasBody && request.body) {
    parts.push(`-d '${sq(request.body)}'`)
  }

  parts.push(`'${request.url}'`)

  return parts.join(' \\\n  ')
}
