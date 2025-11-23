// frontend/src/main/lib/directus/fetchFullArticle.ts

import { FullArticle, ArticleBlock, fetchAuthorsForArticle, fetchCategoriesForArticle } from "./index";
import { Lang } from '../dictionary';

const DIRECTUS_URL = process.env.DIRECTUS_URL;

export async function fetchFullArticle(
  slugParam: string, 
  lang: Lang,
  includesDrafts: boolean = false
): Promise<FullArticle | null> {
  try {
    // First, try to find by local_slug in translations
    let article = await fetchArticleByLocalSlug(slugParam, lang, includesDrafts);
    
    // If not found, fallback to main slug
    if (!article) {
      article = await fetchArticleByMainSlug(slugParam, lang, includesDrafts);
    }
    
    return article;
  } catch (error) {
    console.error('Error fetching full article:', error);
    return null;
  }
}

const ARTICLE_FIELDS = [
  'slug',
  'status',
  'layout',
  'published_at',
  'updated_at',
  'external_link',
  'article_heading_img',
  'rubric_slug.slug',
  'translations.languages_code',
  'translations.title',
  'translations.description',
  'translations.lead',
  'translations.seo_title',
  'translations.seo_description',
  'translations.local_slug',
  'translations.body.item.*',
].join(',');

/**
 * Fetch article by local_slug in translations table
 */
async function fetchArticleByLocalSlug(
  localSlug: string,
  lang: Lang,
  includesDrafts: boolean
): Promise<FullArticle | null> {
  const statusFilter = includesDrafts 
    ? { status: { _in: ['published', 'draft'] } }
    : { status: { _eq: 'published' } };

  const filter = {
    ...statusFilter,
    translations: {
      _some: {
        local_slug: { _eq: localSlug },
        languages_code: { _eq: lang }
      }
    }
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

  const url = `${DIRECTUS_URL}/items/articles?filter=${encodedFilter}&fields=${ARTICLE_FIELDS}&deep=${encodedDeepFilter}`;

  const response = await fetch(url, { 
    cache: includesDrafts ? 'no-store' : 'default',
    next: includesDrafts ? undefined : { 
      revalidate: 3600,
      tags: ['article', 'stable']
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch article by local_slug. Status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.data || data.data.length === 0) {
    return null;
  }

  return processArticleData(data.data[0], lang);
}

/**
 * Fetch article by main slug (fallback)
 */
async function fetchArticleByMainSlug(
  slug: string,
  lang: Lang,
  includesDrafts: boolean
): Promise<FullArticle | null> {
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

  const url = `${DIRECTUS_URL}/items/articles?filter=${encodedFilter}&fields=${ARTICLE_FIELDS}&deep=${encodedDeepFilter}`;

  const response = await fetch(url, { 
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
    console.log('No article found for slug:', slug);
    return null;
  }

  return processArticleData(data.data[0], lang);
}

/**
 * Process raw article data into FullArticle type
 */
async function processArticleData(
  article: any,
  lang: Lang
): Promise<FullArticle | null> {
  const translation = article.translations[0];

  if (!translation) {
    console.log(`No translation found for article ${article.slug} in language ${lang}`);
    return null;
  }

  const articleBody: ArticleBlock[] = translation.body?.map((block: any) => ({
    collection: 'block_markdown',
    item: {
      id: block.item.id,
      content: block.item.text
    }
  })) || [];

  // Use MAIN slug for fetching related data (it's the DB key)
  const authors = await fetchAuthorsForArticle(article.slug, lang);
  const categories = await fetchCategoriesForArticle(article.slug, lang);
  
  const fullArticle: FullArticle = {
    slug: article.slug,
    status: article.status,
    layout: article.layout || 'regular',
    published_at: article.published_at,
    updated_at: article.updated_at,
    external_link: article.external_link,
    article_heading_img: article.article_heading_img,
    rubric_slug: article.rubric_slug?.slug || '',
    translations: [{
      languages_code: translation.languages_code,
      title: translation.title,
      description: translation.description,
      lead: translation.lead,
      seo_title: translation.seo_title,
      seo_description: translation.seo_description,
      local_slug: translation.local_slug,
      article_body: articleBody
    }],
    authors: authors.length > 0 ? authors : [{ name: 'Editorial Team', slug: '' }],
    categories: categories || [],
  };

  return fullArticle;
}