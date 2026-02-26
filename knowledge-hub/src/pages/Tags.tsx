import { useState } from "react"
import entries from "../Data/entries.json"
import EntryCard from "../components/EntryCard"
import type { Entry } from "../types/entry"

export default function Tags() {
  const typedEntries = entries as Entry[]
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const tagCounts = typedEntries.reduce((acc, entry) => {
    entry.tags.forEach(tag => {
      acc[tag] = (acc[tag] ?? 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])

  const filteredEntries = selectedTag
    ? typedEntries.filter(e => e.tags.includes(selectedTag))
    : []

  return (
    <div className="w-full py-4 px-4 md:py-12 md:px-4">
      {sortedTags.length === 0 ? (
        <p className="text-gray-500 text-sm">No tags yet. Add some notes to get started.</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 mb-10">
            {sortedTags.map(([tag, count]) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                  selectedTag === tag
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-black/60 text-gray-300 border-gray-600 hover:border-blue-400"
                }`}
              >
                #{tag}
                <span className="ml-1.5 text-xs opacity-70">{count}</span>
              </button>
            ))}
          </div>

          {selectedTag && (
            <>
              <h2 className="text-white text-lg mb-4">
                Entries tagged{" "}
                <span className="text-blue-400">#{selectedTag}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredEntries.map(entry => (
                  <EntryCard key={entry.entryId} entry={entry} />
                ))}
              </div>
            </>
          )}

          {!selectedTag && (
            <p className="text-gray-500 text-sm">Select a tag to see related entries.</p>
          )}
        </>
      )}
    </div>
  )
}
