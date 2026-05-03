'use client'
import { useState } from 'react'
import { UrlBar } from './UrlBar'
import { RequestTabs } from './RequestTabs'
import { ResponseViewer } from './ResponseViewer'
import { HistoryPanel } from './HistoryPanel'

export function PlaygroundPanel() {
  const [showHistory, setShowHistory] = useState(false)

  return (
    <div className="flex flex-col h-full bg-gray-950 relative">
      <UrlBar onShowHistory={() => setShowHistory(true)} />
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="h-1/2 min-h-0 flex flex-col border-b border-gray-800">
          <RequestTabs />
        </div>
        <div className="h-1/2 min-h-0 flex flex-col">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-800 shrink-0">
            Response
          </div>
          <ResponseViewer />
        </div>
      </div>
      {showHistory && <HistoryPanel onClose={() => setShowHistory(false)} />}
    </div>
  )
}
