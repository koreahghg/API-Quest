'use client'
import { useScenarioStore } from '@/stores'
import type { Mission, MissionStatus } from '@/types'

const STATUS_ICON: Record<MissionStatus, string> = {
  completed: '✅',
  active: '●',
  failed: '✗',
  locked: '🔒',
}

interface Props {
  missions: Mission[]
}

export function MissionList({ missions }: Props) {
  const activeMissionId = useScenarioStore((s) => s.activeMissionId)
  const setActiveMission = useScenarioStore((s) => s.setActiveMission)

  return (
    <div className="space-y-0.5">
      {missions.map((mission) => {
        const isSelected = mission.id === activeMissionId
        const isClickable = mission.status !== 'locked'

        return (
          <button
            key={mission.id}
            onClick={() => isClickable && setActiveMission(mission.id)}
            disabled={!isClickable}
            className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors
              ${isSelected ? 'bg-indigo-900/40 text-white' : ''}
              ${!isSelected && isClickable ? 'hover:bg-gray-800 text-gray-300' : ''}
              ${mission.status === 'locked' ? 'text-gray-600 cursor-not-allowed' : ''}`}
          >
            <span className="text-sm shrink-0 w-5 text-center">
              {STATUS_ICON[mission.status]}
            </span>
            <span className="truncate">{mission.title}</span>
          </button>
        )
      })}
    </div>
  )
}
