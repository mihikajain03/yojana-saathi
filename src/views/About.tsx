import { ShieldCheck, Sparkles, Globe, Lock, Heart, ArrowRight } from 'lucide-react';
import type { ViewName } from '@/types';

interface AboutProps {
  onNavigate: (view: ViewName) => void;
}

export function About({ onNavigate }: AboutProps) {
  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-brand-50 via-white to-leaf-50 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">About Yojana Saathi</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-600">
            Yojana Saathi is an AI-powered tool that helps Indian citizens find the right government scheme
            for their situation. We translate complex scheme documents into simple, actionable information
            in Hindi and English, so every citizen can discover the benefits they are entitled to.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { icon: Sparkles, title: 'AI-powered matching', text: 'Enter your basic details and our engine checks every scheme against your eligibility in real time.' },
            { icon: Globe, title: 'Bilingual support', text: 'Our AI chatbot answers questions in both English and Hinglish so language is never a barrier.' },
            { icon: ShieldCheck, title: 'Reliable information', text: 'Scheme details are summarised from publicly available government portals and ministries.' },
            { icon: Lock, title: 'Private by design', text: 'Your details are used only in your browser to filter schemes. We do not store personal data.' },
          ].map((f) => (
            <div key={f.title} className="card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-leaf-600 text-white">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="card mt-8 p-6">
          <h2 className="font-display text-xl font-bold text-ink-900">Our mission</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            Millions of Indians miss out on government schemes simply because they do not know such a scheme exists
            or do not understand the eligibility rules. Yojana Saathi bridges that gap by making scheme discovery
            fast, personal and easy to understand, in the language people actually speak.
          </p>
        </div>

        <div className="card mt-6 border-brand-200 bg-brand-50 p-6">
          <h2 className="font-display text-lg font-bold text-ink-900">Important disclaimer</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            Yojana Saathi is an independent informational tool and is not affiliated with any government body.
            Scheme details may change over time. Always verify the latest information and apply only through the
            official government portal linked on each scheme page.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => onNavigate('find')} className="btn-primary">
            Find my schemes <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => onNavigate('browse')} className="btn-secondary">
            Browse all schemes
          </button>
        </div>

        <p className="mt-10 flex items-center gap-1.5 text-center text-xs text-ink-400">
          Made with <Heart className="h-3.5 w-3.5 fill-brand-500 text-brand-500" /> for India
        </p>
      </section>
    </div>
  );
}
