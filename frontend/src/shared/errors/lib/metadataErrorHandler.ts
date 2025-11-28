// src/main/lib/errors/metadataErrorHandler.ts
// Enhanced error handling specifically for generateMetadata functions

import { Metadata } from 'next';
import { Dictionary, getDictionary, Lang } from '@/config/i18n';
import { DEFAULT_LANG } from '@/config/constants/constants';
import { createErrorHandler, ContentType } from './errorUtils';

/**
 * Safe metadata generator that handles errors with correct language
 * 
 * @example
 * export async function generateMetadata({ params }) {
 *   return safeGenerateMetadata(params, 'author', async (lang, dictionary) => {
 *     // Your metadata logic here
 *     const author = await fetchAuthor(slug, lang);
 *     return { title: author.name, description: author.bio };
 *   });
 * }
 */
export async function safeGenerateMetadata(
  params: Promise<{ lang: string; [key: string]: string }>,
  contentType: ContentType,
  metadataGenerator: (lang: Lang, dictionary: Dictionary, params: any) => Promise<Metadata>
): Promise<Metadata> {
  // Step 1: Extract lang safely
  let lang: Lang;
  let resolvedParams: any;
  
  try {
    resolvedParams = await params;
    lang = resolvedParams.lang as Lang;
  } catch {
    // Params parsing failed - use default
    lang = DEFAULT_LANG;
    resolvedParams = { lang };
  }

  // Step 2: Get dictionary for this language
  const dictionary = getDictionary(lang);
  
  // Step 3: Try to generate metadata
  try {
    return await metadataGenerator(lang, dictionary, resolvedParams);
  } catch (error) {
    console.error(`Error generating ${contentType} metadata:`, error);
    
    // Return error metadata in correct language
    const errorHandler = createErrorHandler(dictionary);
    return errorHandler.generateErrorMetadata(contentType);
  }
}

/**
 * Wrapper for page components that need dictionary
 * Ensures dictionary is available even if other props fail
 */
export async function withSafeDictionary<T>(
  params: Promise<{ lang: string; [key: string]: string }>,
  handler: (dictionary: Dictionary, lang: Lang, params: any) => Promise<T>
): Promise<T | null> {
  let lang: Lang;
  let resolvedParams: any;
  
  try {
    resolvedParams = await params;
    lang = resolvedParams.lang as Lang;
  } catch {
    lang = DEFAULT_LANG;
    resolvedParams = { lang };
  }

  const dictionary = getDictionary(lang);
  
  try {
    return await handler(dictionary, lang, resolvedParams);
  } catch (error) {
    console.error('Error in component handler:', error);
    return null;
  }
}