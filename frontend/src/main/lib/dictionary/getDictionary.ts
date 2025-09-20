// src/main/lib/dictionary/getDictionary.ts
// Dictionary getter function that works with the new dictionary structure

import { Dictionary, Lang } from './types';
import dictionary from './dictionary'; // Import the actual dictionary

/**
 * Get dictionary for specified language
 * Currently only supports Russian ('ru')
 * 
 * @param lang - Language code
 * @returns Complete dictionary object
 */
export const getDictionary = async (lang: Lang): Promise<Dictionary> => {
  // For now, we only have Russian
  // In the future, this could load different language files
  if (lang !== 'ru') {
    console.warn(`Language '${lang}' not supported, falling back to Russian`);
  }
  
  return dictionary;
};

/**
 * Synchronous version of getDictionary for components that need immediate access
 */
export const getDictionarySync = (lang: Lang): Dictionary => {
  if (lang !== 'ru') {
    console.warn(`Language '${lang}' not supported, falling back to Russian`);
  }
  
  return dictionary;
};

/**
 * Get specific section of dictionary
 */
export const getDictionarySection = <K extends keyof Dictionary>(
  lang: Lang,
  section: K
): Dictionary[K] => {
  const dict = getDictionarySync(lang);
  return dict[section];
};

// Default export for convenience
export default getDictionary;