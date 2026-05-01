'use client'
import { useScenarioStore } from '@/stores'
import { HintPanel } from './HintPanel'
import type { HttpMethod } from '@/types'

const METHOD_BADGE: Record<HttpMethod, string> = {
  GET: 'bg-emerald-900/40 text-emerald-400',
  POST: 'bg-sky-900/40 text-sky-400',
  PUT: 'bg-amber-900/40 text-amber-400',
  PATCH: 'bg-violet-900/40 text-violet-400',
  DELETE: 'bg-red-900/40 text-red-400',
}

export function MissionDetail() {
  const mission = useScenarioStore((s) => s.getActiveMission())

  if (!mission) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <p className="text-gray-600 text-sm">미션을 선택하세요</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${METHOD_BADGE[mission.targetMethod]}`}>
            {mission.targetMethod}
          </span>
          <code className="text-xs text-gray-500 font-mono break-all">{mission.targetEndpoint}</code>
        </div>
        <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
          {mission.description}
        </p>
      </div>

      {mission.attempts > 0 && (
        <p className="text-xs text-gray-600">{mission.attempts}회 시도</p>
      )}

      <HintPanel missionId={mission.id} hints={mission.hints} />
    </div>
  )
}
