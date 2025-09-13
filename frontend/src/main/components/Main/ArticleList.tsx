// src/main/components/Main/ArticleList.tsx
// MIGRATED: Now passes dictionary to ArticleCard
import { Suspense } from 'react';
import { Dictionary, Lang } from '@/main/lib/dictionary/types';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import ArticleCard from '../ArticleCards/ArticleCard';

interface ArticleListProps {
  readonly slugInfos: ArticleSlugInfo[];
  readonly lang: Lang;
  readonly dictionary: Dictionary; // MIGRATED: Added dictionary prop
  readonly authorSlug?: string;
  readonly categorySlug?: string;
  readonly rubricSlug?: string;
}

/**
 * ArticleList - MIGRATED to pass dictionary to ArticleCard components
 * Now uses new dictionary system for loading and error messages
 */
export default function ArticleList({ 
  slugInfos, 
  lang, 
  dictionary, // MIGRATED: Now required
  authorSlug, 
  rubricSlug 
}: ArticleListProps) {
  if (slugInfos.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400 text-center py-8">
        {dictionary.sections.articles.noArticlesFound} {/* MIGRATED: Use dictionary */}
      </p>
    );
  }

  return (
    <Suspense fallback={
      <div className="text-gray-600 dark:text-gray-400 text-center py-8">
        {dictionary.common.loading} {/* MIGRATED: Use dictionary */}
      </div>
    }>
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-2 gap-6 lg:gap-8 py-6 md:py-8 lg:py-12 sm:px-6 2xl:px-8">
        {slugInfos.map((slugInfo) => (
          <ArticleCard 
            key={slugInfo.slug}
            slug={slugInfo.slug}
            lang={lang} 
            authorSlug={authorSlug}
            rubricSlug={rubricSlug}
            layout={slugInfo.layout}
            dictionary={dictionary} // MIGRATED: Pass dictionary to ArticleCard
          />
        ))}
      </div>
    </Suspense>
  );
}