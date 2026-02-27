import { Link } from "react-router-dom"
import type { Entry } from "../types/entry"

export type { Entry }

type Props = {
  entry: Entry
  viewMode?: 'grid' | 'list'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

export default function EntryCard({ entry, viewMode = 'grid' }: Props) {
  if (viewMode === 'list') {
    return (
      <Link to={`/entry/${entry.entryId}`} className="block">
        <div className="bg-black/60 rounded-xl shadow border border-gray-700 hover:border-gray-500 p-4 transition flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <span className="text-xs text-blue-500 uppercase font-medium tracking-wide">
                {entry.type}
              </span>
              <h2 className="text-base font-semibold text-white leading-snug">
                {entry.title}
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-3 leading-relaxed">
              {entry.summary}
            </p>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex flex-wrap gap-2">
                {entry.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-600 shrink-0">
                {formatDate(entry.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/entry/${entry.entryId}`} className="block h-full">
      <div className="bg-black/60 rounded-xl border border-gray-700 hover:border-gray-500 shadow p-4 transition h-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-blue-500 uppercase font-medium tracking-wide">
            {entry.type}
          </span>
          <span className="text-xs text-gray-600">
            {formatDate(entry.createdAt)}
          </span>
        </div>
        <h2 className="text-base font-semibold text-white leading-snug">{entry.title}</h2>
        <p className="text-gray-400 text-sm flex-1 leading-relaxed">{entry.summary}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {entry.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
