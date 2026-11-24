import type { Scheme, UserProfile, SchemeMatch } from '@/types';

const OCCUPATION_GROUPS: Record<string, string[]> = {
  Agriculture: ['Farmer', 'Agriculture Labourer', 'Unorganised Worker', 'Self-employed'],
  Unskilled: ['Daily Wage', 'Agriculture Labourer', 'Unorganised Worker'],
  SelfEmployed: ['Self-employed', 'Small Business', 'Street Vendor'],
  Student: ['Student'],
  Retired: ['Retired'],
};

function occupationMatches(schemeOccupations: string[], userOccupation: string): boolean {
  if (schemeOccupations.includes('Any')) return true;
  if (schemeOccupations.includes(userOccupation)) return true;
  for (const occ of schemeOccupations) {
    const group = OCCUPATION_GROUPS[occ];
    if (group && group.includes(userOccupation)) return true;
  }
  return false;
}

export function evaluateScheme(scheme: Scheme, profile: UserProfile): SchemeMatch {
  const crit = scheme.eligibility;
  const failed: string[] = [];

  if (profile.age != null) {
    if (profile.age < crit.minAge) {
      failed.push(`Minimum age is ${crit.minAge} years`);
    }
    if (profile.age > crit.maxAge) {
      failed.push(`Maximum age is ${crit.maxAge} years`);
    }
  }

  if (profile.state && !crit.states.includes('All States')) {
    if (!crit.states.includes(profile.state)) {
      failed.push(`Available only in ${crit.states.join(', ')}`);
    }
  }

  if (profile.gender && !crit.genders.includes(profile.gender as never)) {
    failed.push(`For ${crit.genders.join('/')} applicants only`);
  }

  if (profile.category && !crit.categories.includes(profile.category as never)) {
    failed.push(`For ${crit.categories.join(', ')} categories only`);
  }

  if (profile.income != null && crit.maxIncome != null && profile.income > crit.maxIncome) {
    failed.push(`Annual income must be up to ₹${crit.maxIncome.toLocaleString('en-IN')}`);
  }

  if (profile.occupation && !occupationMatches(crit.occupations, profile.occupation)) {
    failed.push(`Suitable for ${crit.occupations.join(', ')}`);
  }

  return {
    scheme,
    status: failed.length === 0 ? 'eligible' : 'ineligible',
    failedReasons: failed,
  };
}

export function evaluateAllSchemes(
  schemes: Scheme[],
  profile: UserProfile,
  eligibleOnly = false,
): SchemeMatch[] {
  const matches = schemes.map((s) => evaluateScheme(s, profile));
  return eligibleOnly ? matches.filter((m) => m.status === 'eligible') : matches;
}

export function schemesByCategory(schemes: Scheme[], category: string): Scheme[] {
  return schemes.filter((s) => s.category === category);
}
