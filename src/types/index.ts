export type Category =
  | 'Agriculture'
  | 'Education'
  | 'Health'
  | 'Women & Child'
  | 'Housing'
  | 'Financial'
  | 'Employment'
  | 'Senior Citizen'
  | 'Minority & Social Welfare'
  | 'Food & Ration';

export type Gender = 'Male' | 'Female' | 'Other';

export type SocialCategory = 'General' | 'SC' | 'ST' | 'OBC' | 'EWS' | 'Other';

export type Occupation =
  | 'Farmer'
  | 'Agriculture Labourer'
  | 'Student'
  | 'Daily Wage'
  | 'Unorganised Worker'
  | 'Self-employed'
  | 'Small Business'
  | 'Street Vendor'
  | 'Retired'
  | 'Unemployed'
  | 'Any';

export interface EligibilityCriteria {
  minAge: number;
  maxAge: number;
  states: string[];
  genders: Gender[];
  categories: SocialCategory[];
  maxIncome: number | null;
  occupations: Occupation[];
}

export interface Scheme {
  id: string;
  name: string;
  category: Category;
  ministry: string;
  summary: string;
  benefits: string[];
  eligibility: EligibilityCriteria;
  documents: string[];
  steps: string[];
  officialLink: string;
  tags: string[];
}

export interface UserProfile {
  age: number | null;
  state: string;
  gender: Gender | '';
  category: SocialCategory | '';
  income: number | null;
  occupation: Occupation | '';
}

export type EligibilityStatus = 'eligible' | 'ineligible';

export interface SchemeMatch {
  scheme: Scheme;
  status: EligibilityStatus;
  failedReasons: string[];
}

export type ViewName = 'home' | 'find' | 'browse' | 'scheme' | 'about';

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
}
