import { Link } from "react-router-dom"
import type { Entry } from "../types/entry"

export type { Entry }

type Props = {
  entry: Entry
  viewMode?: 'grid' | 'list'
}

export default function EntryCard({ entry, viewMode = 'grid' }: Props) {
  if (viewMode === 'list') {
    // List view - horizontal layout
    return (
      <Link to={`/entry/${entry.entryId}`} className="block">
        <div className="bg-black/60 rounded-xl shadow border-1 border-gray-200 hover:shadow-lg p-4 transition flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-sm text-blue-500 uppercase font-medium">
                {entry.type}
              </div>
              <h2 className="text-lg font-semibold text-white">
                {entry.title}
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              {entry.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {entry.tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Grid view - vertical layout with consistent height
  return (
    <Link to={`/entry/${entry.entryId}`} className="block h-full">
      <div className="bg-black/60 rounded-xl border-1 border-gray-300 shadow hover:shadow-lg p-4 transition h-full flex flex-col">
        <div className="text-sm text-blue-500 uppercase">{entry.type}</div>
        <h2 className="text-lg font-semibold text-white">{entry.title}</h2>
        <p className="text-gray-400 text-sm flex-1">{entry.summary}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {entry.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}