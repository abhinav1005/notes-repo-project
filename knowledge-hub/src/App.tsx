import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Detail from "./pages/Detail"
import Tags from "./pages/Tags"
import Search from "./pages/Search"
import Navbar from "./components/Navbar"
import ParticlesBackground from './components/Particlebackground'
import SearchModal from './components/SearchModal'
import ShortcutsHelp from './components/ShortcutsHelp'

function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      const inInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)

      if (e.key === 'Escape') {
        if (isSearchOpen) { setIsSearchOpen(false); return }
        if (isShortcutsOpen) { setIsShortcutsOpen(false); return }
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(o => !o)
        return
      }
      if (e.key === '/' && !inInput && !isSearchOpen) {
        e.preventDefault()
        setIsSearchOpen(true)
        return
      }
      if (e.key === '?' && !inInput && !isShortcutsOpen) {
        setIsShortcutsOpen(true)
        return
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [isSearchOpen, isShortcutsOpen])

  return (
    <>
      <ParticlesBackground />
      <div className="w-full min-h-screen flex flex-col" style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home isSearchOpen={isSearchOpen} />} />
            <Route path="/entry/:id" element={<Detail />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
      </div>
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
      {isShortcutsOpen && <ShortcutsHelp onClose={() => setIsShortcutsOpen(false)} />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/">
      <AppContent />
    </BrowserRouter>
  )
}
