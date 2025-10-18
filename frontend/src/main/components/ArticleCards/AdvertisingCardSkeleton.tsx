// src/main/components/ArticleCards/AdvertisingCardSkeleton.tsx  

import React from 'react';

export function AdvertisingCardSkeleton() {
  return (
    <article 
      className="bg-gradient-to-br from-sf-hi to-sf-hst p-6 rounded-2xl shadow-lg animate-pulse"
      role="status"
      aria-label="Loading sponsored content..."
    >
      <div className="flex flex-col h-full">
        {/* Title skeleton */}
        <div className="h-6 bg-on-sf/10 rounded mb-3" />
        <div className="h-6 w-3/4 bg-on-sf/10 rounded mb-3" />
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-4 flex-grow">
          <div className="h-4 bg-on-sf/10 rounded" />
          <div className="h-4 w-5/6 bg-on-sf/10 rounded" />
          <div className="h-4 w-4/5 bg-on-sf/10 rounded" />
          <div className="h-4 w-3/5 bg-on-sf/10 rounded" />
        </div>
        
        {/* Button skeleton */}
        <div className="mt-auto">
          <div className="h-7 w-20 bg-on-sf/20 rounded-full" />
        </div>
      </div>
      
      <span className="sr-only">Loading sponsored content...</span>
    </article>
  );
}