import { useState } from "react"
import entries from "../Data/entries.json"
import EntryCard from "../components/EntryCard"
import type { Entry } from "../types/entry"

export default function Home() {
  const typedEntries: Entry[] = entries as Entry[]
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="w-full py-4 px-4 md:py-12 md:px-4">
      {/* View Toggle Section */}
      <div className="flex justify-end mb-8 md:mb-8 md:pb-8">
        <div className="flex items-center gap-2 bg-black dark:bg-gray-800 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-md font-medium transition ${
              viewMode === 'grid'
                ? 'bg-gray-700 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            aria-label="Grid view"
          >
            {/* Grid icon */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
          
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md font-medium transition ${
              viewMode === 'list'
                ? 'bg-gray-700 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            aria-label="List view"
          >
            {/* List icon */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Entry Cards - Grid or List */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'
          : 'flex flex-col gap-4'
      }>
        {typedEntries.map(entry => (
          <EntryCard key={entry.entryId} entry={entry} viewMode={viewMode} />
        ))}
      </div>
    </div>
  )
}