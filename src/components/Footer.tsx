import { Landmark, Heart, Mail } from 'lucide-react';
import type { ViewName } from '@/types';

interface FooterProps {
  onNavigate: (view: ViewName) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-ink-100 bg-ink-900 text-ink-300">
      <div className="brand-bar h-1 w-full" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-leaf-600 text-white">
                <Landmark className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-extrabold text-white">Yojana Saathi</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              Helping every Indian citizen discover the right government scheme, in simple language.
              Built with reliable, publicly available government information.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-200">Explore</h4>
            <ul className="space-y-2 text-sm">
              {(['home', 'find', 'browse', 'about'] as ViewName[]).map((v) => (
                <li key={v}>
                  <button
                    onClick={() => onNavigate(v)}
                    className="text-ink-400 transition hover:text-brand-400"
                  >
                    {v === 'home' ? 'Home' : v === 'find' ? 'Find Schemes' : v === 'browse' ? 'Browse Schemes' : 'About'}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-200">Disclaimer</h4>
            <p className="text-sm leading-relaxed text-ink-400">
              This is an informational tool that summarises publicly available government schemes.
              Always verify details and apply through official portals before taking any decision.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-800 pt-6 text-xs text-ink-500 sm:flex-row">
          <p>Made with <Heart className="inline h-3 w-3 fill-brand-500 text-brand-500" /> for India</p>
          <p className="flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" /> yojanasaathi@example.in
          </p>
        </div>
      </div>
    </footer>
  );
}
