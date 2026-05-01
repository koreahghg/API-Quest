'use client'
import { useState } from 'react'
import { useRequestStore } from '@/stores'
import { KeyValueEditor } from './KeyValueEditor'

type Tab = 'headers' | 'params' | 'body'

export function RequestTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('headers')

  const method = useRequestStore((s) => s.method)
  const headers = useRequestStore((s) => s.headers)
  const queryParams = useRequestStore((s) => s.queryParams)
  const body = useRequestStore((s) => s.body)
  const addHeader = useRequestStore((s) => s.addHeader)
  const updateHeader = useRequestStore((s) => s.updateHeader)
  const removeHeader = useRequestStore((s) => s.removeHeader)
  const addQueryParam = useRequestStore((s) => s.addQueryParam)
  const updateQueryParam = useRequestStore((s) => s.updateQueryParam)
  const removeQueryParam = useRequestStore((s) => s.removeQueryParam)
  const setBody = useRequestStore((s) => s.setBody)

  const bodyDisabled = method === 'GET' || method === 'DELETE'

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'headers', label: 'Headers', count: headers.length },
    { id: 'params', label: 'Params', count: queryParams.length },
    { id: 'body', label: 'Body' },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-800 px-3 shrink-0">
        {tabs.map((tab) => {
          const disabled = tab.id === 'body' && bodyDisabled
          return (
            <button
              key={tab.id}
              onClick={() => !disabled && setActiveTab(tab.id)}
              disabled={disabled}
              className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
                }
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 text-gray-600">{tab.count}</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        {activeTab === 'headers' && (
          <KeyValueEditor
            pairs={headers}
            onAdd={addHeader}
            onUpdate={updateHeader}
            onRemove={removeHeader}
            placeholder={{ key: 'Authorization', value: 'Bearer token...' }}
          />
        )}
        {activeTab === 'params' && (
          <KeyValueEditor
            pairs={queryParams}
            onAdd={addQueryParam}
            onUpdate={updateQueryParam}
            onRemove={removeQueryParam}
            placeholder={{ key: 'key', value: 'value' }}
          />
        )}
        {activeTab === 'body' && !bodyDisabled && (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={'{\n  "key": "value"\n}'}
            spellCheck={false}
            className="w-full h-full min-h-24 bg-gray-800 border border-gray-700 rounded px-3 py-2
              text-xs font-mono text-gray-200 placeholder-gray-600
              focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          />
        )}
      </div>
    </div>
  )
}
