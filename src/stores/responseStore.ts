import { create } from 'zustand'
import type { HttpResponse, ApiError } from '@/types'

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

interface ResponseState {
  status: RequestStatus
  response: HttpResponse | null
  error: ApiError | null

  setLoading: () => void
  setSuccess: (response: HttpResponse) => void
  setError: (error: ApiError) => void
  reset: () => void
}

export const useResponseStore = create<ResponseState>((set) => ({
  status: 'idle',
  response: null,
  error: null,

  setLoading: () => set({ status: 'loading', response: null, error: null }),
  setSuccess: (response) => set({ status: 'success', response, error: null }),
  setError: (error) => set({ status: 'error', error, response: null }),
  reset: () => set({ status: 'idle', response: null, error: null }),
}))
