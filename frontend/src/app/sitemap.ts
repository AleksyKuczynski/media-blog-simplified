// src/app/sitemap.ts

import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/constants/constants';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

const LANGS = ['ru', 'en'] as const;

const authHeaders: HeadersInit | undefined = DIRECTUS_API_TOKEN
  ? { Authorization: `Bearer ${DIRECTUS_API_TOKEN}` }
  : undefined;

interface ArticleTranslation {
  languages_code: string;
  local_slug: string | null;
}

interface DirectusArticle {
  slug: string;
  published_at: string;
  date_updated: string;
  rubric_slug?: string;
  translations: ArticleTranslation[];
}

interface SlugItem {
  slug: string;
}

interface DirectusResponse<T> {
  data: T[];
}

async function fetchCollection<T>(
  collection: string,
  fields: string,
  filter?: object
): Promise<T[]> {
  try {
    let url = `${DIRECTUS_URL}/items/${collection}?fields=${fields}&limit=-1`;
    if (filter) url += `&filter=${encodeURIComponent(JSON.stringify(filter))}`;
    console.log(`[sitemap] fetching ${url}`);
    const res = await fetch(url, {
      headers: authHeaders,
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`[sitemap] ${collection} fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const json: DirectusResponse<T> = await res.json();
    console.log(`[sitemap] ${collection} returned ${json.data?.length ?? 0} items`);
    return json.data ?? [];
  } catch (e) {
    console.error(`[sitemap] ${collection} exception:`, e);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, rubrics, authors, categories] = await Promise.all([
    fetchCollection<DirectusArticle>(
      'articles',
      'slug,published_at,date_updated,rubric_slug,translations.languages_code,translations.local_slug',
      { status: { _eq: 'published' } }
    ),
    fetchCollection<SlugItem>('rubrics', 'slug'),
    fetchCollection<SlugItem>('authors', 'slug'),
    fetchCollection<SlugItem>('categories', 'slug'),
  ]);

  const staticPages: MetadataRoute.Sitemap = LANGS.flatMap((lang) => [
    {
      url: `${SITE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/${lang}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/${lang}/rubrics`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/${lang}/authors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/${lang}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/${lang}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/${lang}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]);

  // Individual rubric listing pages: /{lang}/{rubricSlug}
  const rubricPages: MetadataRoute.Sitemap = LANGS.flatMap((lang) =>
    rubrics.map((r) => ({
      url: `${SITE_URL}/${lang}/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  // One URL per translation — only include translations that have a local_slug (the public URL slug)
  const articlePages: MetadataRoute.Sitemap = articles.flatMap((article) =>
    article.translations
      .filter((t) => t.local_slug)
      .map((t) => ({
        url: `${SITE_URL}/${t.languages_code}/${article.rubric_slug ?? 'articles'}/${t.local_slug}`,
        lastModified: new Date(article.date_updated || article.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
  );

  const authorPages: MetadataRoute.Sitemap = LANGS.flatMap((lang) =>
    authors.map((a) => ({
      url: `${SITE_URL}/${lang}/authors/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  const categoryPages: MetadataRoute.Sitemap = LANGS.flatMap((lang) =>
    categories.map((c) => ({
      url: `${SITE_URL}/${lang}/categories/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  );

  return [
    ...staticPages,
    ...rubricPages,
    ...articlePages,
    ...authorPages,
    ...categoryPages,
  ];
}