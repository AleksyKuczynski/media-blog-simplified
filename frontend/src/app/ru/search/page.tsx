// src/app/ru/search/page.tsx
// FIXED: Integrated SearchSEO functionality and removed hardcoded text

import { Suspense } from 'react';
import { Metadata } from 'next';
import Section from '@/main/components/Main/Section';
import SearchBarClient from '@/main/components/Search/SearchBarClient';
import SearchResultsClient from '@/main/components/Search/SearchResultsClient';
import { russianDictionary } from '@/main/lib/dictionary/dictionary';
import { fetchArticleSlugs } from '@/main/lib/directus/index';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { generateSearchMetadataSimple } from '@/main/components/SEO/metadata/SearchMetadata';
import { SearchSchema } from '@/main/components/SEO/schemas/SearchSchema';

// Force dynamic for search functionality
export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: { 
    search?: string; 
    sort?: string; 
    page?: string;
  };
}

// Static metadata generation using fixed function
export function generateMetadata(): Metadata {
  try {
    return generateSearchMetadataSimple(russianDictionary);
  } catch (error) {
    console.error('Search page metadata generation failed:', error);
    // Fallback metadata using dictionary only - NO HARDCODED TEXT
    return {
      title: `${russianDictionary.search.templates.pageTitle} — ${russianDictionary.seo.site.name}`,
      description: `${russianDictionary.search.templates.pageDescription} на ${russianDictionary.seo.site.name}`,
    };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const dict = russianDictionary;
  
  const currentPage = Number(searchParams.page) || 1;
  const currentSort = searchParams.sort || 'desc';
  const searchQuery = searchParams.search || '';

  // Only fetch results if there's a valid search query
  let allSlugs: ArticleSlugInfo[] = [];
  let hasMore = false;
  const hasSearchQuery = searchQuery && searchQuery.length >= 3;

  if (hasSearchQuery) {
    try {
      // Server-side search results fetching
      for (let page = 1; page <= currentPage; page++) {
        const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
          page,
          currentSort,
          '',
          searchQuery,
          []
        );
        allSlugs = [...allSlugs, ...slugs];
        hasMore = pageHasMore;
        if (!pageHasMore) break;
      }
    } catch (error) {
      console.error('Search results fetching failed:', error);
      // Continue with empty results, component will handle gracefully
    }
  }

  // Static page title using dictionary
  const pageTitle = dict.search.templates.pageTitle;

  return (
    <>
      {/* Integrated SEO - Server Side Schema Only */}
      <SearchSchema 
        dictionary={dict} 
        query={hasSearchQuery ? searchQuery : undefined} 
      />
      
      {/* Main search content */}
      <Section
        title={pageTitle}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page description - manually placed since Section doesn't support description prop */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">
              {dict.search.templates.pageDescription}
            </p>
          </div>

          {/* Search interface */}
          <div className="space-y-6">
            <Suspense fallback={
              <div 
                className="h-14 bg-gray-100 rounded-lg animate-pulse"
                aria-label={dict.common.status.loading}
              />
            }>
              <SearchBarClient
                dictionary={dict}
                lang="ru"
              />
            </Suspense>
          </div>

          {/* Search results or empty state */}
          <div className="space-y-6">
            <Suspense fallback={
              <div 
                className="space-y-4"
                aria-label={dict.common.status.loading}
              >
                {Array.from({ length: 3 }, (_, i) => (
                  <div 
                    key={i}
                    className="h-32 bg-gray-100 rounded-lg animate-pulse" 
                  />
                ))}
              </div>
            }>
              <SearchResultsClient
                dictionary={dict}
                searchQuery={searchQuery}
                allSlugs={allSlugs}
                hasMore={hasMore}
                currentPage={currentPage}
                currentSort={currentSort}
              />
            </Suspense>
          </div>
        </div>
      </Section>
    </>
  );
}