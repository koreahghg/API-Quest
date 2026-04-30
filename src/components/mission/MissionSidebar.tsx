'use client'
import { useScenarioStore } from '@/stores'
import { MissionList } from './MissionList'
import { MissionDetail } from './MissionDetail'

interface Props {
  onBack: () => void
}

export function MissionSidebar({ onBack }: Props) {
  const scenario = useScenarioStore((s) => s.getActiveScenario())

  if (!scenario) return null

  const completedCount = scenario.missions.filter((m) => m.status === 'completed').length
  const progress = completedCount / scenario.missions.length

  return (
    <div className="flex flex-col h-full border-r border-gray-800 bg-gray-950">
      <div className="p-4 border-b border-gray-800 shrink-0">
        <button
          onClick={onBack}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors mb-3 flex items-center gap-1"
        >
          ← 퀘스트 목록
        </button>
        <h2 className="text-sm font-bold text-white">{scenario.title}</h2>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 shrink-0">
            {completedCount}/{scenario.missions.length}
          </span>
        </div>
      </div>

      <div className="p-2 border-b border-gray-800 shrink-0">
        <MissionList missions={scenario.missions} />
      </div>

      <MissionDetail />
    </div>
  )
}
