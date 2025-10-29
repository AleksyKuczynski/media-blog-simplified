// frontend/src/main/components/Article/ArticleEngagementWrapper.tsx
// SERVER COMPONENT: Fetches initial engagement data directly from Directus
// FIXED: No longer loops through API route, fetches directly for reliability

import ArticleEngagement from './ArticleEngagement';
import type { EngagementData } from '@/main/lib/engagement/engagementService';

interface ArticleEngagementWrapperProps {
  slug: string;
  title: string;
  url: string;
  className?: string;
}

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

/**
 * Fetch engagement data directly from Directus (server-side)
 * FIXED: No longer uses API route, fetches directly for better reliability
 */
async function fetchEngagementSSR(slug: string): Promise<EngagementData> {
  try {
    if (!DIRECTUS_API_TOKEN || !DIRECTUS_URL) {
      console.error('❌ SSR: Missing DIRECTUS_URL or DIRECTUS_API_TOKEN');
      return {
        slug,
        views: 0,
        likes: 0,
        shares: 0,
      };
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
      cache: 'no-store', // Always get fresh data
      next: { revalidate: 0 }, // Don't cache in Next.js
    });

    if (!response.ok) {
      console.error('❌ SSR: Directus API error:', response.status);
      // Return defaults but log the error
      return {
        slug,
        views: 0,
        likes: 0,
        shares: 0,
      };
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

    // No record exists yet - return zeros
    console.log('ℹ️ SSR: No engagement record found for:', slug);
    return {
      slug,
      views: 0,
      likes: 0,
      shares: 0,
    };
  } catch (error) {
    console.error('❌ SSR: Error fetching engagement:', error);
    return {
      slug,
      views: 0,
      likes: 0,
      shares: 0,
    };
  }
}

/**
 * ArticleEngagementWrapper - Server component
 * 
 * FIXED: Fetches directly from Directus instead of looping through API
 * 
 * Responsibilities:
 * 1. Fetch initial engagement data from Directus (SSR)
 * 2. Pass data to client component
 * 
 * Benefits:
 * - No HTTP roundtrip to own API (faster, more reliable)
 * - Proper SSR pattern
 * - SEO-friendly (engagement data in HTML)
 * - Progressive enhancement (works without JS)
 */
export default async function ArticleEngagementWrapper({
  slug,
  title,
  url,
  className,
}: ArticleEngagementWrapperProps) {
  // Fetch initial engagement data directly from Directus
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