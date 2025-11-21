// src/main/lib/dictionary/index.ts
import { dictionaryEN } from './dictionaries/en';
import type { SupportedLanguage } from '../constants/constants';
import dictionaryRU from './dictionaries/ru';
import Dictionary from './types';

// Export types
export type Lang = SupportedLanguage;

// Dictionary registry
const dictionaries: Record<Lang, Dictionary> = {
  ru: dictionaryRU,
  en: dictionaryEN as Dictionary, // Type assertion since both have same structure
};

/**
 * Get dictionary by language code
 * Falls back to English if language not found
 */
export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang] || dictionaries.en;
}

// Re-export for backward compatibility
export { dictionaryRU as dictionary };
export default dictionaryRU;