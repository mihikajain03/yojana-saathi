import {
  Search,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Users,
  Landmark,
  HeartPulse,
  GraduationCap,
  House,
  Wheat,
  Banknote,
  Briefcase,
  Baby,
  Utensils,
  HandCoins,
} from 'lucide-react';
import type { ViewName, Category } from '@/types';
import { SCHEMES, CATEGORIES } from '@/data/schemes';
import { SchemeCard } from '@/components/SchemeCard';

interface HomeProps {
  onNavigate: (view: ViewName) => void;
  onOpenScheme: (id: string) => void;
}

const CATEGORY_ICONS: Record<Category, React.ComponentType<{ className?: string }>> = {
  Agriculture: Wheat,
  Education: GraduationCap,
  Health: HeartPulse,
  'Women & Child': Baby,
  Housing: House,
  Financial: Banknote,
  Employment: Briefcase,
  'Senior Citizen': HandCoins,
  'Minority & Social Welfare': Users,
  'Food & Ration': Utensils,
};

const STATS = [
  { label: 'Schemes listed', value: `${SCHEMES.length}+` },
  { label: 'Categories', value: `${CATEGORIES.length}` },
  { label: 'Central schemes', value: '100%' },
  { label: 'Languages', value: '2' },
];

export function Home({ onNavigate, onOpenScheme }: HomeProps) {
  const featured = SCHEMES.slice(0, 6);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-leaf-50">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-200 blur-3xl" />
          <div className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-leaf-200 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="chip bg-white text-brand-700 shadow-soft">
                <Sparkles className="h-3.5 w-3.5" /> AI-Powered Scheme Finder
              </span>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-ink-900 sm:text-5xl">
                Find the right <span className="text-brand-600">government scheme</span> for you, in seconds.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
                Yojana Saathi helps every Indian citizen discover central and state government schemes
                based on age, state, gender, category, income and occupation. Simple language, reliable
                information, and an AI assistant that speaks Hindi and English.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => onNavigate('find')} className="btn-primary">
                  <Search className="h-4 w-4" /> Find my schemes
                </button>
                <button onClick={() => onNavigate('browse')} className="btn-secondary">
                  Browse all schemes <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-xl bg-white/70 p-3 text-center shadow-soft backdrop-blur">
                    <p className="font-display text-2xl font-extrabold text-brand-600">{s.value}</p>
                    <p className="text-xs font-medium text-ink-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="card rotate-2 p-6 transition hover:rotate-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                    <Landmark className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-display font-bold text-ink-900">PM-KISAN Samman Nidhi</p>
                    <p className="text-xs text-ink-500">Agriculture</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-ink-600">₹6,000 per year income support for landholding farmer families.</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-leaf-700">
                  <ShieldCheck className="h-4 w-4" /> Eligible · Direct benefit transfer
                </div>
              </div>
              <div className="card -rotate-3 mt-4 ml-10 p-6 transition hover:rotate-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700">
                    <HeartPulse className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-display font-bold text-ink-900">Ayushman Bharat (PM-JAY)</p>
                    <p className="text-xs text-ink-500">Health</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-ink-600">Up to ₹5 lakh free health cover per family per year.</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-leaf-700">
                  <ShieldCheck className="h-4 w-4" /> Cashless at empanelled hospitals
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-extrabold text-ink-900">How it works</h2>
          <p className="mt-2 text-ink-500">Three simple steps to discover your eligible schemes.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { icon: Search, title: 'Enter your details', text: 'Fill a short form with your age, state, gender, category, income and occupation.' },
            { icon: Sparkles, title: 'Get matched', text: 'We instantly check every scheme and show you the ones you are eligible for.' },
            { icon: ArrowRight, title: 'Apply with confidence', text: 'See benefits, documents, steps and official links, then apply on the official portal.' },
          ].map((step, i) => (
            <div key={step.title} className="card p-6 text-center" style={{ animation: `slide-up 0.4s ease-out ${i * 0.08}s both` }}>
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-leaf-600 text-white">
                <step.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-ink-900">Browse by category</h2>
              <p className="mt-2 text-ink-500">Pick a category to see all related schemes.</p>
            </div>
            <button onClick={() => onNavigate('browse')} className="btn-ghost text-brand-600">
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((cat, i) => {
              const Icon = CATEGORY_ICONS[cat];
              const count = SCHEMES.filter((s) => s.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => onNavigate('browse')}
                  className="card group flex flex-col items-center gap-2 p-5 text-center transition hover:-translate-y-1 hover:shadow-glow"
                  style={{ animation: `fade-in 0.4s ease-out ${i * 0.04}s both` }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-100">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="text-sm font-semibold leading-tight text-ink-800">{cat}</p>
                  <p className="text-xs text-ink-400">{count} schemes</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured schemes */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-ink-900">Popular schemes</h2>
            <p className="mt-2 text-ink-500">Some of the most-used central government schemes.</p>
          </div>
          <button onClick={() => onNavigate('browse')} className="btn-secondary">
            Browse all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((scheme, i) => (
            <SchemeCard key={scheme.id} scheme={scheme} onOpen={onOpenScheme} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-leaf-700 p-8 text-center text-white sm:p-12">
          <h2 className="font-display text-3xl font-extrabold">Ready to find your schemes?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/90">
            It takes less than a minute. Enter your details and get a personalised list of schemes you are eligible for.
          </p>
          <button
            onClick={() => onNavigate('find')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-soft transition hover:bg-brand-50 active:scale-95"
          >
            <Search className="h-4 w-4" /> Start now
          </button>
        </div>
      </section>
    </div>
  );
}
