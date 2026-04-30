'use client'
import { useRequestStore, useResponseStore, useEvaluationStore, useScenarioStore } from '@/stores'
import { STATUS_HINTS } from '@/constants/statusHints'
import type { HttpResponse } from '@/types'

export function useSendRequest() {
  const toHttpRequest = useRequestStore((s) => s.toHttpRequest)
  const setLoading = useResponseStore((s) => s.setLoading)
  const setSuccess = useResponseStore((s) => s.setSuccess)
  const setError = useResponseStore((s) => s.setError)
  const evaluate = useEvaluationStore((s) => s.evaluate)
  const resetEvaluation = useEvaluationStore((s) => s.reset)
  const getActiveMission = useScenarioStore((s) => s.getActiveMission)
  const incrementAttempts = useScenarioStore((s) => s.incrementAttempts)
  const completeMission = useScenarioStore((s) => s.completeMission)
  const revealNextHint = useScenarioStore((s) => s.revealNextHint)

  const send = async () => {
    const request = toHttpRequest()

    try {
      new URL(request.url)
    } catch {
      setError({
        kind: 'invalid_url',
        message: 'URL 형식이 올바르지 않습니다.',
        hint: STATUS_HINTS['invalid_url'],
      })
      return
    }

    setLoading()
    resetEvaluation()

    const startTime = Date.now()

    try {
      const headers: Record<string, string> = {}
      request.headers
        .filter((h) => h.enabled && h.key)
        .forEach((h) => { headers[h.key] = h.value })

      const fetchOptions: RequestInit = { method: request.method, headers }
      const hasBody = request.method !== 'GET' && request.method !== 'DELETE'
      if (hasBody && request.body) {
        fetchOptions.body = request.body
      }

      const res = await fetch(request.url, fetchOptions)
      const duration = Date.now() - startTime

      const responseHeaders: Record<string, string> = {}
      res.headers.forEach((value, key) => { responseHeaders[key] = value })

      const bodyRaw = await res.text()
      let body: unknown = bodyRaw
      try {
        body = JSON.parse(bodyRaw)
      } catch {
        // non-JSON 응답은 raw string으로 처리
      }

      const response: HttpResponse = {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body,
        bodyRaw,
        duration,
        timestamp: Date.now(),
        size: new TextEncoder().encode(bodyRaw).length,
      }

      setSuccess(response)

      const mission = getActiveMission()
      if (mission && mission.status === 'active') {
        const evaluation = evaluate(mission, request, response)
        incrementAttempts(mission.id)
        if (evaluation.passed) {
          completeMission(mission.id)
        } else {
          revealNextHint(mission.id)
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류'
      const isCors =
        message.includes('Failed to fetch') ||
        message.toLowerCase().includes('cors') ||
        message.toLowerCase().includes('network')
      const kind = isCors ? 'cors' : 'network'

      setError({
        kind,
        message,
        hint: STATUS_HINTS[kind],
      })
    }
  }

  return { send }
}
