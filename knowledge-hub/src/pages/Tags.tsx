import { useState } from "react"
import entries from "../Data/entries.json"
import EntryCard from "../components/EntryCard"
import type { Entry } from "../types/entry"

export default function Tags() {
  const typedEntries = entries as Entry[]
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const tagCounts = typedEntries.reduce((acc, entry) => {
    entry.tags.forEach(tag => { acc[tag] = (acc[tag] ?? 0) + 1 })
    return acc
  }, {} as Record<string, number>)

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])
  const filteredEntries = selectedTag ? typedEntries.filter(e => e.tags.includes(selectedTag)) : []

  return (
    <div className="max-w-6xl mx-auto w-full py-8 px-4 md:px-6">
      {sortedTags.length === 0 ? (
        <p className="text-slate-500 text-sm">No tags yet. Add some notes to get started.</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-10">
            {sortedTags.map(([tag, count]) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  selectedTag === tag
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/50'
                    : 'text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'
                }`}
              >
                #{tag}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            ))}
          </div>

          {selectedTag ? (
            <>
              <p className="text-slate-500 text-xs mb-4">
                {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} tagged{' '}
                <span className="text-slate-300">#{selectedTag}</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEntries.map(entry => (
                  <EntryCard key={entry.entryId} entry={entry} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-slate-600 text-sm">Select a tag to see related entries.</p>
          )}
        </>
      )}
    </div>
  )
}
