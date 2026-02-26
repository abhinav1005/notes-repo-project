import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [darkMode, _setDarkMode] = useState(() => {
    // Check localStorage or system preference on initial load
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM:SS EST
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    // Get timezone abbreviation (EST, PST, etc.)
    const timezone = date.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2];
    
    return `${hours}:${minutes}:${seconds} ${timezone}`;
  };

  return (
    <nav className="bg-black rounded-b-lg shadow p-4 sticky top-0 z-10">
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-3 md:items-center md:gap-4">
        {/* Left: Logo */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white">Hub</h1>
        </div>

        {/* Center: Links */}
        <div className="flex justify-center space-x-6">
          <Link
            to="/"
            className="text-white hover:text-blue-500 font-medium"
          >
            Home
          </Link>
          <span className="text-white">/</span>
          <Link
            to="/tags"
            className="text-white hover:text-blue-500 font-medium"
          >
            Tags
          </Link>
          <span className="text-white">/</span>
          <Link
            to="/search"
            className="text-white hover:text-blue-500 font-medium"
          >
            Search
          </Link>
        </div>

        {/* Right: Clock + Dark Mode */}
        <div className="flex items-center justify-end space-x-2">
          <div className="text-white text-sm font-mono">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* First Row: Links on left, Dark mode on right */}
        <div className="flex items-center justify-center mb-3">
          <div className="flex space-x-6">
            <Link
              to="/"
              className="text-white hover:text-blue-500 font-medium"
            >
              Home
            </Link>
            <span className="text-white">/</span>
            <Link
              to="/tags"
              className="text-white hover:text-blue-500 font-medium"
            >
              Tags
            </Link>
            <span className="text-white">/</span>
            <Link
              to="/search"
              className="text-white hover:text-blue-500 font-medium"
            >
              Search
            </Link>
          </div>
        </div>

        {/* Second Row: Clock full width */}
        <div>
          <div className="w-full text-center text-white text-sm font-mono bg-gray-800 px-3 py-2 rounded-md border border-gray-600">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>
    </nav>
  );
}