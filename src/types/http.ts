export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface KeyValuePair {
  id: string
  key: string
  value: string
  enabled: boolean
}

export type Header = KeyValuePair
export type QueryParam = KeyValuePair

export interface HttpRequest {
  method: HttpMethod
  url: string
  headers: Header[]
  queryParams: QueryParam[]
  body: string
}

export interface HttpResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  body: unknown
  bodyRaw: string
  duration: number
  timestamp: number
  size: number
}
