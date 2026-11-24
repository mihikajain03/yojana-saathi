import { useMemo } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  FileText,
  ListChecks,
  Gift,
  UserCheck,
  Building2,
  Tag,
  Sparkles,
} from 'lucide-react';
import type { ViewName } from '@/types';
import { SCHEMES } from '@/data/schemes';
import { SchemeCard } from '@/components/SchemeCard';

interface SchemeDetailProps {
  schemeId: string | null;
  onNavigate: (view: ViewName) => void;
  onOpenScheme: (id: string) => void;
}

export function SchemeDetail({ schemeId, onNavigate, onOpenScheme }: SchemeDetailProps) {
  const scheme = useMemo(() => SCHEMES.find((s) => s.id === schemeId) ?? null, [schemeId]);

  if (!scheme) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900">Scheme not found</h1>
        <p className="mt-2 text-ink-500">The scheme you are looking for is not available.</p>
        <button onClick={() => onNavigate('browse')} className="btn-primary mt-6">
          <ArrowLeft className="h-4 w-4" /> Back to browse
        </button>
      </div>
    );
  }

  const related = SCHEMES.filter((s) => s.category === scheme.category && s.id !== scheme.id).slice(0, 3);
  const crit = scheme.eligibility;

  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-brand-50 via-white to-leaf-50 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate('browse')}
            className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-600 transition hover:text-brand-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all schemes
          </button>
          <span className="chip bg-brand-100 text-brand-700">{scheme.category}</span>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
            {scheme.name}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-ink-500">
            <Building2 className="h-4 w-4" /> {scheme.ministry}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700">{scheme.summary}</p>
          <a
            href={scheme.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6"
          >
            Visit official portal <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Benefits */}
          <div className="card p-6 lg:col-span-2">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
              <Gift className="h-5 w-5 text-brand-600" /> Benefits
            </h2>
            <ul className="mt-4 space-y-3">
              {scheme.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-leaf-600" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick eligibility */}
          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
              <UserCheck className="h-5 w-5 text-brand-600" /> Eligibility
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">Age</dt>
                <dd className="text-right font-medium text-ink-800">
                  {crit.minAge === 0 && crit.maxAge === 120 ? 'Any age' : `${crit.minAge}\u2013${crit.maxAge} years`}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">Gender</dt>
                <dd className="text-right font-medium text-ink-800">{crit.genders.join(', ')}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">Category</dt>
                <dd className="text-right font-medium text-ink-800">{crit.categories.join(', ')}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">Income</dt>
                <dd className="text-right font-medium text-ink-800">
                  {crit.maxIncome == null ? 'No limit' : `Up to ₹${crit.maxIncome.toLocaleString('en-IN')}`}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">Occupation</dt>
                <dd className="text-right font-medium text-ink-800">{crit.occupations.join(', ')}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">States</dt>
                <dd className="text-right font-medium text-ink-800">{crit.states.join(', ')}</dd>
              </div>
            </dl>
          </div>

          {/* Documents */}
          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
              <FileText className="h-5 w-5 text-brand-600" /> Required documents
            </h2>
            <ul className="mt-4 space-y-2.5">
              {scheme.documents.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Application steps */}
          <div className="card p-6 lg:col-span-2">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
              <ListChecks className="h-5 w-5 text-brand-600" /> How to apply
            </h2>
            <ol className="mt-4 space-y-4">
              {scheme.steps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-sm leading-relaxed text-ink-700">{step}</p>
                </li>
              ))}
            </ol>
            <a
              href={scheme.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6"
            >
              Apply on official portal <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Tags */}
          <div className="card p-6 lg:col-span-3">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
              <Tag className="h-5 w-5 text-brand-600" /> Related keywords
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {scheme.tags.map((t) => (
                <span key={t} className="chip bg-ink-100 text-ink-600">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* AI hint */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-gradient-to-r from-brand-50 to-leaf-50 p-5">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
          <p className="text-sm text-ink-700">
            Want to confirm your eligibility? Use the <button onClick={() => onNavigate('find')} className="font-semibold text-brand-600 underline">Find Schemes</button> page
            or ask the AI assistant (bottom-right corner) about this scheme in Hindi or English.
          </p>
        </div>

        {/* Related schemes */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-5 font-display text-2xl font-bold text-ink-900">Related schemes in {scheme.category}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s, i) => (
                <SchemeCard key={s.id} scheme={s} onOpen={onOpenScheme} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
