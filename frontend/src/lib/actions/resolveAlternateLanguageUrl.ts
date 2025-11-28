// src/main/lib/actions/resolveAlternateLanguageUrl.ts
'use server'

import { Lang } from '../../config/i18n'
import { DIRECTUS_URL } from '@/api/directus'

/**
 * Resolves the alternate language URL for current page
 * Always returns a URL - falls back to home page if content doesn't exist
 * 
 * Handles:
 * - Home pages: /{lang}
 * - Collection pages: /{lang}/rubrics, /{lang}/authors
 * - Rubric pages: /{lang}/{rubric}
 * - Author pages: /{lang}/authors/{author}
 * - Article pages: /{lang}/{rubric}/{slug} with local_slug support
 */
export async function resolveAlternateLanguageUrl(
  currentPath: string,
  currentLang: Lang,
  targetLang: Lang
): Promise<string> {
  // Parse path segments
  const segments = currentPath.split('/').filter(Boolean)
  
  // Remove language prefix
  if (segments[0] === currentLang) {
    segments.shift()
  }
  
  // Home page
  if (segments.length === 0) {
    return `/${targetLang}`
  }
  
  // Collection pages (rubrics, authors, search)
  if (segments.length === 1) {
    return `/${targetLang}/${segments[0]}`
  }
  
  // Author page: /authors/{slug}
  if (segments.length === 2 && segments[0] === 'authors') {
    return `/${targetLang}/authors/${segments[1]}`
  }
  
  // Article page: /{rubric}/{slug}
  if (segments.length === 2) {
    const [rubric, slugOrLocalSlug] = segments
    
    // Resolve article slug
    const articleUrl = await resolveArticleAlternateUrl(
      rubric,
      slugOrLocalSlug,
      currentLang,
      targetLang
    )
    
    // Fallback to home if article doesn't exist in target language
    return articleUrl || `/${targetLang}`
  }
  
  // Fallback: home page for unknown routes
  return `/${targetLang}`
}

/**
 * Resolve article URL with proper local_slug handling
 * Returns null if article doesn't exist in target language
 */
async function resolveArticleAlternateUrl(
  rubric: string,
  slugParam: string,
  currentLang: Lang,
  targetLang: Lang
): Promise<string | null> {
  try {
    // First, resolve the main article slug from current URL
    const mainSlug = await findMainSlugFromParam(slugParam, currentLang)
    
    if (!mainSlug) {
      return null
    }
    
    // Now find the target language slug (local_slug or main slug)
    const targetSlug = await findTargetLanguageSlug(mainSlug, targetLang)
    
    if (!targetSlug) {
      // Article doesn't have translation in target language
      return null
    }
    
    return `/${targetLang}/${rubric}/${targetSlug}`
  } catch (error) {
    console.error('Error resolving article alternate URL:', error)
    return null
  }
}

/**
 * Find main article slug from URL parameter
 * The parameter might be either main slug or local_slug
 */
async function findMainSlugFromParam(
  slugParam: string,
  lang: Lang
): Promise<string | null> {
  const normalized = slugParam.normalize('NFC')
  
  // Check if it's a main slug
  const isMainSlug = await checkMainSlugExists(normalized)
  if (isMainSlug) {
    return normalized
  }
  
  // Check if it's a local_slug, get main slug
  return await findMainSlugByLocalSlug(normalized, lang)
}

/**
 * Find the slug to use for target language
 * Priority: local_slug for target lang > main slug
 */
async function findTargetLanguageSlug(
  mainSlug: string,
  targetLang: Lang
): Promise<string | null> {
  try {
    // Query article for target language translation
    const filter = encodeURIComponent(JSON.stringify({
      slug: { _eq: mainSlug },
      status: { _eq: 'published' }
    }))
    
    const deepFilter = encodeURIComponent(JSON.stringify({
      translations: {
        _filter: {
          languages_code: { _eq: targetLang }
        }
      }
    }))
    
    const url = `${DIRECTUS_URL}/items/articles?fields=slug,translations.local_slug&filter=${filter}&deep=${deepFilter}&limit=1`
    
    const response = await fetch(url, {
      next: { revalidate: 3600, tags: ['article'] }
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    
    if (!data.data?.[0]) {
      return null // Article not found
    }
    
    const article = data.data[0]
    const translation = article.translations?.[0]
    
    if (!translation) {
      return null // No translation for target language
    }
    
    // Return local_slug if exists, otherwise main slug
    return translation.local_slug || mainSlug
  } catch (error) {
    console.error('Error finding target language slug:', error)
    return null
  }
}

/**
 * Check if slug exists as main article slug
 */
async function checkMainSlugExists(slug: string): Promise<boolean> {
  try {
    const filter = encodeURIComponent(JSON.stringify({
      slug: { _eq: slug },
      status: { _eq: 'published' }
    }))
    
    const url = `${DIRECTUS_URL}/items/articles?filter=${filter}&fields=slug&limit=1`
    
    const response = await fetch(url, {
      next: { revalidate: 3600, tags: ['article'] }
    })
    
    if (!response.ok) {
      return false
    }
    
    const data = await response.json()
    return data.data?.length > 0
  } catch {
    return false
  }
}

/**
 * Find main article slug by local_slug
 */
async function findMainSlugByLocalSlug(
  localSlug: string,
  lang: Lang
): Promise<string | null> {
  try {
    const filter = encodeURIComponent(JSON.stringify({
      local_slug: { _eq: localSlug },
      languages_code: { _eq: lang }
    }))
    
    const url = `${DIRECTUS_URL}/items/articles_translations?filter=${filter}&fields=articles_slug&limit=1`
    
    const response = await fetch(url, {
      next: { revalidate: 3600, tags: ['article'] }
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.data?.[0]?.articles_slug || null
  } catch (error) {
    console.error('Error finding main slug by local_slug:', error)
    return null
  }
}