// src/config/i18n/index.ts
import type { SupportedLanguage } from '../constants/constants';
import Dictionary from './types';
import dictionaryEN from './dictionaries/en';
import dictionaryRU from './dictionaries/ru';

// Export types
export type Lang = SupportedLanguage;
export type { Dictionary };

// Dictionary registry
const dictionaries: Record<Lang, Dictionary> = {
  en: dictionaryEN,
  ru: dictionaryRU,
};

/**
 * Get dictionary by language code
 * Falls back to English if language not found
 */
export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang] || dictionaries.en;
}

// CHANGED: Export English as default (was dictionaryRU)
export { dictionaryEN as dictionary };
export default dictionaryEN;