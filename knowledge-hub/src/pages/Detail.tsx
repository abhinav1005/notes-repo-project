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

  return <div ref={ref} className="my-4 overflow-x-auto" />
}

export default function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const entry: Entry | undefined = (entries as Entry[]).find(e => e.entryId === id)

  if (!entry) return <div className="p-6 text-white">Entry not found</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-200 hover:text-gray-400 mb-6 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to all entries
      </button>

      {/* Entry Header */}
      <div className="text-blue-500 uppercase text-sm font-medium mb-1">{entry.type}</div>
      <h1 className="text-3xl font-bold text-white mb-4">{entry.title}</h1>
      <div className="flex flex-wrap gap-2 mb-8">
        {entry.tags.map(tag => (
          <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
            #{tag}
          </span>
        ))}
      </div>

      {/* Markdown Content */}
      <div className="space-y-1">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-8 mb-3">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-semibold text-white mt-6 mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-medium text-gray-100 mt-5 mb-2">{children}</h3>,
            p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                {children}
              </a>
            ),
            strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
            em: ({ children }) => <em className="text-gray-300 italic">{children}</em>,
            ul: ({ children }) => <ul className="list-disc list-outside ml-5 text-gray-300 mb-4 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-outside ml-5 text-gray-300 mb-4 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="text-gray-300 leading-relaxed">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 text-gray-400 italic my-4">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead>{children}</thead>,
            th: ({ children }) => (
              <th className="border border-gray-600 px-4 py-2 text-white bg-gray-800 text-left font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-700 px-4 py-2 text-gray-300">{children}</td>
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto mb-4 text-sm">
                {children}
              </pre>
            ),
            code({ className, children }) {
              const lang = /language-(\w+)/.exec(className || "")?.[1]
              const codeStr = String(children).trim()
              if (lang === "mermaid") {
                return <MermaidDiagram code={codeStr} />
              }
              if (className) {
                // inside a <pre> block — just render the text
                return <code className="text-blue-200 font-mono">{children}</code>
              }
              // inline code
              return (
                <code className="text-blue-300 bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              )
            },
            hr: () => <hr className="border-gray-700 my-6" />,
          }}
        >
          {entry.content}
        </ReactMarkdown>
      </div>

      {entry.sourceUrl && (
        <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline mt-8 block">
          Source
        </a>
      )}
    </div>
  )
}
