import { useState, useMemo } from "react"
import entries from "../Data/entries.json"
import EntryCard from "../components/EntryCard"
import type { Entry } from "../types/entry"

const ALL_TYPES = ["all", "note", "paper", "blog", "discussion", "resource"] as const
type TypeFilter = typeof ALL_TYPES[number]

const PAGE_SIZE = 12

export default function Home() {
  const typedEntries = entries as Entry[]
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeType, setActiveType] = useState<TypeFilter>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    if (activeType === 'all') return typedEntries
    return typedEntries.filter(e => e.type === activeType)
  }, [typedEntries, activeType])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  function handleTypeChange(type: TypeFilter) {
    setActiveType(type)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="w-full py-4 px-4 md:py-12 md:px-4">

      {/* Controls row — type filter left, view toggle right */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">

        {/* Type filter pills */}
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map(type => {
            const count = type === 'all'
              ? typedEntries.length
              : typedEntries.filter(e => e.type === type).length
            if (type !== 'all' && count === 0) return null
            return (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition border ${
                  activeType === type
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-black/60 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                }`}
              >
                {type === 'all' ? 'All' : type}
                <span className={`ml-1.5 ${activeType === type ? 'opacity-80' : 'opacity-50'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-black/60 border border-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-md transition ${
              viewMode === 'grid'
                ? 'bg-gray-700 text-white'
                : 'text-gray-500 hover:text-white'
            }`}
            aria-label="Grid view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md transition ${
              viewMode === 'list'
                ? 'bg-gray-700 text-white'
                : 'text-gray-500 hover:text-white'
            }`}
            aria-label="List view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Entry count */}
      <p className="text-gray-600 text-xs mb-4">
        {filtered.length === 0
          ? 'No entries'
          : `Showing ${visible.length} of ${filtered.length} ${activeType === 'all' ? 'entries' : activeType + 's'}`
        }
      </p>

      {/* Cards */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No entries of this type yet.</p>
      ) : (
        <>
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }>
            {visible.map(entry => (
              <EntryCard key={entry.entryId} entry={entry} viewMode={viewMode} />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex flex-col items-center mt-10 gap-2">
              <button
                onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                className="px-6 py-2.5 bg-black/60 border border-gray-700 hover:border-gray-500
                           text-gray-300 hover:text-white text-sm rounded-xl transition"
              >
                Load more
              </button>
              <span className="text-gray-600 text-xs">
                {filtered.length - visibleCount} more
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
