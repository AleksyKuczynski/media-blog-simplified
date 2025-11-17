// src/main/lib/constants.ts
export const SITE_URL = 'https://event4me.vercel.app' as string;
export const CONTACT_EMAIL = 'alehkuczynski@gmail.com' as string;
export const DEFAULT_LANG = 'ru' as const;
export const SUPPORTED_LANGUAGES = ['ru'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];