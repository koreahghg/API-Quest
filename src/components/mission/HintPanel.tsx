'use client'
import { useScenarioStore } from '@/stores'

interface Props {
  missionId: string
  hints: string[]
}

export function HintPanel({ missionId, hints }: Props) {
  const revealedCount = useScenarioStore((s) => s.getRevealedHintCount(missionId))
  const revealNextHint = useScenarioStore((s) => s.revealNextHint)

  if (hints.length === 0) return null

  const revealedHints = hints.slice(0, revealedCount)
  const hasMore = revealedCount < hints.length

  return (
    <div className="space-y-2">
      {revealedHints.map((hint, i) => (
        <div
          key={i}
          className="flex gap-2 text-xs text-amber-300/90 bg-amber-900/20 border border-amber-800/40 rounded-lg p-3 leading-relaxed"
        >
          <span className="shrink-0">💡</span>
          <span>{hint}</span>
        </div>
      ))}

      {hasMore && (
        <button
          onClick={() => revealNextHint(missionId)}
          className="text-xs text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1"
        >
          💡 힌트 보기 ({revealedCount}/{hints.length})
        </button>
      )}

      {!hasMore && revealedCount > 0 && (
        <p className="text-xs text-gray-600">모든 힌트가 공개됐습니다.</p>
      )}
    </div>
  )
}
