import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import mermaid from "mermaid"
import entries from "../Data/entries.json"
import type { Entry } from "../types/entry"

mermaid.initialize({ startOnLoad: false, theme: "dark" })

function MermaidDiagram({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const id = `mermaid-${Math.random().toString(36).slice(2)}`
    mermaid.render(id, code).then(({ svg }) => {
      if (ref.current) ref.current.innerHTML = svg
    })
  }, [code])
  return <div ref={ref} className="my-6 overflow-x-auto" />
}

const TYPE_COLORS: Record<string, string> = {
  note:       'text-blue-400',
  paper:      'text-violet-400',
  blog:       'text-emerald-400',
  discussion: 'text-amber-400',
  resource:   'text-rose-400',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })
}

export default function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const entry: Entry | undefined = (entries as Entry[]).find(e => e.entryId === id)

  if (!entry) return (
    <div className="max-w-3xl mx-auto p-8 text-slate-400">Entry not found.</div>
  )

  const typeColor = TYPE_COLORS[entry.type] ?? 'text-slate-400'

  return (
    <div className="max-w-3xl mx-auto w-full py-8 px-4 md:px-6">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-8 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wider ${typeColor}`}>
            {entry.type}
          </span>
          <span className="text-slate-400 text-xs">{formatDate(entry.createdAt)}</span>
        </div>
        <h1 className="text-2xl font-bold text-white leading-snug mb-4">{entry.title}</h1>
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map(tag => (
            <span key={tag} className="text-xs bg-slate-800 text-slate-300 border border-slate-600 px-2 py-0.5 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800 mb-8" />

      {/* Content */}
      <div className="space-y-1">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-8 mb-3">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-semibold text-white mt-6 mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-base font-medium text-slate-200 mt-5 mb-2">{children}</h3>,
            p: ({ children }) => <p className="text-slate-200 leading-relaxed mb-4 text-sm">{children}</p>,
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                {children}
              </a>
            ),
            strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
            em: ({ children }) => <em className="text-slate-200 italic">{children}</em>,
            ul: ({ children }) => <ul className="list-disc list-outside ml-5 text-slate-200 mb-4 space-y-1 text-sm">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-outside ml-5 text-slate-200 mb-4 space-y-1 text-sm">{children}</ol>,
            li: ({ children }) => <li className="text-slate-200 leading-relaxed">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-slate-500 pl-4 text-slate-300 italic my-4">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4 rounded-lg border border-slate-700">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border-b border-slate-700 px-4 py-2.5 text-slate-200 bg-slate-800/80 text-left font-medium text-xs uppercase tracking-wide">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border-b border-slate-800 px-4 py-2.5 text-slate-300 text-sm">{children}</td>
            ),
            pre: ({ children }) => (
              <pre className="bg-slate-900 border border-slate-700/80 rounded-lg p-4 overflow-x-auto mb-4 text-sm">
                {children}
              </pre>
            ),
            code({ className, children }) {
              const lang = /language-(\w+)/.exec(className || "")?.[1]
              if (lang === "mermaid") return <MermaidDiagram code={String(children).trim()} />
              if (className) return <code className="text-blue-300 font-mono">{children}</code>
              return (
                <code className="text-blue-300 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              )
            },
            hr: () => <hr className="border-slate-800 my-6" />,
          }}
        >
          {entry.content}
        </ReactMarkdown>
      </div>

      {entry.sourceUrl && (
        <div className="mt-8 pt-6 border-t border-slate-800">
          <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View source
          </a>
        </div>
      )}
    </div>
  )
}
