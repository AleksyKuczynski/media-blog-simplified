// src/main/components/Main/ArticleList.tsx - Ultra-simplified
import { Suspense } from 'react';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import ArticleCard from '../ArticleCards/ArticleCard';

interface ArticleListProps {
  slugInfos: ArticleSlugInfo[];
  lang: Lang;
  authorSlug?: string;
  categorySlug?: string;
  rubricSlug?: string;
}

export default function ArticleList({ 
  slugInfos, 
  lang, 
  authorSlug, 
  rubricSlug 
}: ArticleListProps) {
  if (slugInfos.length === 0) {
    return <p className="text-gray-600 dark:text-gray-400 text-center py-8">No articles found.</p>;
  }

  return (
    <Suspense fallback={<div className="text-gray-600 dark:text-gray-400 text-center py-8">Loading articles...</div>}>
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-2 gap-6 lg:gap-8 py-6 md:py-8 lg:py-12 sm:px-6 2xl:px-8">
        {/* ✅ DIRECT TAILWIND: Clean, readable, responsive grid */}
        {slugInfos.map((slugInfo) => (
          <ArticleCard 
            key={slugInfo.slug}
            slug={slugInfo.slug}
            lang={lang} 
            authorSlug={authorSlug}
            rubricSlug={rubricSlug}
            layout={slugInfo.layout}
          />
        ))}
      </div>
    </Suspense>
  );
}