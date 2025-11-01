// frontend/src/main/components/Article/Engagement/ArticleEngagementWrapper.tsx
/**
 * Article Engagement Wrapper - Server Component
 * 
 * SIMPLIFIED: Just fetches data and passes to client component
 * - No render props (fixes server/client boundary issue)
 * - ArticleEngagement handles its own rendering
 */

import ArticleEngagement from './ArticleEngagement';
import type { EngagementData } from '@/main/lib/engagement';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export interface ArticleEngagementWrapperProps {
  slug: string;
  title: string;
  url: string;
  className?: string;
}

/**
 * Fetch engagement data directly from Directus (server-side)
 */
async function fetchEngagementSSR(slug: string): Promise<EngagementData> {
  try {
    if (!DIRECTUS_API_TOKEN || !DIRECTUS_URL) {
      console.error('❌ SSR: Missing DIRECTUS_URL or DIRECTUS_API_TOKEN');
      return { slug, views: 0, likes: 0, shares: 0 };
    }

    const filter = encodeURIComponent(
      JSON.stringify({ article_slug: { _eq: slug } })
    );
    const url = `${DIRECTUS_URL}/items/articles_engagement?filter=${filter}&limit=1`;

    console.log('🔍 SSR: Fetching engagement for:', slug);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_API_TOKEN}`,
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error('❌ SSR: Directus API error:', response.status);
      return { slug, views: 0, likes: 0, shares: 0 };
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const record = data.data[0];
      console.log('✅ SSR: Engagement data loaded:', {
        slug,
        views: record.view_count,
        likes: record.like_count,
        shares: record.share_count,
      });

      return {
        slug: record.article_slug,
        views: record.view_count || 0,
        likes: record.like_count || 0,
        shares: record.share_count || 0,
      };
    }

    console.log('ℹ️ SSR: No engagement record found for:', slug);
    return { slug, views: 0, likes: 0, shares: 0 };
  } catch (error) {
    console.error('❌ SSR: Error fetching engagement:', error);
    return { slug, views: 0, likes: 0, shares: 0 };
  }
}

/**
 * Article Engagement Wrapper - Server Component
 * 
 * SIMPLIFIED ARCHITECTURE:
 * - Fetches initial data from Directus (SSR)
 * - Passes data as props to ArticleEngagement client component
 * - No render props = works across server/client boundary
 */
export default async function ArticleEngagementWrapper({
  slug,
  title,
  url,
  className,
}: ArticleEngagementWrapperProps) {
  const initialEngagement = await fetchEngagementSSR(slug);

  return (
    <ArticleEngagement
      slug={slug}
      title={title}
      url={url}
      initialEngagement={initialEngagement}
      className={className}
    />
  );
}