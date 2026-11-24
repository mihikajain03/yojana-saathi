import { Landmark, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { ViewName } from '@/types';

interface NavbarProps {
  current: ViewName;
  onNavigate: (view: ViewName) => void;
}

const NAV_ITEMS: { id: ViewName; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'find', label: 'Find Schemes' },
  { id: 'browse', label: 'Browse Schemes' },
  { id: 'about', label: 'About' },
];

export function Navbar({ current, onNavigate }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const handleNav = (id: ViewName) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => handleNav('home')} className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-leaf-700 text-white shadow-soft">
            <Landmark className="h-5 w-5" />
          </span>
          <span className="flex flex-col text-left leading-none">
            <span className="font-display text-lg font-extrabold text-ink-900">Yojana Saathi</span>
            <span className="text-[11px] font-medium text-ink-500">AI Scheme Finder</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                current === item.id
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-ink-700 transition hover:bg-ink-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink-100 bg-white px-4 py-3 md:hidden">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition ${
                current === item.id
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-600 hover:bg-ink-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
