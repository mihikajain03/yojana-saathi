import { CheckCircle2, XCircle, ArrowRight, Tag } from 'lucide-react';
import type { Scheme, SchemeMatch } from '@/types';

interface SchemeCardProps {
  scheme: Scheme;
  match?: SchemeMatch;
  onOpen: (id: string) => void;
  index?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Agriculture: 'bg-leaf-100 text-leaf-700',
  Education: 'bg-blue-100 text-blue-700',
  Health: 'bg-rose-100 text-rose-700',
  'Women & Child': 'bg-pink-100 text-pink-700',
  Housing: 'bg-amber-100 text-amber-700',
  Financial: 'bg-indigo-100 text-indigo-700',
  Employment: 'bg-cyan-100 text-cyan-700',
  'Senior Citizen': 'bg-violet-100 text-violet-700',
  'Minority & Social Welfare': 'bg-teal-100 text-teal-700',
  'Food & Ration': 'bg-orange-100 text-orange-700',
};

export function SchemeCard({ scheme, match, onOpen, index = 0 }: SchemeCardProps) {
  const eligible = match?.status === 'eligible';
  const colorClass = CATEGORY_COLORS[scheme.category] ?? 'bg-ink-100 text-ink-700';

  return (
    <article
      className="card group flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-glow"
      style={{ animation: `slide-up 0.4s ease-out ${index * 0.05}s both` }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className={`chip ${colorClass}`}>{scheme.category}</span>
        {match && (
          <span
            className={`chip ${
              eligible ? 'bg-leaf-100 text-leaf-700' : 'bg-ink-100 text-ink-500'
            }`}
          >
            {eligible ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Eligible
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5" /> Not Eligible
              </>
            )}
          </span>
        )}
      </div>

      <h3 className="font-display text-lg font-bold leading-snug text-ink-900">{scheme.name}</h3>
      <p className="mt-1 text-xs font-medium text-ink-500">{scheme.ministry}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-600">{scheme.summary}</p>

      {match && !eligible && match.failedReasons.length > 0 && (
        <div className="mt-3 rounded-lg bg-ink-50 px-3 py-2">
          <p className="text-xs font-semibold text-ink-500">Not matching because:</p>
          <ul className="mt-1 space-y-0.5">
            {match.failedReasons.slice(0, 2).map((r) => (
              <li key={r} className="flex items-start gap-1 text-xs text-ink-600">
                <XCircle className="mt-0.5 h-3 w-3 shrink-0 text-rose-500" /> {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {scheme.tags.slice(0, 3).map((t) => (
          <span key={t} className="chip bg-ink-50 text-ink-500">
            <Tag className="h-3 w-3" /> {t}
          </span>
        ))}
      </div>

      <button
        onClick={() => onOpen(scheme.id)}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition group-hover:gap-2 hover:text-brand-700"
      >
        View details <ArrowRight className="h-4 w-4 transition" />
      </button>
    </article>
  );
}
