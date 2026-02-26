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
    return typedEntries.filter(
      entry =>
        entry.title.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.content.toLowerCase().includes(q) ||
        entry.tags.some(t => t.toLowerCase().includes(q))
    )
  }, [query, typedEntries])

  return (
    <div className="w-full py-4 px-4 md:py-12 md:px-4 max-w-4xl mx-auto">
      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search notes, papers, tags..."
          autoFocus
          className="w-full bg-black/60 border border-gray-600 text-white placeholder-gray-500
                     rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      {query.trim() && results.length === 0 && (
        <p className="text-gray-500 text-sm">No entries found for "{query}"</p>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-4">
          {results.map(entry => (
            <EntryCard key={entry.entryId} entry={entry} viewMode="list" />
          ))}
        </div>
      )}

      {!query.trim() && (
        <p className="text-gray-500 text-sm">Start typing to search your knowledge base.</p>
      )}
    </div>
  )
}
