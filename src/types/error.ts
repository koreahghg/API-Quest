import type { StatusHint } from './hint'

export type ErrorKind = 'network' | 'cors' | 'http' | 'parse' | 'invalid_url'

export interface ApiError {
  kind: ErrorKind
  status?: number
  message: string
  hint: StatusHint
}
