// app/[lang]/[rubric]/[slug]/_components/markdown/processArticleCards.ts
/**
 * Article Markdown - Article Card Processing
 * 
 * Validates article slug placeholders and creates article-card chunks.
 * 
 * Process:
 * 1. Find article slug delimiters (___ARTICLE_CARD:slug___)
 * 2. Validate slugs (check if articles exist)
 * 3. Fetch article card data for valid slugs
 * 4. Split chunks to insert article-card chunks
 * 5. Remove invalid slug markers silently
 * 
 * Features:
 * - Slug validation (existence check)
 * - Article data fetching from Directus
 * - Chunk splitting and insertion
 * - Caching to avoid duplicate fetches
 * 
 * Dependencies:
 * - ./markdownTypes (ContentChunk, ArticleCardData)
 * - @/main/lib/utils/validateArticleSlug
 * - @/api/directus/fetchArticleCard
 * - @/main/lib/directus/directusConstants (DIRECTUS_URL)
 * 
 * @param chunks - Markdown content chunks
 * @returns {ContentChunk[]} Chunks with article-card insertions
 */

import { validateArticleSlug } from '@/lib/utils';
import { ContentChunk, ArticleCardData } from './markdownTypes';
import { DIRECTUS_URL, fetchArticleCard } from '@/api/directus';
import { Lang } from '@/config/i18n';

export async function processArticleCards(
  chunks: ContentChunk[],
  lang: Lang
): Promise<ContentChunk[]> {
  const processedChunks: ContentChunk[] = [];
  
  // Cache to avoid fetching same article multiple times
  const articleDataCache = new Map<string, ArticleCardData | null>();
  
  for (const chunk of chunks) {
    if (chunk.type === 'markdown' && chunk.content) {
      // Search for markdown-safe delimiter
      const articleCardRegex = /___ARTICLE_CARD:([a-z0-9\-]+)___/g;
      const matches = [...chunk.content.matchAll(articleCardRegex)];
      
      if (matches.length === 0) {
        // No article slugs in this chunk, keep as-is
        processedChunks.push(chunk);
        continue;
      }
      
      // Split content by article card delimiters
      let lastIndex = 0;
      const parts: Array<{ type: 'text' | 'slug'; content: string }> = [];
      
      for (const match of matches) {
        // Add text before delimiter
        if (match.index! > lastIndex) {
          parts.push({
            type: 'text',
            content: chunk.content.substring(lastIndex, match.index)
          });
        }
        
        // Add slug marker
        parts.push({
          type: 'slug',
          content: match[1] // The slug from ___ARTICLE_CARD:slug___
        });
        
        lastIndex = match.index! + match[0].length;
      }
      
      // Add remaining text after last delimiter
      if (lastIndex < chunk.content.length) {
        parts.push({
          type: 'text',
          content: chunk.content.substring(lastIndex)
        });
      }
      
      // Process parts and fetch article data
      for (const part of parts) {
        if (part.type === 'text') {
          // Regular markdown content
          const trimmedContent = part.content.trim();
          if (trimmedContent) {
            processedChunks.push({
              type: 'markdown',
              content: trimmedContent
            });
          }
        } else {
          // Article slug - validate and fetch data
          const slug = part.content;
          
          // Check cache first
          if (!articleDataCache.has(slug)) {
            // Validate slug exists
            const isValid = await validateArticleSlug(slug);
            
            if (isValid) {
              // Fetch article card data
              try {
                const articleCard = await fetchArticleCard(slug, lang);
                
                if (articleCard && articleCard.translations[0]) {
                  const translation = articleCard.translations[0];
                  const imageSrc = articleCard.article_heading_img
                    ? `${DIRECTUS_URL}/assets/${articleCard.article_heading_img}`
                    : undefined;
                  
                  const articleCardData: ArticleCardData = {
                    slug: articleCard.slug,
                    title: translation.title,
                    description: translation.description,
                    imageSrc,
                    rubricSlug: articleCard.rubric_slug,
                    publishedAt: articleCard.published_at,
                    layout: articleCard.layout
                  };
                  
                  articleDataCache.set(slug, articleCardData);
                } else {
                  // Article not found or no translation
                  articleDataCache.set(slug, null);
                  console.warn(`Article card not found or missing translation: ${slug}`);
                }
              } catch (error) {
                console.error(`Error fetching article card for slug ${slug}:`, error);
                articleDataCache.set(slug, null);
              }
            } else {
              // Invalid slug
              articleDataCache.set(slug, null);
              console.warn(`Invalid article slug: ${slug}`);
            }
          }
          
          // Add article-card chunk if data was fetched successfully
          const cachedData = articleDataCache.get(slug);
          if (cachedData) {
            processedChunks.push({
              type: 'article-card',
              articleCardData: cachedData
            });
          }
          // If invalid or failed to fetch, silently skip (no chunk added)
        }
      }
    } else {
      // Non-markdown chunks pass through unchanged
      processedChunks.push(chunk);
    }
  }
  
  return processedChunks;
}