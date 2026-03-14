// frontend/src/api/directus/fetchFullArticle.ts

import { FullArticle, ArticleBlock, fetchCategoriesForArticle } from "./index";
import { fetchArticleContributors } from './fetchArticleContributors'; // CHANGED
import { Lang } from "@/config/i18n";

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const PREVIEW_SECRET = process.env.PREVIEW_SECRET;

export async function fetchFullArticle(
  slug: string, 
  lang: Lang,
  includesDrafts: boolean = false
): Promise<FullArticle | null> {
  try {
    const fields = [
      // Base article fields
      'slug',
      'status',
      'layout',
      'published_at',
      'updated_at',
      'external_link',
      'article_heading_img',
      'toc',
      
      // Rubric fields
      'rubric_slug.slug',
      'rubric_slug.nav_icon',
      
      // Translation fields
      'translations.languages_code',
      'translations.title',
      'translations.description',
      'translations.lead',
      'translations.body.item.*',
      
      // SEO fields
      'translations.meta_title',
      'translations.meta_description',
      'translations.og_title',
      'translations.og_description',
      'translations.focus_keyword',
      'translations.meta_keywords',
      'translations.yandex_description',
      
      // Content metrics
      'translations.reading_time',
      'translations.word_count',
      'translations.excerpt',
      
      // Local slug
      'translations.local_slug',
    ].join(',');

    const statusFilter = includesDrafts 
      ? {}
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

    // Fetch contributors and categories in parallel
    const [contributors, categories] = await Promise.all([
      fetchArticleContributors(slug, lang),
      fetchCategoriesForArticle(slug, lang),
    ]);
    
    const fullArticle: FullArticle = {
      slug: article.slug,
      status: article.status,
      layout: article.layout || 'regular',
      published_at: article.published_at,
      updated_at: article.updated_at,
      external_link: article.external_link,
      article_heading_img: article.article_heading_img,
      toc: article.toc,
      rubric_slug: {
        slug: article.rubric_slug?.slug || '',
        nav_icon: article.rubric_slug?.nav_icon
      },
      translations: [{
        languages_code: translation.languages_code,
        title: translation.title,
        description: translation.description,
        lead: translation.lead,
        article_body: articleBody,
        
        // SEO fields
        seo_title: translation.seo_title,
        seo_description: translation.seo_description,
        og_title: translation.og_title,
        og_description: translation.og_description,
        focus_keyword: translation.focus_keyword,
        meta_keywords: translation.meta_keywords,
        yandex_description: translation.yandex_description,
        
        // Content metrics
        reading_time: translation.reading_time,
        word_count: translation.word_count,
        excerpt: translation.excerpt,
        
        local_slug: translation.local_slug,
      }],
      categories: categories || [],
      authorsWithDetails: contributors.authorsWithDetails.length > 0 ? contributors.authorsWithDetails : [
        { 
          name: 'Editorial Team', 
          slug: '', 
          avatar: '', 
          bio: '',
          is_author: true,
          is_illustrator: false,
        }
      ],
      illustratorWithDetails: contributors.illustratorWithDetails,
    };

    return fullArticle;
  } catch (error) {
    console.error('Error in fetchFullArticle:', error);
    return null;
  }
}