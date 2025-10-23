// src/app/sitemap.ts

import { MetadataRoute } from 'next';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;
const SITE_URL = process.env.SITE_URL

interface DirectusArticle {
  slug: string;
  published_at: string;
  date_updated: string;
  rubric_slug?: {
    slug: string;
  };
}

interface DirectusResponse {
  data: DirectusArticle[];
}

async function fetchAllArticles(): Promise<DirectusArticle[]> {
  try {
    const fields = [
      'slug',
      'published_at',
      'date_updated',
      'rubric_slug.slug',
    ].join(',');

    const filter = encodeURIComponent(
      JSON.stringify({
        status: { _eq: 'published' },
      })
    );

    const url = `${DIRECTUS_URL}/items/articles?fields=${fields}&filter=${filter}&limit=-1`;

    const response = await fetch(url, {
      headers: DIRECTUS_API_TOKEN
        ? { Authorization: `Bearer ${DIRECTUS_API_TOKEN}` }
        : undefined,
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      console.error('Failed to fetch articles for sitemap');
      return [];
    }

    const data: DirectusResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await fetchAllArticles();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/ru`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/ru/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ru/rubrics`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ru/authors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ru/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // Dynamic article pages
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/ru/${article.rubric_slug?.slug || 'articles'}/${article.slug}`,
    lastModified: new Date(article.date_updated || article.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages];
}