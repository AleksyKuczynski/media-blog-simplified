// src/main/lib/constants.ts
export const DEFAULT_LANG = 'ru' as const;
export const SUPPORTED_LANGUAGES = ['ru'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];