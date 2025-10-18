// src/main/components/ArticleCards/NewsCardSkeleton.tsx

import React from 'react';

export function NewsCardSkeleton() {
  return (
    <article 
      className="bg-sf-cont p-4 shadow-sm rounded-2xl animate-pulse"
      role="status"
      aria-label="Loading news article..."
    >
      {/* Title skeleton */}
      <div className="h-5 bg-on-sf/10 rounded mb-2" />
      <div className="h-5 w-4/5 bg-on-sf/10 rounded mb-2" />
      
      {/* Date skeleton */}
      <div className="h-3 w-20 bg-on-sf/10 rounded mb-2" />
      
      {/* Description skeleton */}
      <div className="space-y-1 mb-3">
        <div className="h-4 bg-on-sf/10 rounded" />
        <div className="h-4 w-5/6 bg-on-sf/10 rounded" />
        <div className="h-4 w-3/4 bg-on-sf/10 rounded" />
      </div>
      
      {/* Read more skeleton */}
      <div className="h-3 w-16 bg-on-sf/10 rounded" />
      
      <span className="sr-only">Loading news article...</span>
    </article>
  );
}