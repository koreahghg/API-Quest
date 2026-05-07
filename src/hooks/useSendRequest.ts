'use client'
import { useRequestStore, useResponseStore, useEvaluationStore, useScenarioStore, useHistoryStore, useEnvStore } from '@/stores'
import { interpolate } from '@/lib/interpolate'
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
  const addEntry = useHistoryStore((s) => s.addEntry)
  const getVariableMap = useEnvStore((s) => s.getVariableMap)

  const send = async () => {
    const request = toHttpRequest()
    const variables = getVariableMap()

    // 환경 변수를 치환한 값으로 실제 HTTP 요청 수행
    const resolvedUrl = interpolate(request.url, variables)
    const resolvedHeaders = request.headers.map((h) => ({
      ...h,
      value: interpolate(h.value, variables),
    }))
    const resolvedQueryParams = request.queryParams.map((p) => ({
      ...p,
      value: interpolate(p.value, variables),
    }))
    const resolvedBody = request.body ? interpolate(request.body, variables) : request.body

    try {
      new URL(resolvedUrl)
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
      const headers: Record<string, string> = Object.create(null)
      resolvedHeaders
        .filter((h) => h.enabled && h.key)
        .forEach((h) => { headers[h.key] = h.value })

      const fetchOptions: RequestInit = { method: request.method, headers }
      const hasBody = request.method !== 'GET' && request.method !== 'DELETE'
      if (hasBody && resolvedBody) {
        fetchOptions.body = resolvedBody
      }

      const res = await fetch(resolvedUrl, fetchOptions)
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
      // 히스토리에는 원본 요청(변수명 그대로) 저장
      addEntry({ request, response, error: null, timestamp: Date.now() })

      const mission = getActiveMission()
      if (mission && mission.status === 'active') {
        // 미션 평가는 실제로 전송된 값(치환 후)으로 수행
        const resolvedRequest = { ...request, url: resolvedUrl, headers: resolvedHeaders, queryParams: resolvedQueryParams, body: resolvedBody }
        const evaluation = evaluate(mission, resolvedRequest, response)
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

      const apiError = { kind, message, hint: STATUS_HINTS[kind] } as const
      setError(apiError)
      addEntry({ request, response: null, error: apiError, timestamp: Date.now() })
    }
  }

  return { send }
}
