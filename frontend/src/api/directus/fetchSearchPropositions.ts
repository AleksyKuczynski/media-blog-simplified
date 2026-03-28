// src/api/directus/fetchSearchPropositions.ts

import { DIRECTUS_URL, MAX_SEARCH_PROPOSITIONS } from "../../config/constants/directusConstants";
import { Lang } from "@/config/i18n";
import { SearchResult, AuthorSearchResult, CategorySearchResult, ArticleSearchResult } from "./directusInterfaces";

export async function fetchSearchPropositions(search: string, lang: Lang): Promise<SearchResult[]> {
  try {
    const results: SearchResult[] = [];

    // 1. Search for authors via translations table
    const authorTranslationsUrl = `${DIRECTUS_URL}/items/authors_translations?filter[languages_code][_eq]=${lang}&filter[name][_icontains]=${encodeURIComponent(search)}&fields=authors_slug,name,bio&limit=3`;
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

        results.push({
          type: 'author',
          slug: authorSlug,
          name: translation.name,
          bio: translation.bio,
          articleCount
        } as AuthorSearchResult);
      }
    }

    // 2. Search for categories via translations table
    const categoryTranslationsUrl = `${DIRECTUS_URL}/items/categories_translations?filter[languages_code][_eq]=${lang}&filter[name][_icontains]=${encodeURIComponent(search)}&fields=categories_slug,name&limit=3`;
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

        results.push({
          type: 'category',
          slug: categorySlug,
          name: translation.name,
          articleCount
        } as CategorySearchResult);
      }
    }

    // 3. Search for articles with all SEO fields
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

    const remainingLimit = Math.max(1, MAX_SEARCH_PROPOSITIONS - results.length);
    const articlesUrl = `${DIRECTUS_URL}/items/articles?fields=${articlesFields}&filter=${encodeURIComponent(JSON.stringify(articlesFilter))}&limit=${remainingLimit}`;
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