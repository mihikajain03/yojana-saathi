import { useState } from 'react';
import { Search, RotateCcw, CheckCircle2, XCircle, AlertCircle, Compass } from 'lucide-react';
import type { UserProfile, SchemeMatch, Gender, SocialCategory, Occupation, ViewName } from '@/types';
import { SCHEMES } from '@/data/schemes';
import { INDIAN_STATES } from '@/data/schemes';
import { evaluateAllSchemes } from '@/lib/eligibility';
import { SchemeCard } from '@/components/SchemeCard';

interface FindSchemesProps {
  onOpenScheme: (id: string) => void;
  onNavigate: (view: ViewName) => void;
}

const GENDERS: Gender[] = ['Male', 'Female', 'Other'];
const CATEGORIES: SocialCategory[] = ['General', 'SC', 'ST', 'OBC', 'EWS', 'Other'];
const OCCUPATIONS: Occupation[] = [
  'Farmer',
  'Agriculture Labourer',
  'Student',
  'Daily Wage',
  'Unorganised Worker',
  'Self-employed',
  'Small Business',
  'Street Vendor',
  'Retired',
  'Unemployed',
];

interface FormValues {
  age: string;
  state: string;
  gender: string;
  category: string;
  income: string;
  occupation: string;
}

const EMPTY_FORM: FormValues = {
  age: '',
  state: '',
  gender: '',
  category: '',
  income: '',
  occupation: '',
};

type Errors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): Errors {
  const errors: Errors = {};

  if (!values.age.trim()) {
    errors.age = 'Please enter your age.';
  } else {
    const ageNum = Number(values.age);
    if (Number.isNaN(ageNum)) {
      errors.age = 'Age must be a number.';
    } else if (ageNum < 1 || ageNum > 120) {
      errors.age = 'Age must be between 1 and 120 years.';
    }
  }

  if (!values.state) {
    errors.state = 'Please select your state or UT.';
  }

  if (!values.category) {
    errors.category = 'Please select your social category.';
  }

  if (!values.income.trim()) {
    errors.income = 'Please enter your annual income.';
  } else {
    const incomeNum = Number(values.income);
    if (Number.isNaN(incomeNum)) {
      errors.income = 'Income must be a number.';
    } else if (incomeNum < 0) {
      errors.income = 'Income cannot be less than zero.';
    }
  }

  if (!values.occupation) {
    errors.occupation = 'Please select your occupation.';
  }

  return errors;
}

function toProfile(values: FormValues): UserProfile {
  return {
    age: Number(values.age),
    state: values.state,
    gender: (values.gender || '') as Gender | '',
    category: (values.category || '') as SocialCategory | '',
    income: Number(values.income),
    occupation: (values.occupation || '') as Occupation | '',
  };
}

