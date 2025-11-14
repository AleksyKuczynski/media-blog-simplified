// src/main/components/Navigation/SmartBreadcrumbs.tsx
// Unified component combining user-facing breadcrumbs with SEO structured data

import Link from 'next/link';
import { ChevronRightIcon } from '@/main/components/Interface/Icons';
import { Dictionary } from '@/main/lib/dictionary';
import { detectBreadcrumbContext, generateContextualBreadcrumbs } from '@/main/lib/utils/breadcrumbContextDetector';

interface SmartBreadcrumbsProps {
  articleData: {
    title: string;
    slug: string;
    rubricSlug: string;
    rubricName: string;
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
  className?: string;
}

/**
 * Smart Breadcrumbs Component
 * - Detects user navigation context from referrer
 * - Shows contextual breadcrumbs matching user's journey
 * - Generates multiple SEO schemas for comprehensive coverage
 * - Maintains accessibility and semantic HTML
 */
export default async function SmartBreadcrumbs({
  articleData,
  dictionary,
  className = "text-sm mb-8 overflow-x-auto"
}: SmartBreadcrumbsProps) {
  
  // Detect user's navigation context
  const context = await detectBreadcrumbContext(
    `/ru/${articleData.rubricSlug}/${articleData.slug}`,
    dictionary
  );

  // Generate contextual breadcrumb paths
  const { userPath, canonicalPath, seoAlternatives } = generateContextualBreadcrumbs(
    context,
    articleData,
    dictionary
  );

  // Determine which path to show users (prioritize contextual over canonical)
  const displayPath = userPath.length > 0 ? userPath : canonicalPath;
  
  // Get base URL for structured data
  const baseUrl = dictionary.seo.site.url.replace(/\/$/, '');

  // Generate JSON-LD structured data for primary path
  const primaryBreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${baseUrl}/ru/${articleData.rubricSlug}/${articleData.slug}#primary-breadcrumb`,
    "numberOfItems": displayPath.length,
    "itemListElement": displayPath.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": {
        "@type": "WebPage",
        "@id": `${baseUrl}${item.href}`,
        "url": `${baseUrl}${item.href}`,
        "name": item.label
      }
    }))
  };

  // Generate alternative breadcrumb schemas for SEO comprehensiveness
  const alternativeSchemas = seoAlternatives.map((altPath, schemaIndex) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${baseUrl}/ru/${articleData.rubricSlug}/${articleData.slug}#alt-breadcrumb-${schemaIndex + 1}`,
    "numberOfItems": altPath.length,
    "itemListElement": altPath.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": {
        "@type": "WebPage",
        "@id": `${baseUrl}${item.href}`,
        "url": `${baseUrl}${item.href}`,
        "name": item.label
      }
    }))
  }));

  // Always include canonical path if different from displayed path
  let canonicalSchema = null;
  if (JSON.stringify(displayPath) !== JSON.stringify(canonicalPath)) {
    canonicalSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}/ru/${articleData.rubricSlug}/${articleData.slug}#canonical-breadcrumb`,
      "numberOfItems": canonicalPath.length,
      "itemListElement": canonicalPath.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": {
          "@type": "WebPage",
          "@id": `${baseUrl}${item.href}`,
          "url": `${baseUrl}${item.href}`,
          "name": item.label
        }
      }))
    };
  }

  return (
    <>
      {/* Primary breadcrumb structured data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(primaryBreadcrumbSchema) }}
      />
      
      {/* Canonical breadcrumb structured data (if different) */}
      {canonicalSchema && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(canonicalSchema) }}
        />
      )}
      
      {/* Alternative breadcrumb structured data */}
      {alternativeSchemas.map((schema, index) => (
        <script 
          key={`alt-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* User-facing breadcrumb navigation */}
      <nav 
        aria-label="Breadcrumb" 
        className={className}
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className="list-none inline-flex items-center whitespace-nowrap">
          {displayPath.map((item, index) => {
            const isLast = index === displayPath.length - 1;
            
            return (
              <li 
                key={item.href} 
                className="flex items-center"
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
              >
                {/* Chevron separator */}
                {index > 0 && (
                  <span className="mx-2 flex-shrink-0">
                    <ChevronRightIcon 
                      className="w-3 h-3 text-pr-cont" 
                      aria-hidden="true" 
                    />
                  </span>
                )}

                {/* Breadcrumb item */}
                {isLast ? (
                  <span 
                    className="text-pr-accent font-medium"
                    itemProp="name"
                    aria-current="page"
                    title={item.ariaLabel || item.label}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-pr-cont hover:text-pr-accent transition-colors duration-200"
                    itemProp="item"
                    title={item.ariaLabel || item.label}
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                )}

                {/* Hidden structured data position */}
                <meta itemProp="position" content={(index + 1).toString()} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * Server-side function to enhance existing article data with breadcrumb context
 * Use this in article pages to prepare data for SmartBreadcrumbs
 */
export async function enhanceArticleForBreadcrumbs(
  article: any,
  rubricBasics: any[],
  dictionary: Dictionary
): Promise<SmartBreadcrumbsProps['articleData']> {
  
  const translation = article.translations?.[0];
  
  // FIXED: article.rubric_slug is a STRING, not an object
  // The rubric slug is directly available as article.rubric_slug
  const articleRubricSlug = article.rubric_slug || 'общее';
  
  // FIXED: Find rubric by the string slug
  const rubric = rubricBasics.find(r => r.slug === articleRubricSlug);
  
  // Debug logging to help troubleshoot
  console.log('[enhanceArticleForBreadcrumbs] Debug:', {
    articleRubricSlug,
    rubricBasicsCount: rubricBasics.length,
    rubricBasicsSlugs: rubricBasics.map(r => r.slug),
    foundRubric: rubric?.name || 'NOT FOUND'
  });
  
  return {
    title: translation?.title || article.slug,
    slug: article.slug,
    rubricSlug: articleRubricSlug,
    rubricName: rubric?.name || articleRubricSlug || 'Общее',
    authorName: article.authors?.[0]?.name,
    authors: article.authors?.map((author: any) => ({
      name: author.name,
      slug: author.slug,
    })) || [],
    categories: article.categories?.map((cat: any) => ({
      name: cat.name,
      slug: cat.slug,
    })) || [],
  };
}