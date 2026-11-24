import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Category } from '@/types';
import { SCHEMES, CATEGORIES } from '@/data/schemes';
import { SchemeCard } from '@/components/SchemeCard';

interface BrowseSchemesProps {
  onOpenScheme: (id: string) => void;
}

export function BrowseSchemes({ onOpenScheme }: BrowseSchemesProps) {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return SCHEMES.filter((s) => {
      const matchCat = activeCategory === 'All' || s.category === activeCategory;
      const q = query.toLowerCase().trim();
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.tags.some((t) => t.includes(q)) ||
        s.ministry.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-brand-50 via-white to-leaf-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Browse all schemes</h1>
          <p className="mt-2 max-w-2xl text-ink-600">
            Explore every government scheme we have listed. Filter by category or search by name, keyword or ministry.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="card mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, keyword or ministry..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <SlidersHorizontal className="h-4 w-4" />
            <span>{filtered.length} schemes</span>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('All')}
            className={`chip border transition ${
              activeCategory === 'All'
                ? 'border-brand-400 bg-brand-500 text-white'
                : 'border-ink-200 bg-white text-ink-600 hover:bg-brand-50'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`chip border transition ${
                activeCategory === cat
                  ? 'border-brand-400 bg-brand-500 text-white'
                  : 'border-ink-200 bg-white text-ink-600 hover:bg-brand-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-ink-500">No schemes match your search. Try a different keyword or category.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((scheme, i) => (
              <SchemeCard key={scheme.id} scheme={scheme} onOpen={onOpenScheme} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
