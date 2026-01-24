// src/features/navigation/Breadcrumbs/SmartBreadcrumbs.tsx
import Link from 'next/link';
import { ChevronRightIcon } from '@/shared/primitives/Icons';
import { Dictionary, Lang } from '@/config/i18n';
import { detectBreadcrumbContext, generateContextualBreadcrumbs } from './lib/breadcrumbContextDetector';
import { BREADCRUMB_STYLES, SMART_BREADCRUMB_STYLES } from './breadcrumbs.styles';
import { generateSmartBreadcrumbSchemas, BreadcrumbSchemas } from '@/shared/seo/schemas/BreadcrumbSchema';

interface SmartBreadcrumbsProps {
  articleData: {
    title: string;
    slug: string;
    rubricSlug: string;
    rubricName: string; // Should already be translated from fetchRubricBasics
    authorName?: string;
    authors?: Array<{
      name: string;
      slug: string;
    }>;
    categories?: Array<{ 
      name: string; 
      slug: string 
    }>;
  };
  dictionary: Dictionary;
  lang: Lang;
  className?: string;
}

/**
 * Smart Breadcrumbs Component
 * - Detects user navigation context from referrer
 * - Shows contextual breadcrumbs matching user's journey
 * - Generates multiple SEO schemas for comprehensive coverage
 * 
 * IMPORTANT: articleData.rubricName must be already translated
 */
export default async function SmartBreadcrumbs({
  articleData,
  dictionary,
  lang,
  className
}: SmartBreadcrumbsProps) {
  
  // Detect context from referrer
  const context = await detectBreadcrumbContext(dictionary, lang);

  // Generate contextual breadcrumb paths
  const { userPath, canonicalPath, seoAlternatives } = generateContextualBreadcrumbs(
    context,
    articleData,
    dictionary,
    lang
  );

  // Determine which path to show users (prioritize contextual over canonical)
  const displayPath = userPath.length > 0 ? userPath : canonicalPath;
  
  // Get base URL for structured data
  const baseUrl = dictionary.seo.site.url.replace(/\/$/, '');

  // Generate all breadcrumb schemas
  const schemas = generateSmartBreadcrumbSchemas(
    baseUrl,
    lang,
    articleData.rubricSlug,
    articleData.slug,
    displayPath,
    canonicalPath,
    seoAlternatives
  );

  return (
    <>
      {/* Breadcrumb structured data */}
      <BreadcrumbSchemas schemas={schemas} />

      {/* User-facing breadcrumb navigation */}
      <nav 
        aria-label={dictionary.navigation.accessibility.breadcrumbNavigation}
        className={className || BREADCRUMB_STYLES.nav.container}
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className={BREADCRUMB_STYLES.list.base}>
          {displayPath.map((item, index) => {
            const isLast = index === displayPath.length - 1;
            
            // Determine item styling (always 4 members)
            const itemClass = index === 0 
              ? SMART_BREADCRUMB_STYLES.item.home
              : index === 1
              ? SMART_BREADCRUMB_STYLES.item.context
              : isLast
              ? SMART_BREADCRUMB_STYLES.item.article
              : SMART_BREADCRUMB_STYLES.item.parent;
            
            // Determine link styling
            const linkClass = index === 0 
              ? SMART_BREADCRUMB_STYLES.link.home
              : index === 1
              ? SMART_BREADCRUMB_STYLES.link.context
              : SMART_BREADCRUMB_STYLES.link.parent;
            
            return (
              <li 
                key={item.href} 
                className={itemClass}
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
              >
                {/* Chevron separator */}
                {index > 0 && (
                  <span className={BREADCRUMB_STYLES.separator.container}>
                    <ChevronRightIcon 
                      className={BREADCRUMB_STYLES.separator.icon}
                      aria-hidden="true" 
                    />
                  </span>
                )}

                {/* Breadcrumb item */}
                {isLast ? (
                  <span 
                    className={SMART_BREADCRUMB_STYLES.currentPage.base}
                    itemProp="name"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    href={item.href} 
                    className={linkClass}
                    itemProp="item"
                    aria-label={item.ariaLabel}
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                )}
                <meta itemProp="position" content={`${index + 1}`} />
              </li>
            );
          })}        
        </ol>
      </nav>
    </>
  );
}

/**
 * Helper function to enhance article data for SmartBreadcrumbs
 * IMPORTANT: rubricName must be already translated before calling this
 */
export function enhanceArticleForBreadcrumbs(
  article: any,
  rubricName: string, // Already translated
  rubricSlug: string
) {
  return {
    title: article.translations[0]?.title || article.slug,
    slug: article.slug,
    rubricSlug: rubricSlug,
    rubricName: rubricName, // Pass through the already-translated name
    authors: article.authors || [],
    categories: article.categories || [],
  };
}