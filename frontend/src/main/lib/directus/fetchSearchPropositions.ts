// src/main/lib/directus/fetchSearchPropositions.ts

import { DIRECTUS_URL, MAX_SEARCH_PROPOSITIONS } from "./directusConstants";
import { Lang } from '../dictionary';
import { SearchResult, AuthorSearchResult, CategorySearchResult, ArticleSearchResult } from "./directusInterfaces";

export async function fetchSearchPropositions(search: string, lang: Lang): Promise<SearchResult[]> {
  try {
    const results: SearchResult[] = [];

    // 1. Search for authors
    const authorsFilter = {
      translations: {
        _filter: {
          languages_code: { _eq: lang },
          name: { _icontains: search }
        }
      }
    };

    const authorsUrl = `${DIRECTUS_URL}/items/authors?fields=slug,translations.name,translations.bio&filter=${encodeURIComponent(JSON.stringify(authorsFilter))}&limit=2`;
    const authorsResponse = await fetch(authorsUrl, { cache: 'no-store' });
    
    if (authorsResponse.ok) {
      const authorsData = await authorsResponse.json();
      
      for (const author of authorsData.data) {
        const translation = author.translations?.[0];
        if (translation) {
          // Count articles by this author
          const countUrl = `${DIRECTUS_URL}/items/articles_authors?filter[authors_slug][_eq]=${author.slug}&aggregate[count]=*`;
          const countResponse = await fetch(countUrl, { cache: 'no-store' });
          const countData = await countResponse.json();
          const articleCount = countData.data?.[0]?.count || 0;

          results.push({
            type: 'author',
            slug: author.slug,
            name: translation.name,
            bio: translation.bio,
            articleCount
          } as AuthorSearchResult);
        }
      }
    }

    // 2. Search for categories
    const categoriesFilter = {
      translations: {
        _filter: {
          languages_code: { _eq: lang },
          name: { _icontains: search }
        }
      }
    };

    const categoriesUrl = `${DIRECTUS_URL}/items/categories?fields=slug,translations.name&filter=${encodeURIComponent(JSON.stringify(categoriesFilter))}&limit=2`;
    const categoriesResponse = await fetch(categoriesUrl, { cache: 'no-store' });
    
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      
      for (const category of categoriesData.data) {
        const translation = category.translations?.[0];
        if (translation) {
          // Count articles in this category
          const countUrl = `${DIRECTUS_URL}/items/articles_categories?filter[categories_slug][_eq]=${category.slug}&aggregate[count]=*`;
          const countResponse = await fetch(countUrl, { cache: 'no-store' });
          const countData = await countResponse.json();
          const articleCount = countData.data?.[0]?.count || 0;

          results.push({
            type: 'category',
            slug: category.slug,
            name: translation.name,
            articleCount
          } as CategorySearchResult);
        }
      }
    }

    // 3. Search for articles (existing logic with enhanced filter)
    const articlesFilter = {
      _and: [
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

    const articlesFields = [
      'slug',
      'rubric_slug.slug',
      'translations.languages_code',
      'translations.title',
      'translations.description'
    ].join(',');

    const articlesUrl = `${DIRECTUS_URL}/items/articles?fields=${articlesFields}&filter=${encodeURIComponent(JSON.stringify(articlesFilter))}&limit=${MAX_SEARCH_PROPOSITIONS - results.length}`;
    const articlesResponse = await fetch(articlesUrl, { cache: 'no-store' });
    
    if (articlesResponse.ok) {
      const articlesData = await articlesResponse.json();
      
      for (const item of articlesData.data) {
        const translation = item.translations?.find((t: any) => t.languages_code === lang);
        if (translation) {
          results.push({
            type: 'article',
            slug: item.slug,
            title: translation.title || '',
            description: translation.description || '',
            rubric_slug: item.rubric_slug?.slug || '',
            languages_code: translation.languages_code
          } as ArticleSearchResult);
        }
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching search propositions:', error);
    return [];
  }
}