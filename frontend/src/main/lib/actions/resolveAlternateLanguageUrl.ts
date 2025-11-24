// src/main/lib/actions/resolveAlternateLanguageUrl.ts
'use server'

import { Lang } from '../dictionary'
import { DIRECTUS_URL } from '../directus'

interface AlternateUrlResult {
  url: string | null
  exists: boolean
}

/**
 * Resolves the alternate language URL for current page
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
): Promise<AlternateUrlResult> {
  // Parse path segments
  const segments = currentPath.split('/').filter(Boolean)
  
  // Remove language prefix
  if (segments[0] === currentLang) {
    segments.shift()
  }
  
  // Home page
  if (segments.length === 0) {
    return { url: `/${targetLang}`, exists: true }
  }
  
  // Collection pages (rubrics, authors, search)
  if (segments.length === 1) {
    return { url: `/${targetLang}/${segments[0]}`, exists: true }
  }
  
  // Author page: /authors/{slug}
  if (segments.length === 2 && segments[0] === 'authors') {
    return { url: `/${targetLang}/authors/${segments[1]}`, exists: true }
  }
  
  // Article page: /{rubric}/{slug}
  if (segments.length === 2) {
    const [rubric, slugOrLocalSlug] = segments
    
    // Resolve article slug
    const articleResult = await resolveArticleAlternateUrl(
      rubric,
      slugOrLocalSlug,
      currentLang,
      targetLang
    )
    
    return articleResult
  }
  
  // Fallback: simple path replacement
  return { 
    url: `/${targetLang}/${segments.join('/')}`, 
    exists: false // uncertain
  }
}

/**
 * Resolve article URL with proper local_slug handling
 */
async function resolveArticleAlternateUrl(
  rubric: string,
  slugParam: string,
  currentLang: Lang,
  targetLang: Lang
): Promise<AlternateUrlResult> {
  try {
    // First, resolve the main article slug from current URL
    const mainSlug = await findMainSlugFromParam(slugParam, currentLang)
    
    if (!mainSlug) {
      return { url: null, exists: false }
    }
    
    // Now find the target language slug (local_slug or main slug)
    const targetSlug = await findTargetLanguageSlug(mainSlug, targetLang)
    
    if (!targetSlug) {
      // Article doesn't have translation in target language
      return { url: null, exists: false }
    }
    
    return {
      url: `/${targetLang}/${rubric}/${targetSlug}`,
      exists: true
    }
  } catch (error) {
    console.error('Error resolving article alternate URL:', error)
    return { url: null, exists: false }
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