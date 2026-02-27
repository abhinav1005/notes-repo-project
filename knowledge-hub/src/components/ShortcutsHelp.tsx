type Props = { onClose: () => void }

const shortcuts = [
  { keys: ["⌘K", "Ctrl+K"],  description: "Open search" },
  { keys: ["/"],              description: "Open search" },
  { keys: ["↑", "↓"],        description: "Navigate results" },
  { keys: ["↵"],             description: "Open selected result" },
  { keys: ["Esc"],           description: "Close overlay / go back" },
  { keys: ["↑", "↓"],        description: "Move rows (grid & list)" },
  { keys: ["←", "→"],        description: "Move columns (grid only)" },
  { keys: ["?"],             description: "Show shortcuts" },
]

export default function ShortcutsHelp({ onClose }: Props) {
  return (
    <div
      id="shortcuts-modal"
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 w-80"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-white font-semibold text-sm mb-4">Keyboard shortcuts</h2>
        <div className="space-y-3">
          {shortcuts.map(({ keys, description }) => (
            <div key={description} className="flex items-center justify-between gap-4">
              <span className="text-slate-400 text-xs">{description}</span>
              <div className="flex gap-1 shrink-0">
                {keys.map(k => (
                  <kbd key={k} className="text-xs text-slate-300 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded font-mono">
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-slate-600 text-xs mt-5">
          Press <kbd className="font-mono">esc</kbd> or click outside to close
        </p>
      </div>
    </div>
  )
}
