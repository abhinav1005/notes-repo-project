import { useState, useMemo, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import entries from "../Data/entries.json"
import EntryCard from "../components/EntryCard"
import type { Entry } from "../types/entry"

const ALL_TYPES = ["all", "note", "paper", "blog", "discussion", "resource"] as const
type TypeFilter = typeof ALL_TYPES[number]

const PAGE_SIZE = 12

type Props = { isSearchOpen: boolean }

export default function Home({ isSearchOpen }: Props) {
  const typedEntries = entries as Entry[]
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeType, setActiveType] = useState<TypeFilter>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const gridRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (activeType === 'all') return typedEntries
    return typedEntries.filter(e => e.type === activeType)
  }, [typedEntries, activeType])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  function handleTypeChange(type: TypeFilter) {
    setActiveType(type)
    setVisibleCount(PAGE_SIZE)
    setFocusedIndex(-1)
  }

  // Arrow key + Enter keyboard navigation
  useEffect(() => {
    function getColCount(): number {
      if (viewMode === 'list' || !gridRef.current) return 1
      const cols = getComputedStyle(gridRef.current).gridTemplateColumns
      return cols.split(' ').filter(Boolean).length
    }

    function handle(e: KeyboardEvent) {
      if (isSearchOpen) return
      const inInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      if (inInput) return

      const cols = getColCount()
      const last = visible.length - 1

      if (e.key === 'ArrowRight' && viewMode === 'grid') {
        e.preventDefault()
        setFocusedIndex(i => i < 0 ? 0 : Math.min(i + 1, last))
      }
      if (e.key === 'ArrowLeft' && viewMode === 'grid') {
        e.preventDefault()
        setFocusedIndex(i => Math.max(i - 1, 0))
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex(i => {
          if (i < 0) return 0
          return Math.min(i + cols, last)
        })
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex(i => Math.max(i - cols, 0))
      }
      if (e.key === 'Enter' && focusedIndex >= 0 && visible[focusedIndex]) {
        navigate(`/entry/${visible[focusedIndex].entryId}`)
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [isSearchOpen, focusedIndex, visible, viewMode, navigate])

  // Reset focus when filter changes
  useEffect(() => { setFocusedIndex(-1) }, [activeType])

  // Scroll focused card into view
  useEffect(() => {
    if (focusedIndex < 0) return
    const el = gridRef.current?.children[focusedIndex] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [focusedIndex])

  return (
    <div className="max-w-6xl mx-auto w-full py-8 px-4 md:px-6">

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">

        {/* Type filter */}
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
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                  activeType === type
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/50'
                    : 'text-slate-500 border-slate-700 hover:border-slate-500 hover:text-slate-300'
                }`}
              >
                {type === 'all' ? 'All' : type}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            )
          })}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-slate-800/60 border border-slate-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1.5 rounded-md transition ${
              viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
            aria-label="Grid view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1.5 rounded-md transition ${
              viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
            aria-label="List view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Count + shortcut hint */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-slate-600 text-xs">
          {filtered.length === 0 ? 'No entries' : `${visible.length} of ${filtered.length} entries`}
        </p>
        {focusedIndex >= 0 && (
          <p className="text-slate-600 text-xs font-mono">
            {focusedIndex + 1} / {visible.length} &nbsp;↵ open
          </p>
        )}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <p className="text-slate-500 text-sm">No entries of this type yet.</p>
      ) : (
        <>
          <div
            ref={gridRef}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'flex flex-col gap-3'
            }
          >
            {visible.map((entry, i) => (
              <div
                key={entry.entryId}
                className={`rounded-xl transition-all duration-150 ${
                  focusedIndex === i
                    ? 'ring-2 ring-blue-500/60 ring-offset-2 ring-offset-[#0d1117]'
                    : ''
                }`}
                onMouseEnter={() => setFocusedIndex(i)}
              >
                <EntryCard entry={entry} viewMode={viewMode} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex flex-col items-center mt-10 gap-2">
              <button
                onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                className="px-5 py-2 bg-slate-800/60 border border-slate-700 hover:border-slate-500
                           text-slate-400 hover:text-white text-sm rounded-xl transition-all"
              >
                Load more
              </button>
              <span className="text-slate-600 text-xs">{filtered.length - visibleCount} more</span>
            </div>
          )}
        </>
      )}

      {/* Keyboard hint */}
      <p className="text-slate-700 text-xs text-center mt-10">
        <kbd className="font-mono">↑↓←→</kbd> to navigate &nbsp;·&nbsp;
        <kbd className="font-mono">⌘K</kbd> to search &nbsp;·&nbsp;
        <kbd className="font-mono">?</kbd> for shortcuts
      </p>
    </div>
  )
}
