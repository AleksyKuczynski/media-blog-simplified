// src/main/lib/constants.ts
export const SITE_URL = 'https://event4me.vercel.app' as string;
export const CONTACT_EMAIL = 'alehkuczynski@gmail.com' as string;
export const DEFAULT_LANG = 'en' as const;
export const SUPPORTED_LANGUAGES = ['en', 'ru'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const GEO_LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  'RU': 'ru',
  'UA': 'ru', 
  'BY': 'ru',
  'KZ': 'ru',
  'UZ': 'ru',
  'TJ': 'ru',
  'KG': 'ru',
  'TM': 'ru',
  'AZ': 'ru',
  'AM': 'ru',
  'GE': 'ru',
};