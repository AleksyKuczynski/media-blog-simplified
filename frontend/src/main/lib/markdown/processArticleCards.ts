// src/main/lib/markdown/processArticleCards.ts

import { ContentChunk, ArticleCardData } from './markdownTypes';
import { validateArticleSlug } from '../utils/validateArticleSlug';
import { fetchArticleCard } from '../directus/fetchArticleCard';
import { DIRECTUS_URL } from '../directus/directusConstants';

/**
 * Process markdown chunks to extract article slug placeholders and create article-card chunks
 * 
 * Process:
 * 1. Find all article slug placeholders in markdown
 * 2. Validate slugs (check if articles exist)
 * 3. Fetch article card data for valid slugs
 * 4. Split chunks to insert article-card chunks between markdown sections
 * 5. Remove invalid slug markers silently
 */
export async function processArticleCards(chunks: ContentChunk[]): Promise<ContentChunk[]> {
  const processedChunks: ContentChunk[] = [];
  const lang = 'ru'; // Default language for backward compatibility
  
  // Cache to avoid fetching same article multiple times
  const articleDataCache = new Map<string, ArticleCardData | null>();
  
  for (const chunk of chunks) {
    if (chunk.type === 'markdown' && chunk.content) {
      // Find all article slug markers in this chunk
      const slugMarkerRegex = /<span data-article-slug="([^"]+)" data-slug-placeholder="true"><\/span>/g;
      const matches = [...chunk.content.matchAll(slugMarkerRegex)];
      
      if (matches.length === 0) {
        // No article slugs in this chunk, keep as-is
        processedChunks.push(chunk);
        continue;
      }
      
      // Split content by article slug markers
      let lastIndex = 0;
      const parts: Array<{ type: 'text' | 'slug'; content: string }> = [];
      
      for (const match of matches) {
        // Add text before marker
        if (match.index! > lastIndex) {
          parts.push({
            type: 'text',
            content: chunk.content.substring(lastIndex, match.index)
          });
        }
        
        // Add slug marker
        parts.push({
          type: 'slug',
          content: match[1] // The slug from data-article-slug attribute
        });
        
        lastIndex = match.index! + match[0].length;
      }
      
      // Add remaining text after last marker
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
                  
                  articleDataCache.set(slug, {
                    slug: articleCard.slug,
                    title: translation.title,
                    description: translation.description,
                    imageSrc,
                    rubricSlug: articleCard.rubric_slug,
                    publishedAt: articleCard.published_at,
                    layout: articleCard.layout
                  });
                } else {
                  // Invalid article data
                  articleDataCache.set(slug, null);
                }
              } catch (error) {
                console.error(`Error fetching article card for slug ${slug}:`, error);
                articleDataCache.set(slug, null);
              }
            } else {
              // Invalid slug
              articleDataCache.set(slug, null);
            }
          }
          
          // Add article-card chunk if data exists
          const articleData = articleDataCache.get(slug);
          if (articleData) {
            processedChunks.push({
              type: 'article-card',
              articleCardData: articleData
            });
          }
          // If article data is null, we silently skip (don't render anything)
        }
      }
    } else {
      // Non-markdown chunks pass through unchanged
      processedChunks.push(chunk);
    }
  }
  
  return processedChunks;
}