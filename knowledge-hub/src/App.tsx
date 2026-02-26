import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Detail from "./pages/Detail"
import Tags from "./pages/Tags"
import Search from "./pages/Search"
import Navbar from "./components/Navbar"
import ParticlesBackground from './components/Particlebackground'

function App() {
  return (
    <BrowserRouter basename="/">
      <ParticlesBackground />
      <div className="w-full min-h-screen flex flex-col" style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/entry/:id" element={<Detail />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
