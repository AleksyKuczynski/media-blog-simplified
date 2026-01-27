// src/api/directus/fetchUnifiedSearch.ts

import { DIRECTUS_URL } from "./directusConstants";
import { Lang } from "@/config/i18n";
import { SearchResult, AuthorSearchResult, CategorySearchResult, ArticleSearchResult } from "./directusInterfaces";

const RESULTS_PER_PAGE = 10;

export interface UnifiedSearchResults {
  articles: ArticleSearchResult[];
  authors: AuthorSearchResult[];
  categories: CategorySearchResult[];
  totalArticles: number;
  totalAuthors: number;
  totalCategories: number;
  totalResults: number;
  hasMore: boolean;
}

/**
 * Fetch unified search results with pagination
 * Returns all result types grouped by type
 */
export async function fetchUnifiedSearch(
  search: string,
  lang: Lang,
  page: number = 1
): Promise<UnifiedSearchResults> {
  try {
    const results: UnifiedSearchResults = {
      articles: [],
      authors: [],
      categories: [],
      totalArticles: 0,
      totalAuthors: 0,
      totalCategories: 0,
      totalResults: 0,
      hasMore: false
    };

    if (search.length < 3) {
      return results;
    }

    // 1. Search for authors - fetch base author data with roles
    const authorTranslationsUrl = `${DIRECTUS_URL}/items/authors_translations?filter[languages_code][_eq]=${lang}&filter[name][_icontains]=${encodeURIComponent(search)}&fields=authors_slug,name,bio&limit=-1`;
    const authorTranslationsResponse = await fetch(authorTranslationsUrl, { cache: 'no-store' });
    
    if (authorTranslationsResponse.ok) {
      const authorTranslationsData = await authorTranslationsResponse.json();
      const authorSlugs = authorTranslationsData.data.map((t: any) => t.authors_slug);
      
      // Fetch author role information (is_author, is_illustrator)
      if (authorSlugs.length > 0) {
        const authorsUrl = `${DIRECTUS_URL}/items/authors?filter[slug][_in]=${authorSlugs.join(',')}&fields=slug,is_author,is_illustrator`;
        const authorsResponse = await fetch(authorsUrl, { cache: 'no-store' });
        
        if (authorsResponse.ok) {
          const authorsData = await authorsResponse.json();
          
          // Type the API response properly
          interface AuthorApiData {
            slug: string;
            is_author?: boolean;
            is_illustrator?: boolean;
          }
          
          const authorsMap = new Map<string, { is_author: boolean; is_illustrator: boolean }>(
            authorsData.data.map((a: AuthorApiData) => [
              a.slug, 
              { 
                is_author: a.is_author ?? true, 
                is_illustrator: a.is_illustrator ?? false 
              }
            ])
          );
          
          for (const translation of authorTranslationsData.data) {
            const authorSlug = translation.authors_slug;
            const authorRoles = authorsMap.get(authorSlug);
            
            // Skip if no role data found
            if (!authorRoles) continue;
            
            // Count articles by this author
            const countUrl = `${DIRECTUS_URL}/items/articles_authors?filter[authors_slug][_eq]=${authorSlug}&aggregate[count]=*`;
            const countResponse = await fetch(countUrl, { cache: 'no-store' });
            const countData = await countResponse.json();
            const articleCount = countData.data?.[0]?.count || 0;

            results.authors.push({
              type: 'author',
              slug: authorSlug,
              name: translation.name,
              bio: translation.bio,
              articleCount,
              is_author: authorRoles.is_author,
              is_illustrator: authorRoles.is_illustrator,
            });
          }
        }
      }
    }

    results.totalAuthors = results.authors.length;

    // 2. Search for categories
    const categoryTranslationsUrl = `${DIRECTUS_URL}/items/categories_translations?filter[languages_code][_eq]=${lang}&filter[name][_icontains]=${encodeURIComponent(search)}&fields=categories_slug,name&limit=-1`;
    const categoryTranslationsResponse = await fetch(categoryTranslationsUrl, { cache: 'no-store' });
    
    if (categoryTranslationsResponse.ok) {
      const categoryTranslationsData = await categoryTranslationsResponse.json();
      
      for (const translation of categoryTranslationsData.data) {
        const categorySlug = translation.categories_slug;
        
        // Count articles in this category
        const countUrl = `${DIRECTUS_URL}/items/articles_categories?filter[categories_slug][_eq]=${categorySlug}&aggregate[count]=*`;
        const countResponse = await fetch(countUrl, { cache: 'no-store' });
        const countData = await countResponse.json();
        const articleCount = countData.data?.[0]?.count || 0;

        results.categories.push({
          type: 'category',
          slug: categorySlug,
          name: translation.name,
          articleCount
        });
      }
    }

    results.totalCategories = results.categories.length;

    // 3. Search for articles in translations
    const articleTranslationsUrl = `${DIRECTUS_URL}/items/articles_translations?filter[languages_code][_eq]=${lang}&filter[_or][0][title][_icontains]=${encodeURIComponent(search)}&filter[_or][1][description][_icontains]=${encodeURIComponent(search)}&fields=articles_slug,title,description&limit=-1`;
    const articleTranslationsResponse = await fetch(articleTranslationsUrl, { cache: 'no-store' });

    if (articleTranslationsResponse.ok) {
      const articleTranslationsData = await articleTranslationsResponse.json();
      const articleSlugs = articleTranslationsData.data.map((t: any) => t.articles_slug);

      if (articleSlugs.length > 0) {
        const articlesUrl = `${DIRECTUS_URL}/items/articles?filter[slug][_in]=${articleSlugs.join(',')}&filter[status][_eq]=published&fields=slug,rubric_slug.slug&limit=-1`;
        const articlesResponse = await fetch(articlesUrl, { cache: 'no-store' });
        
        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json();
          const articlesMap = new Map<string, string>(
            articlesData.data.map((a: any) => [a.slug, a.rubric_slug?.slug || ''])
          );

          for (const translation of articleTranslationsData.data) {
            const articleSlug = translation.articles_slug;
            const rubricSlug = articlesMap.get(articleSlug);
            
            // Only add articles that have a rubric slug
            if (rubricSlug !== undefined) {
              results.articles.push({
                type: 'article',
                slug: articleSlug,
                title: translation.title,
                description: translation.description,
                rubric_slug: rubricSlug,
                languages_code: lang
              });
            }
          }
        }
      }
    }

    results.totalArticles = results.articles.length;
    results.totalResults = results.totalArticles + results.totalAuthors + results.totalCategories;

    // 4. Apply pagination
    const startIndex = (page - 1) * RESULTS_PER_PAGE;
    const endIndex = startIndex + RESULTS_PER_PAGE;

    // Paginate articles only (authors and categories shown in full)
    results.articles = results.articles.slice(startIndex, endIndex);
    results.hasMore = endIndex < results.totalArticles;

    return results;
  } catch (error) {
    console.error('Error in fetchUnifiedSearch:', error);
    return {
      articles: [],
      authors: [],
      categories: [],
      totalArticles: 0,
      totalAuthors: 0,
      totalCategories: 0,
      totalResults: 0,
      hasMore: false
    };
  }
}