export function FindSchemes({ onOpenScheme, onNavigate }: FindSchemesProps) {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<SchemeMatch[] | null>(null);

  const update = (key: keyof FormValues, raw: string) => {
    setValues((prev) => ({ ...prev, [key]: raw }));
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        const trial = { ...values, [key]: raw };
        const fieldErrors = validate(trial);
        if (fieldErrors[key]) {
          next[key] = fieldErrors[key];
        } else {
          delete next[key];
        }
        return next;
      });
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    setSubmitted(true);

    if (Object.keys(fieldErrors).length > 0) {
      setResults(null);
      return;
    }

    const matches = evaluateAllSchemes(SCHEMES, toProfile(values));
    setResults(matches);
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const reset = () => {
    setValues(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
    setResults(null);
  };

  const eligibleCount = results?.filter((r) => r.status === 'eligible').length ?? 0;
  const ineligibleCount = results ? results.length - eligibleCount : 0;

  const fieldBorder = (key: keyof FormValues): string =>
    errors[key] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200' : '';

  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-brand-50 via-white to-leaf-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Find schemes for you</h1>
          <p className="mt-2 max-w-2xl text-ink-600">
            Fill in your details below. All fields are required. We will check every scheme and show you the ones you are eligible for, plus the ones you are not yet eligible for with the reason.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <form onSubmit={submit} className="card p-6 sm:p-8" noValidate>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="label-field" htmlFor="age">
                Age <span className="font-normal text-ink-400">(years)</span> <span className="text-rose-500">*</span>
              </label>
              <input
                id="age"
                type="number"
                min={1}
                max={120}
                value={values.age}
                onChange={(e) => update('age', e.target.value)}
                placeholder="e.g. 35"
                className={`input-field ${fieldBorder('age')}`}
              />
              {errors.age && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.age}
                </p>
              )}
            </div>

            <div>
              <label className="label-field" htmlFor="state">
                State / UT <span className="text-rose-500">*</span>
              </label>
              <select
                id="state"
                value={values.state}
                onChange={(e) => update('state', e.target.value)}
                className={`input-field ${fieldBorder('state')}`}
              >
                <option value="">Select</option>
                {INDIAN_STATES.filter((s) => s !== 'All States').map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.state}
                </p>
              )}
            </div>

            <div>
              <label className="label-field" htmlFor="gender">
                Gender <span className="font-normal text-ink-400">(optional)</span>
              </label>
              <select
                id="gender"
                value={values.gender}
                onChange={(e) => update('gender', e.target.value)}
                className="input-field"
              >
                <option value="">Select</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-field" htmlFor="category">
                Social category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                value={values.category}
                onChange={(e) => update('category', e.target.value)}
                className={`input-field ${fieldBorder('category')}`}
              >
                <option value="">Select</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="label-field" htmlFor="income">
                Annual income <span className="font-normal text-ink-400">(₹)</span> <span className="text-rose-500">*</span>
              </label>
              <input
                id="income"
                type="number"
                min={0}
                value={values.income}
                onChange={(e) => update('income', e.target.value)}
                placeholder="e.g. 150000"
                className={`input-field ${fieldBorder('income')}`}
              />
              {errors.income && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.income}
                </p>
              )}
            </div>

            <div>
              <label className="label-field" htmlFor="occupation">
                Occupation <span className="text-rose-500">*</span>
              </label>
              <select
                id="occupation"
                value={values.occupation}
                onChange={(e) => update('occupation', e.target.value)}
                className={`input-field ${fieldBorder('occupation')}`}
              >
                <option value="">Select</option>
                {OCCUPATIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              {errors.occupation && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.occupation}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary">
              <Search className="h-4 w-4" /> Find schemes
            </button>
            <button type="button" onClick={reset} className="btn-secondary">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </form>

        {results && (
          <div id="results" className="mt-10 animate-slide-up">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <h2 className="font-display text-2xl font-bold text-ink-900">Your results</h2>
              <div className="flex gap-2">
                <span className="chip bg-leaf-100 text-leaf-700">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {eligibleCount} eligible
                </span>
                <span className="chip bg-ink-100 text-ink-500">
                  <XCircle className="h-3.5 w-3.5" /> {ineligibleCount} not eligible
                </span>
              </div>
            </div>

            {eligibleCount === 0 && (
              <div className="card mb-6 border-brand-200 bg-brand-50 p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                  <Search className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink-900">No schemes match your details</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
                  None of the listed schemes fully match what you entered. Try adjusting a field (for example income or age),
                  or browse all schemes to explore what is available.
                </p>
                <button onClick={() => onNavigate('browse')} className="btn-primary mt-4">
                  <Compass className="h-4 w-4" /> Browse all schemes
                </button>
              </div>
            )}

            {eligibleCount > 0 && (
              <>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-leaf-700">
                  <CheckCircle2 className="h-5 w-5" /> Schemes you are eligible for
                </h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {results
                    .filter((r) => r.status === 'eligible')
                    .map((m, i) => (
                      <SchemeCard key={m.scheme.id} scheme={m.scheme} match={m} onOpen={onOpenScheme} index={i} />
                    ))}
                </div>
              </>
            )}

            {ineligibleCount > 0 && (
              <>
                <h3 className="mb-4 mt-10 flex items-center gap-2 text-lg font-bold text-ink-500">
                  <XCircle className="h-5 w-5" /> Other schemes (not eligible)
                </h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {results
                    .filter((r) => r.status === 'ineligible')
                    .map((m, i) => (
                      <SchemeCard key={m.scheme.id} scheme={m.scheme} match={m} onOpen={onOpenScheme} index={i} />
                    ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
