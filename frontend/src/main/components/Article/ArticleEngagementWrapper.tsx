// frontend/src/main/components/Article/ArticleEngagementWrapper.tsx
// SERVER COMPONENT: Fetches initial engagement data and handles view tracking
// This prevents the initial API call from the client

import ArticleEngagement from './ArticleEngagement';
import type { EngagementData } from '@/main/lib/engagement/engagementService';

interface ArticleEngagementWrapperProps {
  slug: string;
  title: string;
  url: string;
  className?: string;
}

/**
 * Fetch engagement data server-side
 */
async function fetchEngagementSSR(slug: string): Promise<EngagementData> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/engagement/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always get fresh data
    });

    if (!response.ok) {
      console.error('Failed to fetch engagement SSR:', response.status);
      // Return defaults on error
      return {
        slug,
        views: 0,
        likes: 0,
        shares: 0,
      };
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    }

    return {
      slug,
      views: 0,
      likes: 0,
      shares: 0,
    };
  } catch (error) {
    console.error('Error fetching engagement SSR:', error);
    return {
      slug,
      views: 0,
      likes: 0,
      shares: 0,
    };
  }
}

/**
 * Track view server-side (async, doesn't block rendering)
 * This runs AFTER the page is sent to the client
 */
async function trackViewSSR(slug: string): Promise<void> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // Fire and forget - don't await
    fetch(`${baseUrl}/api/engagement/${slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'view' }),
      cache: 'no-store',
    }).catch((error) => {
      console.error('Error tracking view SSR:', error);
    });
  } catch (error) {
    console.error('Error in trackViewSSR:', error);
  }
}

/**
 * ArticleEngagementWrapper - Server component
 * 
 * Responsibilities:
 * 1. Fetch initial engagement data during SSR
 * 2. Track page view server-side (after streaming)
 * 3. Pass data to client component
 * 
 * Benefits:
 * - No client-side API call on mount (faster, prevents rate limit)
 * - SEO-friendly (engagement data in HTML)
 * - Progressive enhancement (works without JS)
 */
export default async function ArticleEngagementWrapper({
  slug,
  title,
  url,
  className,
}: ArticleEngagementWrapperProps) {
  // Fetch initial engagement data
  const initialEngagement = await fetchEngagementSSR(slug);

  // Track view asynchronously (doesn't block rendering)
  // Note: In production, you might want to use a different approach
  // like tracking views on the client after a delay, or using middleware
  trackViewSSR(slug);

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