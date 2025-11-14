// src/main/lib/directus/fetchFullArticle.ts

import { FullArticle, ArticleBlock, DIRECTUS_URL, fetchAuthorsForArticle, fetchCategoriesForArticle } from "./index";
import { Lang } from '../dictionary';

export async function fetchFullArticle(slug: string, lang: Lang): Promise<FullArticle | null> {
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
      'translations.languages_code',
      'translations.title',
      'translations.description',
      'translations.lead',
      'translations.body.item.*',
    ].join(',');

    const deepFilter = encodeURIComponent(JSON.stringify({
      translations: {
        _filter: {
          languages_code: { _eq: lang }
        }
      }
    }));

    const url = `${DIRECTUS_URL}/items/articles?filter[slug][_eq]=${slug}&fields=${fields}&deep=${deepFilter}`;
    const response = await fetch(url, { 
      next: { 
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

    const article = data.data[0];
    const translation = article.translations[0];

    if (!translation) {
      console.log(`No translation found for article ${slug} in language ${lang}`);
      return null;
    }

    // Process the article body
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
      rubric_slug: article.rubric_slug?.slug || '',
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
    console.error('Error fetching full article:', error);
    return null;
  }
}