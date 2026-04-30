'use client'
import { useEvaluationStore, useScenarioStore } from '@/stores'
import type { ConditionResult } from '@/types'

interface Props {
  onNext: () => void
  onRetry: () => void
}

function ConditionRow({ result }: { result: ConditionResult }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 text-xs py-1.5 px-3 rounded-lg
        ${result.passed ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-red-900/20 border border-red-800/30'}`}
    >
      <span className="font-mono text-gray-400">{result.type}</span>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-gray-500">
          기대: <span className="text-gray-300 font-mono">{String(result.expected)}</span>
        </span>
        {!result.passed && (
          <span className="text-gray-500">
            실제: <span className="text-red-400 font-mono">{String(result.actual ?? '없음')}</span>
          </span>
        )}
        <span>{result.passed ? '✅' : '❌'}</span>
      </div>
    </div>
  )
}

export function MissionResult({ onNext, onRetry }: Props) {
  const evaluationStatus = useEvaluationStore((s) => s.status)
  const evaluation = useEvaluationStore((s) => s.evaluation)
  const activeMission = useScenarioStore((s) => s.getActiveMission())
  const revealedCount = useScenarioStore((s) =>
    activeMission ? s.getRevealedHintCount(activeMission.id) : 0,
  )

  if (evaluationStatus === 'idle' || !evaluation) return null

  const passed = evaluationStatus === 'pass'
  const attempts = activeMission?.attempts ?? 0
  const newHint =
    !passed && activeMission && revealedCount > 0
      ? activeMission.hints[revealedCount - 1]
      : null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">{passed ? '🎉' : '❌'}</div>
          <h3
            className={`text-lg font-bold ${passed ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {passed ? '미션 완료!' : '아직 조건이 부족해요'}
          </h3>
          {passed && attempts > 0 && (
            <p className="text-gray-500 text-sm mt-1">{attempts}회 시도 만에 성공!</p>
          )}
        </div>

        <div className="space-y-1.5 mb-4">
          {evaluation.conditionResults.map((result, i) => (
            <ConditionRow key={i} result={result} />
          ))}
        </div>

        {newHint && (
          <div className="flex gap-2 text-xs text-amber-300/90 bg-amber-900/20 border border-amber-800/40 rounded-lg p-3 mb-4 leading-relaxed">
            <span className="shrink-0">💡</span>
            <span>{newHint}</span>
          </div>
        )}

        {passed ? (
          <button
            onClick={onNext}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-colors"
          >
            다음 미션 →
          </button>
        ) : (
          <button
            onClick={onRetry}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl text-sm transition-colors"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  )
}
