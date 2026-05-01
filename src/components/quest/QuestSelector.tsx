'use client'
import { useMemo } from 'react'
import type { Scenario } from '@/types'
import { QuestCard } from './QuestCard'

interface Props {
  scenarios: Scenario[]
  onStart: (id: string) => void
}

export function QuestSelector({ scenarios, onStart }: Props) {
  const sorted = useMemo(
    () => [...scenarios].sort((a, b) => a.order - b.order),
    [scenarios],
  )

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">🗺️ API Quest</h1>
          <p className="text-gray-400 text-sm">
            틀려야 배운다. HTTP를 직접 경험으로 익히세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((scenario, i) => {
            const prevCompleted =
              i === 0 || sorted[i - 1].missions.every((m) => m.status === 'completed')
            return (
              <QuestCard
                key={scenario.id}
                scenario={scenario}
                isLocked={!prevCompleted}
                onStart={onStart}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
