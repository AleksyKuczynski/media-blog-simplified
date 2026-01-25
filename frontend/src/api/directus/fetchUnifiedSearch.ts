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

    // 1. Search for authors
    const authorTranslationsUrl = `${DIRECTUS_URL}/items/authors_translations?filter[languages_code][_eq]=${lang}&filter[name][_icontains]=${encodeURIComponent(search)}&fields=authors_slug,name,bio&limit=-1`;
    const authorTranslationsResponse = await fetch(authorTranslationsUrl, { cache: 'no-store' });
    
    if (authorTranslationsResponse.ok) {
      const authorTranslationsData = await authorTranslationsResponse.json();
      
      for (const translation of authorTranslationsData.data) {
        const authorSlug = translation.authors_slug;
        
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
          articleCount
        });
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

    // 3. Search for articles with pagination
    // First get total count
    const countFilter = {
      _and: [
        {
          status: { _eq: 'published' }
        },
        {
          translations: {
            languages_code: {
              _eq: lang
            }
          }
        },
        {
          _or: [
            { "translations": { "title": { "_icontains": search } } },
            { "translations": { "description": { "_icontains": search } } },
            { "translations": { "meta_title": { "_icontains": search } } },
            { "translations": { "meta_description": { "_icontains": search } } }
          ]
        }
      ]
    };

    const countUrl = `${DIRECTUS_URL}/items/articles?filter=${encodeURIComponent(JSON.stringify(countFilter))}&aggregate[count]=*`;
    const countResponse = await fetch(countUrl, { cache: 'no-store' });
    const countData = await countResponse.json();
    results.totalArticles = countData.data?.[0]?.count || 0;

    // Fetch paginated articles
    const offset = (page - 1) * RESULTS_PER_PAGE;
    const articlesFields = [
      'slug',
      'rubric_slug.slug',
      'published_at',
      'translations.languages_code',
      'translations.title',
      'translations.description'
    ].join(',');

    const deepFilter = encodeURIComponent(JSON.stringify({
      translations: {
        _filter: {
          languages_code: { _eq: lang }
        }
      }
    }));

    const articlesUrl = `${DIRECTUS_URL}/items/articles?fields=${articlesFields}&filter=${encodeURIComponent(JSON.stringify(countFilter))}&deep=${deepFilter}&sort=-published_at&limit=${RESULTS_PER_PAGE}&offset=${offset}`;
    const articlesResponse = await fetch(articlesUrl, { cache: 'no-store' });
    
    if (articlesResponse.ok) {
      const articlesData = await articlesResponse.json();
      
      for (const item of articlesData.data) {
        const translation = item.translations?.find((t: any) => t.languages_code === lang);
        if (translation) {
          results.articles.push({
            type: 'article',
            slug: item.slug,
            title: translation.title || '',
            description: translation.description || '',
            rubric_slug: item.rubric_slug?.slug || '',
            languages_code: translation.languages_code
          });
        }
      }
    }

    results.totalResults = results.totalArticles + results.totalAuthors + results.totalCategories;
    results.hasMore = (page * RESULTS_PER_PAGE) < results.totalArticles;

    return results;
  } catch (error) {
    console.error('Error fetching unified search results:', error);
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