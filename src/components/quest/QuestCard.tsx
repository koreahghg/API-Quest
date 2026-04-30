'use client'
import type { Scenario, ScenarioDifficulty } from '@/types'

const DIFFICULTY_LABEL: Record<ScenarioDifficulty, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
}

const DIFFICULTY_COLOR: Record<ScenarioDifficulty, string> = {
  beginner: 'text-emerald-400 bg-emerald-900/30',
  intermediate: 'text-amber-400 bg-amber-900/30',
  advanced: 'text-red-400 bg-red-900/30',
}

interface Props {
  scenario: Scenario
  isLocked: boolean
  onStart: (id: string) => void
}

export function QuestCard({ scenario, isLocked, onStart }: Props) {
  const completedCount = scenario.missions.filter((m) => m.status === 'completed').length
  const progress = completedCount / scenario.missions.length
  const isCompleted = completedCount === scenario.missions.length && scenario.missions.length > 0

  return (
    <div
      onClick={() => !isLocked && onStart(scenario.id)}
      className={`relative bg-gray-900 border rounded-2xl p-5 transition-all
        ${isLocked
          ? 'border-gray-800 opacity-50 cursor-not-allowed'
          : 'border-gray-700 hover:border-indigo-600/70 hover:bg-gray-800/50 cursor-pointer'
        }`}
    >
      <div className="absolute top-4 right-4">
        {isLocked ? (
          <span className="text-gray-600 text-lg">🔒</span>
        ) : isCompleted ? (
          <span className="text-xs text-emerald-400 font-semibold">완료 ✅</span>
        ) : null}
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${DIFFICULTY_COLOR[scenario.difficulty]}`}>
          {DIFFICULTY_LABEL[scenario.difficulty]}
        </span>
        {scenario.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>

      <h3 className="text-base font-bold text-white mb-1.5">{scenario.title}</h3>
      <p className="text-xs text-gray-400 leading-relaxed mb-4">{scenario.description}</p>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{scenario.missions.length}개 미션</span>
          <span>
            {completedCount > 0 ? `${completedCount}/${scenario.missions.length} 완료` : '시작 전'}
          </span>
        </div>
        <div className="bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {isLocked && (
        <p className="text-xs text-gray-600 mt-3">이전 퀘스트를 완료하면 해금됩니다.</p>
      )}
    </div>
  )
}
