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

const TYPE_COLORS: Record<string, string> = {
  note:       'text-blue-400',
  paper:      'text-violet-400',
  blog:       'text-emerald-400',
  discussion: 'text-amber-400',
  resource:   'text-rose-400',
}

export default function EntryCard({ entry, viewMode = 'grid' }: Props) {
  const typeColor = TYPE_COLORS[entry.type] ?? 'text-slate-400'

  if (viewMode === 'list') {
    return (
      <Link to={`/entry/${entry.entryId}`} className="block">
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/60
                        hover:border-slate-500/80 hover:bg-slate-800/80 p-4 transition-all duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-xs font-semibold uppercase tracking-wider ${typeColor}`}>
                  {entry.type}
                </span>
                {entry.sourceUrl && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                )}
              </div>
              <h2 className="text-white font-semibold text-sm leading-snug mb-1.5">{entry.title}</h2>
              <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">{entry.summary}</p>
            </div>
            <span className="text-slate-400 text-xs shrink-0 pt-0.5">{formatDate(entry.createdAt)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {entry.tags.map(tag => (
              <span key={tag} className="text-xs bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/entry/${entry.entryId}`} className="block h-full">
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/60
                      hover:border-slate-500/80 hover:bg-slate-800/80 p-4 transition-all duration-200
                      h-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold uppercase tracking-wider ${typeColor}`}>
              {entry.type}
            </span>
            {entry.sourceUrl && (
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            )}
          </div>
          <span className="text-slate-400 text-xs">{formatDate(entry.createdAt)}</span>
        </div>
        <h2 className="text-white font-semibold text-sm leading-snug">{entry.title}</h2>
        <p className="text-slate-300 text-xs leading-relaxed flex-1 line-clamp-3">{entry.summary}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {entry.tags.map(tag => (
            <span key={tag} className="text-xs bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
