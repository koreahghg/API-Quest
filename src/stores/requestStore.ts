import { create } from 'zustand'
import type { HttpMethod, Header, QueryParam, HttpRequest } from '@/types'

interface RequestState {
  method: HttpMethod
  url: string
  headers: Header[]
  queryParams: QueryParam[]
  body: string

  setMethod: (method: HttpMethod) => void
  setUrl: (url: string) => void
  setBody: (body: string) => void

  addHeader: () => void
  updateHeader: (id: string, patch: Partial<Omit<Header, 'id'>>) => void
  removeHeader: (id: string) => void

  addQueryParam: () => void
  updateQueryParam: (id: string, patch: Partial<Omit<QueryParam, 'id'>>) => void
  removeQueryParam: (id: string) => void

  reset: () => void
  toHttpRequest: () => HttpRequest
}

const getInitialState = () => ({
  method: 'GET' as HttpMethod,
  url: '',
  headers: [
    {
      id: crypto.randomUUID(),
      key: 'Content-Type',
      value: 'application/json',
      enabled: true,
    },
  ] satisfies Header[],
  queryParams: [] as QueryParam[],
  body: '',
})

export const useRequestStore = create<RequestState>((set, get) => ({
  ...getInitialState(),

  setMethod: (method) => set({ method }),
  setUrl: (url) => set({ url }),
  setBody: (body) => set({ body }),

  addHeader: () =>
    set((s) => ({
      headers: [...s.headers, { id: crypto.randomUUID(), key: '', value: '', enabled: true }],
    })),

  updateHeader: (id, patch) =>
    set((s) => ({
      headers: s.headers.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    })),

  removeHeader: (id) =>
    set((s) => ({ headers: s.headers.filter((h) => h.id !== id) })),

  addQueryParam: () =>
    set((s) => ({
      queryParams: [
        ...s.queryParams,
        { id: crypto.randomUUID(), key: '', value: '', enabled: true },
      ],
    })),

  updateQueryParam: (id, patch) =>
    set((s) => ({
      queryParams: s.queryParams.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),

  removeQueryParam: (id) =>
    set((s) => ({ queryParams: s.queryParams.filter((p) => p.id !== id) })),

  reset: () => set(getInitialState()),

  toHttpRequest: () => {
    const { method, url, headers, queryParams, body } = get()
    const enabledParams = queryParams.filter((p) => p.enabled && p.key)
    const resolvedUrl =
      enabledParams.length > 0
        ? `${url}${url.includes('?') ? '&' : '?'}${new URLSearchParams(
            enabledParams.map(({ key, value }) => [key, value]),
          )}`
        : url
    return { method, url: resolvedUrl, headers, queryParams, body }
  },
}))
