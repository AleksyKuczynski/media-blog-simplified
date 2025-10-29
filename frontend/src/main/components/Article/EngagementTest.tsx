// frontend/src/main/components/Article/EngagementTest.tsx
// TEMPORARY TEST COMPONENT - Use this to verify your setup works
'use client';

import { useEffect, useState } from 'react';

interface EngagementTestProps {
  slug: string;
}

/**
 * EngagementTest - Simple component to test API + Directus Flow
 * This is just for testing! Replace with full ArticleEngagement later.
 */
export default function EngagementTest({ slug }: EngagementTestProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch engagement data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/engagement/${slug}`);
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch');
        }
      } catch (err) {
        setError('Network error');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  // Track view after 2 seconds
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/engagement/${slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'view' }),
        });
        
        const result = await response.json();
        if (result.success) {
          console.log('✅ View tracked!', result.data);
          setData(result.data); // Update with new count
        }
      } catch (err) {
        console.error('❌ Failed to track view:', err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [slug]);

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 rounded border border-gray-300">
        <p className="text-sm text-gray-600">Loading engagement data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded border border-red-300">
        <p className="text-sm text-red-600">❌ Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 rounded border border-green-300">
      <h3 className="font-bold text-green-800 mb-2">✅ Engagement Test Component</h3>
      <div className="space-y-1 text-sm">
        <p><strong>Slug:</strong> {data?.slug}</p>
        <p><strong>Views:</strong> {data?.views}</p>
        <p><strong>Likes:</strong> {data?.likes}</p>
        <p><strong>Shares:</strong> {data?.shares}</p>
      </div>
      <p className="text-xs text-gray-600 mt-3">
        ℹ️ View count should increment after 2 seconds. Check Directus articles_engagement collection!
      </p>
    </div>
  );
}