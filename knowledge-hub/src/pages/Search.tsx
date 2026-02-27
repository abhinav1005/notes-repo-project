import { useState, useMemo } from "react"
import entries from "../Data/entries.json"
import EntryCard from "../components/EntryCard"
import type { Entry } from "../types/entry"

export default function Search() {
  const [query, setQuery] = useState("")
  const typedEntries = entries as Entry[]

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return typedEntries.filter(entry =>
      entry.title.toLowerCase().includes(q) ||
      entry.summary.toLowerCase().includes(q) ||
      entry.content.toLowerCase().includes(q) ||
      entry.tags.some(t => t.toLowerCase().includes(q))
    )
  }, [query, typedEntries])

  return (
    <div className="max-w-3xl mx-auto w-full py-8 px-4 md:px-6">
      <div className="relative mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search notes, papers, tags..."
          autoFocus
          className="w-full bg-slate-800/60 border border-slate-700 focus:border-slate-500
                     text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm
                     focus:outline-none transition backdrop-blur-sm"
        />
      </div>

      {query.trim() && results.length === 0 && (
        <p className="text-slate-500 text-sm">No entries found for "{query}"</p>
      )}

      {results.length > 0 && (
        <>
          <p className="text-slate-600 text-xs mb-4">{results.length} result{results.length !== 1 ? 's' : ''}</p>
          <div className="flex flex-col gap-3">
            {results.map(entry => (
              <EntryCard key={entry.entryId} entry={entry} viewMode="list" />
            ))}
          </div>
        </>
      )}

      {!query.trim() && (
        <p className="text-slate-600 text-sm">Start typing to search your knowledge base.</p>
      )}
    </div>
  )
}
