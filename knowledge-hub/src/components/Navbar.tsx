import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    const tz = date.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2];
    return `${h}:${m}:${s} ${tz}`;
  };

  const navLink = (to: string, label: string) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`text-sm font-medium transition-colors ${
          active
            ? 'text-white'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {label}
        {active && <span className="block h-0.5 bg-blue-500 rounded-full mt-0.5" />}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-10 bg-[#0d1117] px-6 py-3">
      <div className="flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="text-white font-semibold text-sm tracking-wide shrink-0">
          Hub
        </Link>

        {/* Links */}
        <div className="flex items-center gap-3">
          {navLink('/', 'Home')}
          <span className="text-slate-600">/</span>
          {navLink('/tags', 'Tags')}
          <span className="text-slate-600">/</span>
          {navLink('/search', 'Search')}
        </div>

        {/* Clock */}
        <span className="text-slate-500 text-xs font-mono shrink-0 hidden sm:block">
          {formatTime(currentTime)}
        </span>

      </div>
    </nav>
  );
}
