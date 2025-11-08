// src/main/lib/directus/fetchRelatedArticles.ts

import { DIRECTUS_URL } from "./index";
import { Lang } from '../dictionary/types';

/**
 * Article with category matching information
 */
export interface RelatedArticleInfo {
  slug: string;
  title: string;
  published_at: string;
  layout: string;
  rubric_slug: string;
  article_heading_img?: string;
  categories: Array<{ slug: string; name: string }>;
  matchTier: 1 | 2 | 3; // 1 = all categories match, 2 = 2/3 match, 3 = 1/3 match
  matchCount: number;
}

/**
 * Fetch related articles based on tiered category matching
 * 
 * Algorithm:
 * 1. Find articles sharing categories with current article
 * 2. Calculate match score (how many categories match)
 * 3. Group into tiers: Tier 1 (all match), Tier 2 (2+ match), Tier 3 (1+ match)
 * 4. Within each tier, sort by published_at DESC
 * 5. Exclude current article
 * 6. Deduplicate
 * 
 * @param currentArticleSlug - Current article to exclude
 * @param articleCategories - Categories of current article
 * @param lang - Language code
 * @returns Array of related articles sorted by relevance and date
 */
export async function fetchRelatedArticles(
  currentArticleSlug: string,
  articleCategories: Array<{ slug: string; name: string }>,
  lang: Lang
): Promise<RelatedArticleInfo[]> {
  try {
    // If no categories, return empty array
    if (!articleCategories || articleCategories.length === 0) {
      console.log('fetchRelatedArticles: No categories provided');
      return [];
    }

    const categorySlugs = articleCategories.map(c => c.slug);
    console.log('fetchRelatedArticles: Looking for articles with categories:', categorySlugs);

    // Step 1: Query junction table to find all articles with ANY of these categories
    const junctionFilter = {
      categories_slug: {
        _in: categorySlugs
      }
    };
    const encodedJunctionFilter = encodeURIComponent(JSON.stringify(junctionFilter));
    const junctionUrl = `${DIRECTUS_URL}/items/articles_categories?filter=${encodedJunctionFilter}&fields=articles_slug,categories_slug&limit=-1`;
    
    const junctionResponse = await fetch(junctionUrl, {
      next: { 
        revalidate: 600,
        tags: ['articles', 'related']
      }
    });

    if (!junctionResponse.ok) {
      throw new Error(`Failed to fetch article-category relations. Status: ${junctionResponse.status}`);
    }

    const junctionData = await junctionResponse.json();
    console.log('fetchRelatedArticles: Found junction entries:', junctionData.data.length);

    // Step 2: Group by article slug and count category matches
    const articleMatchCounts = new Map<string, { categories: string[], count: number }>();
    
    for (const entry of junctionData.data) {
      const articleSlug = entry.articles_slug;
      
      // Skip current article
      if (articleSlug === currentArticleSlug) {
        continue;
      }

      if (!articleMatchCounts.has(articleSlug)) {
        articleMatchCounts.set(articleSlug, { categories: [], count: 0 });
      }

      const matchData = articleMatchCounts.get(articleSlug)!;
      matchData.categories.push(entry.categories_slug);
      matchData.count = matchData.categories.filter(cat => categorySlugs.includes(cat)).length;
    }

    console.log('fetchRelatedArticles: Articles with matches:', articleMatchCounts.size);

    if (articleMatchCounts.size === 0) {
      return [];
    }

    // Step 3: Fetch full article data for matched articles
    const matchedArticleSlugs = Array.from(articleMatchCounts.keys());
    const articlesFilter = {
      slug: {
        _in: matchedArticleSlugs
      },
      status: {
        _eq: 'published'
      }
    };
    const encodedArticlesFilter = encodeURIComponent(JSON.stringify(articlesFilter));
    const articlesUrl = `${DIRECTUS_URL}/items/articles?filter=${encodedArticlesFilter}&fields=slug,published_at,layout,rubric_slug.slug,article_heading_img,translations.*&sort=-published_at&limit=-1`;

    const articlesResponse = await fetch(articlesUrl, {
      next: { 
        revalidate: 600,
        tags: ['articles', 'related']
      }
    });

    if (!articlesResponse.ok) {
      throw new Error(`Failed to fetch articles. Status: ${articlesResponse.status}`);
    }

    const articlesData = await articlesResponse.json();
    console.log('fetchRelatedArticles: Fetched article details:', articlesData.data.length);

    // Step 4: For each article, fetch its categories
    const relatedArticles: RelatedArticleInfo[] = [];

    for (const article of articlesData.data) {
      // Get translation for this language
      const translation = article.translations.find((t: any) => t.languages_code === lang);
      if (!translation) {
        continue; // Skip articles without translation
      }

      // Fetch categories for this article
      const articleCategoriesUrl = `${DIRECTUS_URL}/items/articles_categories?filter[articles_slug][_eq]=${article.slug}&fields=categories_slug`;
      const articleCategoriesResponse = await fetch(articleCategoriesUrl, {
        next: { 
          revalidate: 600,
          tags: ['categories']
        }
      });

      if (!articleCategoriesResponse.ok) {
        console.warn(`Failed to fetch categories for article ${article.slug}`);
        continue;
      }

      const articleCategoriesData = await articleCategoriesResponse.json();
      const articleCategorySlugs = articleCategoriesData.data.map((item: any) => item.categories_slug);

      // Fetch category names
      const categories: Array<{ slug: string; name: string }> = [];
      for (const catSlug of articleCategorySlugs) {
        const categoryTranslationUrl = `${DIRECTUS_URL}/items/categories_translations?filter[categories_slug][_eq]=${catSlug}&filter[languages_code][_eq]=${lang}&fields=name`;
        const categoryTranslationResponse = await fetch(categoryTranslationUrl, {
          next: { 
            revalidate: 3600,
            tags: ['categories']
          }
        });

        if (categoryTranslationResponse.ok) {
          const categoryTranslationData = await categoryTranslationResponse.json();
          const categoryName = categoryTranslationData.data[0]?.name || catSlug;
          categories.push({ slug: catSlug, name: categoryName });
        }
      }

      // Calculate match count and tier
      const matchData = articleMatchCounts.get(article.slug);
      const matchCount = matchData?.count || 0;
      
      // Determine tier based on percentage match (scales for 1-5 categories)
      let matchTier: 1 | 2 | 3;
      const totalCategories = categorySlugs.length;
      
      if (matchCount === totalCategories) {
        // Tier 1: ALL categories match (100%)
        matchTier = 1;
      } else if (matchCount > Math.floor(totalCategories / 2)) {
        // Tier 2: MAJORITY match (>50%)
        // Examples: 4/5, 3/5 | 3/4 | 2/3
        matchTier = 2;
      } else {
        // Tier 3: MINORITY match (≤50%, but at least 1)
        // Examples: 2/5, 1/5 | 2/4, 1/4 | 1/3 | 1/2
        matchTier = 3;
      }

      relatedArticles.push({
        slug: article.slug,
        title: translation.title,
        published_at: article.published_at,
        layout: article.layout || 'regular',
        rubric_slug: article.rubric_slug?.slug || '',
        article_heading_img: article.article_heading_img,
        categories,
        matchTier,
        matchCount
      });
    }

    console.log('fetchRelatedArticles: Processed articles:', relatedArticles.length);

    // Step 5: Sort by tier (1 → 2 → 3) then by date DESC
    relatedArticles.sort((a, b) => {
      // First, sort by tier (lower tier number = better match)
      if (a.matchTier !== b.matchTier) {
        return a.matchTier - b.matchTier;
      }
      // Within same tier, sort by date (newest first)
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

    console.log('fetchRelatedArticles: Returning', relatedArticles.length, 'sorted articles');
    
    // Log tier distribution for debugging
    const tier1Count = relatedArticles.filter(a => a.matchTier === 1).length;
    const tier2Count = relatedArticles.filter(a => a.matchTier === 2).length;
    const tier3Count = relatedArticles.filter(a => a.matchTier === 3).length;
    console.log(`Tier distribution - Tier 1: ${tier1Count}, Tier 2: ${tier2Count}, Tier 3: ${tier3Count}`);

    return relatedArticles;

  } catch (error) {
    console.error('Error in fetchRelatedArticles:', error);
    return []; // Return empty array on error (component will not render)
  }
}