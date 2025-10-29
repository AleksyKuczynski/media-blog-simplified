// frontend/src/main/components/Article/ArticleViewTracker.tsx
// Client component that tracks article views after page load
'use client';

import { useEffect, useRef } from 'react';

interface ArticleViewTrackerProps {
  slug: string;
}

/**
 * ArticleViewTracker - Tracks article views on page load
 * 
 * ARCHITECTURE:
 * - Runs client-side only (uses useEffect)
 * - Delays 2 seconds to filter bots and accidental clicks
 * - Tracks only once per page load (not on navigation back/forward)
 * - Silent operation (no UI, no error display to user)
 * 
 * USAGE:
 * Place in article page component, ideally after main content:
 * 
 * ```tsx
 * export default function ArticlePage({ params }) {
 *   return (
 *     <>
 *       <article>...</article>
 *       <ArticleViewTracker slug={params.slug} />
 *     </>
 *   );
 * }
 * ```
 */
export default function ArticleViewTracker({ slug }: ArticleViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Prevent double-tracking in development (React StrictMode)
    if (hasTracked.current) {
      return;
    }

    // Delay view tracking to filter bots and accidental clicks
    // A real user will stay on the page for at least 2 seconds
    const timer = setTimeout(async () => {
      try {
        hasTracked.current = true;

        console.log('📊 Tracking view for:', slug);

        const response = await fetch(`/api/engagement/${slug}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'view' }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('❌ Failed to track view:', error);
          return;
        }

        const result = await response.json();
        console.log('✅ View tracked:', result.data);
      } catch (error) {
        // Silent failure - don't disrupt user experience
        console.error('❌ Error tracking view:', error);
      }
    }, 2000); // 2 second delay

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [slug]);

  // This component renders nothing
  return null;
}