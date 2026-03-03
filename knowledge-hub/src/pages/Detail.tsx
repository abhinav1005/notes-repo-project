import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState, useMemo } from "react"
import type { ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import mermaid from "mermaid"
import entries from "../Data/entries.json"
import type { Entry } from "../types/entry"

mermaid.initialize({ startOnLoad: false, theme: "dark" })

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '-')
}

function childText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return (node as ReactNode[]).map(childText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return childText((node as { props: { children?: ReactNode } }).props.children)
  }
  return ''
}

type Heading = { id: string; text: string; level: number }

function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = []
  const seen: Record<string, number> = {}
  for (const line of markdown.split('\n')) {
    const m = /^(#{2,3})\s+(.+)$/.exec(line)
    if (!m) continue
    const text = m[2].trim()
    let id = slugify(text)
    if (seen[id]) { seen[id]++; id = `${id}-${seen[id]}` }
    else seen[id] = 1
    headings.push({ id, text, level: m[1].length })
  }
  return headings
}

// ── sub-components ────────────────────────────────────────────────────────────

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

// ── constants ─────────────────────────────────────────────────────────────────

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

// ── main component ────────────────────────────────────────────────────────────

export default function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const entry: Entry | undefined = (entries as Entry[]).find(e => e.entryId === id)
  const [activeId, setActiveId] = useState('')

  const toc = useMemo(() => entry ? extractHeadings(entry.content) : [], [entry])

  // Escape → go back (only when no modal is open)
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (document.getElementById('cmd-k-modal') || document.getElementById('shortcuts-modal')) return
      navigate(-1)
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [navigate])

  // Scroll spy via IntersectionObserver
  useEffect(() => {
    if (toc.length === 0) return
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) { setActiveId(entry.target.id); break }
        }
      },
      { rootMargin: '-10% 0% -75% 0%' }
    )
    toc.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [toc])

  if (!entry) return (
    <div className="max-w-3xl mx-auto p-8 text-slate-400">Entry not found.</div>
  )

  const typeColor = TYPE_COLORS[entry.type] ?? 'text-slate-400'

  return (
    <div className="max-w-5xl mx-auto w-full py-8 px-4 md:px-6 xl:flex xl:gap-12 xl:items-start">

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">

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
          <span className="text-slate-700 text-xs ml-1 font-mono">esc</span>
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
              h2: ({ children }) => {
                const id = slugify(childText(children))
                return <h2 id={id} className="text-lg font-semibold text-white mt-6 mb-2">{children}</h2>
              },
              h3: ({ children }) => {
                const id = slugify(childText(children))
                return <h3 id={id} className="text-base font-medium text-slate-200 mt-5 mb-2">{children}</h3>
              },
              h4: ({ children }) => <h4 className="text-sm font-semibold text-slate-300 mt-4 mb-1.5">{children}</h4>,
              h5: ({ children }) => <h5 className="text-sm font-medium text-slate-400 mt-3 mb-1">{children}</h5>,
              h6: ({ children }) => <h6 className="text-xs font-medium text-slate-400 mt-3 mb-1">{children}</h6>,
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
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt ?? ''}
                  className="rounded-lg max-w-full my-4 border border-slate-700/60"
                />
              ),
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

      {/* ── ToC sidebar (xl screens only) ── */}
      {toc.length > 0 && (
        <aside className="hidden xl:block w-52 shrink-0">
          <div className="sticky top-20">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              On this page
            </p>
            <nav className="space-y-0.5">
              {toc.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={e => {
                    e.preventDefault()
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`block text-xs py-1 leading-snug transition-colors ${
                    item.level === 3 ? 'pl-3' : ''
                  } ${
                    activeId === item.id
                      ? 'text-blue-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}

    </div>
  )
}
