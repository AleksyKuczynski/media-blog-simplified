// src/main/components/Article/RelatedLinks.tsx
// FIXED: Category URLs use correct route structure /ru/category/ (singular)

import Link from 'next/link';
import { Dictionary } from '@/main/lib/dictionary';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { NAVIGATION_STYLES } from '../../styles';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';

interface RelatedLinksProps {
  dictionary: Dictionary;
  rubric: {
    slug: string;
    name: string;
  };
  categories?: Array<{
    slug: string;
    name: string;
  }>;
  className?: string;
}

/**
 * Related Links component using exclusively dictionary entries
 * Provides contextual internal links to improve site structure and user engagement
 * Optimized for Russian market SEO (Google & Yandex)
 * FIXED: Category URLs use correct route structure
 */
export default function RelatedLinks({
  dictionary,
  rubric,
  categories = [],
  className = NAVIGATION_STYLES.relatedLinks.container
}: RelatedLinksProps) {
  
  // Generate template-based texts avoiding declinations
  const articlesCollectionTitle = processTemplate(dictionary.sections.templates.collectionTitle, { 
    section: dictionary.sections.labels.articles 
  });
  
  const rubricsCollectionTitle = processTemplate(dictionary.sections.templates.collectionTitle, { 
    section: dictionary.sections.labels.rubrics 
  });

  // Use generic approach to avoid "рубрике" declination
  const moreAboutContent = processTemplate(dictionary.content.templates.moreAbout, {
    contentType: dictionary.navigation.labels.rubrics, // Use nominative case "рубрики" instead of "рубрике"
    name: rubric.name
  });

  // Generate aria labels avoiding "в рубрике" construction
  const rubricLinkAriaLabel = processTemplate(dictionary.sections.templates.itemInCollection, {
    item: articlesCollectionTitle,
    collection: rubric.name
  });

  // Generate category aria labels avoiding "по теме" construction
  const categoryLinkAriaLabel = (categoryName: string) => 
    processTemplate(dictionary.sections.templates.itemInCollection, {
      item: articlesCollectionTitle,
      collection: categoryName
    });

  // Generate link text avoiding "в рубрике" construction
  const rubricLinkText = processTemplate(dictionary.sections.templates.itemInCollection, {
    item: articlesCollectionTitle,
    collection: rubric.name
  });
  
  return (
    <nav 
      className={className} 
      aria-label={dictionary.navigation.accessibility.primarySectionsLabel}
    >
      <div className={NAVIGATION_STYLES.relatedLinks.section}>
        
        {/* Rubric Section */}
        <section>
          <h3 className={NAVIGATION_STYLES.relatedLinks.heading}>
            {moreAboutContent}
          </h3>
          
          <div className={NAVIGATION_STYLES.relatedLinks.linkGrid}>
            {/* Link to current rubric articles */}
            <Link
              href={`/${DEFAULT_LANG}/${rubric.slug}`}
              className={NAVIGATION_STYLES.relatedLinks.link}
              aria-label={rubricLinkAriaLabel}
            >
              <span className="mr-2">📂</span>
              {rubricLinkText}
            </Link>
            
            {/* Link to all rubrics */}
            <Link
              href={`/${DEFAULT_LANG}/rubrics`}
              className={NAVIGATION_STYLES.relatedLinks.link}
              aria-label={rubricsCollectionTitle}
            >
              <span className="mr-2">🗂️</span>
              {rubricsCollectionTitle}
            </Link>
          </div>
        </section>

        {/* Categories Section - FIXED: Use correct route structure */}
        {categories.length > 0 && (
          <section>
            <h3 className={NAVIGATION_STYLES.relatedLinks.heading}>
              {dictionary.sections.rubrics.readMoreAbout}
            </h3>
            
            <div className={NAVIGATION_STYLES.relatedLinks.linkGrid}>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/${DEFAULT_LANG}/category/${category.slug}`}
                  className={NAVIGATION_STYLES.relatedLinks.link}
                  aria-label={categoryLinkAriaLabel(category.name)}
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
          <h3 className={NAVIGATION_STYLES.relatedLinks.heading}>
            {dictionary.sections.home.quickNavigation}
          </h3>
          
          <div className={NAVIGATION_STYLES.relatedLinks.linkGrid}>
            {/* Articles link */}
            <Link
              href={`/${DEFAULT_LANG}/articles`}
              className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-800 rounded-lg transition-colors duration-200 border border-purple-200"
            >
              <span className="mr-2">📄</span>
              <span className="text-sm font-medium">{dictionary.sections.articles.allArticles}</span>
            </Link>

            {/* Rubrics link */}
            <Link
              href={`/${DEFAULT_LANG}/rubrics`}
              className="flex items-center p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 rounded-lg transition-colors duration-200 border border-indigo-200"
            >
              <span className="mr-2">🗂️</span>
              <span className="text-sm font-medium">{dictionary.sections.rubrics.allRubrics}</span>
            </Link>

            {/* Authors link */}
            <Link
              href={`/${DEFAULT_LANG}/authors`}
              className="flex items-center p-3 bg-pink-50 hover:bg-pink-100 text-pink-700 hover:text-pink-800 rounded-lg transition-colors duration-200 border border-pink-200"
            >
              <span className="mr-2">👥</span>
              <span className="text-sm font-medium">{dictionary.sections.authors.allAuthors}</span>
            </Link>
          </div>
        </section>

      </div>
    </nav>
  );
}