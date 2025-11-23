// src/main/lib/utils/translationHelpers.ts
// Reusable utilities for extracting Directus translations safely

import { Lang } from '@/main/lib/dictionary';

/**
 * Generic interface for Directus items with translations
 */
interface TranslatableItem {
  translations: Array<{
    languages_code: string;
    [key: string]: any;
  }>;
}

/**
 * Safely extract translation for a given language
 * Returns the translation object or null if not found
 * 
 * @example
 * const translation = getTranslation(article, 'ru');
 * if (translation) {
 *   console.log(translation.title);
 * }
 */
export function getTranslation<T extends TranslatableItem>(
  item: T | null | undefined,
  lang: Lang
): T['translations'][number] | null {
  if (!item?.translations) {
    return null;
  }
  
  return item.translations.find(t => t.languages_code === lang) || null;
}

/**
 * Extract translation with fallback to first available translation
 * Useful when you must have some translation
 * 
 * @example
 * const translation = getTranslationOrFirst(article, 'en');
 * // Returns English translation, or first available if English not found
 */
export function getTranslationOrFirst<T extends TranslatableItem>(
  item: T | null | undefined,
  lang: Lang
): T['translations'][number] | null {
  if (!item?.translations || item.translations.length === 0) {
    return null;
  }
  
  const translation = item.translations.find(t => t.languages_code === lang);
  return translation || item.translations[0];
}

/**
 * Extract specific field from translation with fallback
 * 
 * @example
 * const title = getTranslatedField(article, 'ru', 'title', article.slug);
 * // Returns Russian title, or falls back to slug if not found
 */
export function getTranslatedField<T extends TranslatableItem, K extends string>(
  item: T | null | undefined,
  lang: Lang,
  field: K,
  fallback: string = ''
): string {
  const translation = getTranslation(item, lang);
  return (translation?.[field] as string) || fallback;
}

/**
 * Check if translation exists for given language
 * 
 * @example
 * if (hasTranslation(article, 'en')) {
 *   // Safe to use English translation
 * }
 */
export function hasTranslation<T extends TranslatableItem>(
  item: T | null | undefined,
  lang: Lang
): boolean {
  return getTranslation(item, lang) !== null;
}

/**
 * Extract multiple fields at once from translation
 * 
 * @example
 * const { title, description, lead } = extractTranslationFields(
 *   article,
 *   'ru',
 *   { title: '', description: '', lead: '' }
 * );
 */
export function extractTranslationFields<
  T extends TranslatableItem,
  F extends Record<string, string>
>(
  item: T | null | undefined,
  lang: Lang,
  fields: F
): F {
  const translation = getTranslation(item, lang);
  
  if (!translation) {
    return fields; // Return defaults
  }
  
  const result = { ...fields } as Record<string, string>;
  for (const key in fields) {
    result[key] = (translation[key] as string) || fields[key];
  }
  
  return result as F;
}

/**
 * Specialized helper for articles
 */
export function getArticleTranslation(
  article: any,
  lang: Lang
) {
  const translation = getTranslation(article, lang);
  
  return {
    title: translation?.title || article?.slug || '',
    description: translation?.description || '',
    lead: translation?.lead || '',
    seoTitle: translation?.seo_title || translation?.title || '',
    seoDescription: translation?.seo_description || translation?.description || '',
  };
}

/**
 * Specialized helper for rubrics
 */
export function getRubricTranslation(
  rubric: any,
  lang: Lang
) {
  const translation = getTranslation(rubric, lang);
  
  return {
    name: translation?.name || rubric?.slug || '',
    description: translation?.description || '',
    metaTitle: translation?.meta_title || translation?.name || '',
    metaDescription: translation?.meta_description || translation?.description || '',
  };
}

/**
 * Specialized helper for authors
 */
export function getAuthorTranslation(
  author: any,
  lang: Lang
) {
  const translation = getTranslation(author, lang);
  
  return {
    name: translation?.name || author?.slug || '',
    bio: translation?.bio || '',
  };
}