// src/main/components/Navigation/Breadcrumbs/SmartBreadcrumbs.tsx
// Ensures all text comes from dictionary and all paths use correct lang parameter

import Link from 'next/link';
import { ChevronRightIcon } from '@/main/components/Interface/Icons';
import { Dictionary, Lang } from '@/main/lib/dictionary';
import { detectBreadcrumbContext, generateContextualBreadcrumbs } from '@/main/lib/utils/breadcrumbContextDetector';

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
  className = "text-sm mb-8 overflow-x-auto"
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

  // Generate JSON-LD structured data for primary path
  const primaryBreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${baseUrl}/${lang}/${articleData.rubricSlug}/${articleData.slug}#primary-breadcrumb`,
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
    "@id": `${baseUrl}/${lang}/${articleData.rubricSlug}/${articleData.slug}#alt-breadcrumb-${schemaIndex + 1}`,
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
      "@id": `${baseUrl}/${lang}/${articleData.rubricSlug}/${articleData.slug}#canonical-breadcrumb`,
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
        aria-label={dictionary.navigation.accessibility.breadcrumbNavigation}
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
                    className="text-on-sf-var line-clamp-1"
                    itemProp="name"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    href={item.href} 
                    className="text-pr-cont hover:text-pr-fix hover:underline underline-offset-4 transition-all duration-200"
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