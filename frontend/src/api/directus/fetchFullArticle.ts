// src/api/directus/fetchFullArticle.ts

import { FullArticle, ArticleBlock, fetchAuthorsForArticle, fetchCategoriesForArticle } from "./index";
import { Lang } from "@/config/i18n";

const DIRECTUS_URL = process.env.DIRECTUS_URL;

export async function fetchFullArticle(
  slug: string, 
  lang: Lang,
  includesDrafts: boolean = false // NEW PARAMETER
): Promise<FullArticle | null> {
  try {
    const fields = [
      'slug',
      'status',
      'layout',
      'published_at',
      'updated_at',
      'external_link',
      'article_heading_img',
      'rubric_slug.slug',
      'rubric_slug.nav_icon',
      'translations.languages_code',
      'translations.title',
      'translations.description',
      'translations.lead',
      'translations.body.item.*',
    ].join(',');

    // Build status filter based on preview mode
    const statusFilter = includesDrafts 
      ? { status: { _in: ['published', 'draft'] } }
      : { status: { _eq: 'published' } };

    const filter = {
      slug: { _eq: slug },
      ...statusFilter,
    };

    const deepFilter = {
      translations: {
        _filter: {
          languages_code: { _eq: lang }
        }
      }
    };

    const encodedFilter = encodeURIComponent(JSON.stringify(filter));
    const encodedDeepFilter = encodeURIComponent(JSON.stringify(deepFilter));

    const url = `${DIRECTUS_URL}/items/articles?filter=${encodedFilter}&fields=${fields}&deep=${encodedDeepFilter}`;

    const response = await fetch(url, { 
      // In preview mode, bypass cache
      cache: includesDrafts ? 'no-store' : 'default',
      next: includesDrafts ? undefined : { 
        revalidate: 3600,
        tags: ['article', 'stable']
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return null;
    }

    const article = data.data[0];
    const translation = article.translations[0];

    if (!translation) {
      return null;
    }

    // Process article body
    const articleBody: ArticleBlock[] = translation.body.map((block: any) => ({
      collection: 'block_markdown',
      item: {
        id: block.item.id,
        content: block.item.text
      }
    }));

    // Fetch authors and categories
    const authors = await fetchAuthorsForArticle(slug, lang);
    const categories = await fetchCategoriesForArticle(slug, lang);
    
    const fullArticle: FullArticle = {
      slug: article.slug,
      status: article.status,
      layout: article.layout || 'regular',
      published_at: article.published_at,
      updated_at: article.updated_at,
      external_link: article.external_link,
      article_heading_img: article.article_heading_img,
      rubric_slug: {
        slug: article.rubric_slug?.slug || '',
        nav_icon: article.rubric_slug?.nav_icon
      },
      translations: [{
        languages_code: translation.languages_code,
        title: translation.title,
        description: translation.description,
        lead: translation.lead,
        seo_title: translation.seo_title,
        seo_description: translation.seo_description,
        article_body: articleBody
      }],
      authors: authors.length > 0 ? authors : [{ name: 'Editorial Team', slug: '' }],
      categories: categories || [],
    };

    return fullArticle;
  } catch (error) {
    return null;
  }
}