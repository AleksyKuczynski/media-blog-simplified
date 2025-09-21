// src/main/components/Article/RelatedLinks.tsx
// SEO-optimized related links component for articles

import Link from 'next/link';
import { Dictionary } from '@/main/lib/dictionary/types';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

interface RelatedLinksProps {
  dictionary: Dictionary;
  rubric: {
    slug: string;
    name: string;
    // FIXED: Removed articleCount since RubricBasic doesn't have it
  };
  categories?: Array<{
    slug: string;
    name: string;
  }>;
  className?: string;
}

/**
 * Related Links component for SEO optimization
 * Provides contextual internal links to improve site structure and user engagement
 */
export default function RelatedLinks({
  dictionary,
  rubric,
  categories = [],
  className = "mt-12 pt-8 border-t border-gray-200"
}: RelatedLinksProps) {
  
  return (
    <nav className={className} aria-label="Связанные разделы">
      <div className="space-y-6">
        
        {/* Rubric Section */}
        <section>
          <h3 className="text-lg font-semibold mb-3 text-on-sf">
            {processTemplate(dictionary.content.templates.moreAbout, {
              contentType: 'рубрике',
              name: rubric.name
            })}
          </h3>
          
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/ru/${rubric.slug}`}
              className="inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg transition-colors duration-200 border border-blue-200"
              aria-label={`Все статьи в рубрике ${rubric.name}`}
            >
              <span className="mr-2">📂</span>
              Все статьи в рубрике {rubric.name}
              {/* FIXED: Removed articleCount since it's not available in RubricBasic */}
            </Link>
            
            <Link
              href="/ru/rubrics"
              className="inline-flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-800 rounded-lg transition-colors duration-200 border border-gray-200"
              aria-label="Все рубрики"
            >
              <span className="mr-2">🗂️</span>
              {dictionary.navigation.labels.rubrics}
            </Link>
          </div>
        </section>

        {/* Categories Section - if available */}
        {categories.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold mb-3 text-on-sf">
              Похожие темы
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/ru/categories/${category.slug}`}
                  className="inline-flex items-center px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 rounded-full text-sm transition-colors duration-200 border border-green-200"
                  aria-label={`Статьи по теме ${category.name}`}
                >
                  <span className="mr-1">🏷️</span>
                  {category.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Quick Navigation */}
        <section>
          <h3 className="text-lg font-semibold mb-3 text-on-sf">
            {dictionary.sections.home.quickNavigation}
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link
              href="/ru/articles"
              className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-800 rounded-lg transition-colors duration-200 border border-purple-200"
              aria-label="Все статьи"
            >
              <span className="mr-2">📰</span>
              <span className="text-sm font-medium">{dictionary.navigation.labels.articles}</span>
            </Link>
            
            <Link
              href="/ru/authors"
              className="flex items-center p-3 bg-orange-50 hover:bg-orange-100 text-orange-700 hover:text-orange-800 rounded-lg transition-colors duration-200 border border-orange-200"
              aria-label="Все авторы"
            >
              <span className="mr-2">👥</span>
              <span className="text-sm font-medium">{dictionary.navigation.labels.authors}</span>
            </Link>
            
            <Link
              href="/ru"
              className="flex items-center p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 rounded-lg transition-colors duration-200 border border-indigo-200"
              aria-label="Главная страница"
            >
              <span className="mr-2">🏠</span>
              <span className="text-sm font-medium">{dictionary.navigation.labels.home}</span>
            </Link>
          </div>
        </section>
      </div>
    </nav>
  );
}

/**
 * Structured data for related links (enhances SEO)
 */
export function RelatedLinksSchema({
  dictionary,
  rubric,
  categories = [],
  currentArticleUrl
}: RelatedLinksProps & { currentArticleUrl: string }) {
  const baseUrl = dictionary.seo.site.url.replace(/\/$/, '');
  
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${currentArticleUrl}#related-breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dictionary.navigation.labels.home,
        item: `${baseUrl}/ru`,
      },
      {
        '@type': 'ListItem', 
        position: 2,
        name: rubric.name,
        item: `${baseUrl}/ru/${rubric.slug}`,
      },
    ],
  };

  // Collection page schema for rubric
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${baseUrl}/ru/${rubric.slug}#collection`,
    name: rubric.name,
    description: `Все статьи в рубрике ${rubric.name}`,
    url: `${baseUrl}/ru/${rubric.slug}`,
    inLanguage: 'ru',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
    },
  };

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [breadcrumbList, collectionSchema],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(combinedSchema, null, 0),
      }}
    />
  );
}