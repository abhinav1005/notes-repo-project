import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import entries from "../Data/entries.json"
import type { Entry } from "../types/entry"

type Props = {
  onClose: () => void
}

const typedEntries = entries as Entry[]

const TYPE_COLORS: Record<string, string> = {
  note:       'text-blue-400',
  paper:      'text-violet-400',
  blog:       'text-emerald-400',
  discussion: 'text-amber-400',
  resource:   'text-rose-400',
}

export default function SearchModal({ onClose }: Props) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const results = query.trim().length === 0
    ? []
    : typedEntries.filter(e => {
        const q = query.toLowerCase()
        return (
          e.title.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          e.tags.some(t => t.toLowerCase().includes(q))
        )
      }).slice(0, 8)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => { setSelectedIndex(0) }, [query])

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      }
      if (e.key === "Enter" && results[selectedIndex]) {
        navigate(`/entry/${results[selectedIndex].entryId}`)
        onClose()
      }
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [results, selectedIndex, navigate, onClose])

  return (
    <div
      id="cmd-k-modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl mx-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 shrink-0">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search notes…"
            className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 outline-none"
          />
          <kbd className="text-xs text-slate-600 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded font-mono">
            esc
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="py-2 max-h-80 overflow-y-auto">
            {results.map((entry, i) => (
              <li key={entry.entryId}>
                <button
                  onClick={() => { navigate(`/entry/${entry.entryId}`); onClose() }}
                  className={`w-full text-left px-4 py-2.5 transition-colors ${
                    i === selectedIndex ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${TYPE_COLORS[entry.type] ?? 'text-slate-400'}`}>
                      {entry.type}
                    </span>
                  </div>
                  <p className="text-sm text-white font-medium leading-snug">{entry.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{entry.summary}</p>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* No results */}
        {query.trim().length > 0 && results.length === 0 && (
          <div className="px-4 py-8 text-center text-slate-500 text-sm">
            No results for &ldquo;{query}&rdquo;
          </div>
        )}

        {/* Footer hint (shown when input is empty) */}
        {query.trim().length === 0 && (
          <div className="px-4 py-2.5 text-xs text-slate-600 border-t border-slate-800 flex gap-4">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> open</span>
            <span><kbd className="font-mono">esc</kbd> close</span>
          </div>
        )}
      </div>
    </div>
  )
}
