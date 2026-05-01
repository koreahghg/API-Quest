'use client'
import { useEffect } from 'react'
import { useScenarioStore, useEvaluationStore, useUiStore } from '@/stores'
import { QuestSelector } from '@/components/quest/QuestSelector'
import { MissionSidebar } from '@/components/mission/MissionSidebar'
import { PlaygroundPanel } from '@/components/playground/PlaygroundPanel'
import { MissionResult } from '@/components/mission/MissionResult'
import { INITIAL_SCENARIOS } from '@/data/scenarios'

export default function Home() {
  const view = useUiStore((s) => s.view)
  const setView = useUiStore((s) => s.setView)

  const scenarios = useScenarioStore((s) => s.scenarios)
  const setScenarios = useScenarioStore((s) => s.setScenarios)
  const setActiveScenario = useScenarioStore((s) => s.setActiveScenario)
  const setActiveMission = useScenarioStore((s) => s.setActiveMission)
  const getActiveScenario = useScenarioStore((s) => s.getActiveScenario)

  const evaluationStatus = useEvaluationStore((s) => s.status)
  const resetEvaluation = useEvaluationStore((s) => s.reset)

  useEffect(() => {
    setScenarios(INITIAL_SCENARIOS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStart = (scenarioId: string) => {
    setActiveScenario(scenarioId)
    setView('mission')
  }

  const handleBack = () => {
    resetEvaluation()
    setView('home')
  }

  const handleNextMission = () => {
    resetEvaluation()
    const scenario = getActiveScenario()
    if (!scenario) return
    const nextActive = scenario.missions.find((m) => m.status === 'active')
    if (nextActive) {
      setActiveMission(nextActive.id)
    } else {
      setView('home')
    }
  }

  const handleRetry = () => {
    resetEvaluation()
  }

  const showResultModal = evaluationStatus === 'pass' || evaluationStatus === 'fail'

  if (view === 'home') {
    return <QuestSelector scenarios={scenarios} onStart={handleStart} />
  }

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <div className="w-80 shrink-0">
        <MissionSidebar onBack={handleBack} />
      </div>
      <div className="flex-1 min-w-0">
        <PlaygroundPanel />
      </div>
      {showResultModal && (
        <MissionResult onNext={handleNextMission} onRetry={handleRetry} />
      )}
    </div>
  )
}
