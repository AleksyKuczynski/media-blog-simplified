// shared/seo/schemas/BreadcrumbSchema.tsx
/**
 * Smart Breadcrumb Schema Generator
 * 
 * Generates multiple breadcrumb schemas for comprehensive SEO:
 * - Primary breadcrumb (user's navigation path)
 * - Canonical breadcrumb (standard path through rubric)
 * - Alternative breadcrumbs (other valid paths)
 * 
 * Used by SmartBreadcrumbs component for context-aware navigation.
 */

import { Lang } from '@/config/i18n';

export interface BreadcrumbItem {
  label: string;
  href: string;
  context?: string;
  ariaLabel?: string;
}

export interface SmartBreadcrumbSchemas {
  primary: object;
  canonical: object | null;
  alternatives: object[];
}

/**
 * Generate all breadcrumb schemas for an article
 */
export function generateSmartBreadcrumbSchemas(
  baseUrl: string,
  lang: Lang,
  rubricSlug: string,
  articleSlug: string,
  displayPath: BreadcrumbItem[],
  canonicalPath: BreadcrumbItem[],
  seoAlternatives: BreadcrumbItem[][]
): SmartBreadcrumbSchemas {
  
  const articleUrl = `${baseUrl}/${lang}/${rubricSlug}/${articleSlug}`;
  
  // Primary breadcrumb schema (what user sees)
  const primary = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${articleUrl}#primary-breadcrumb`,
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

  // Canonical breadcrumb schema (if different from display path)
  let canonical = null;
  if (JSON.stringify(displayPath) !== JSON.stringify(canonicalPath)) {
    canonical = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${articleUrl}#canonical-breadcrumb`,
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

  // Alternative breadcrumb schemas for SEO comprehensiveness
  const alternatives = seoAlternatives.map((altPath, schemaIndex) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${articleUrl}#alt-breadcrumb-${schemaIndex + 1}`,
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

  return {
    primary,
    canonical,
    alternatives
  };
}

/**
 * Render breadcrumb schemas as JSON-LD scripts
 */
export function BreadcrumbSchemas({ schemas }: { schemas: SmartBreadcrumbSchemas }) {
  return (
    <>
      {/* Primary breadcrumb structured data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.primary) }}
      />
      
      {/* Canonical breadcrumb structured data (if different) */}
      {schemas.canonical && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.canonical) }}
        />
      )}
      
      {/* Alternative breadcrumb structured data */}
      {schemas.alternatives.map((schema, index) => (
        <script 
          key={`alt-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}