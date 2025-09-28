// src/main/lib/utils/breadcrumbContextDetector.ts
// Context detection utility for smart breadcrumbs

import { headers } from 'next/headers';
import { Dictionary } from '@/main/lib/dictionary/types';
import { BreadcrumbContext, SmartBreadcrumbItem } from '@/main/components/Navigation/types';

/**
 * Detect user's navigation context based on referrer and URL patterns
 * SECURITY: Validates referrer headers to prevent manipulation
 */
export async function detectBreadcrumbContext(
  currentPath: string,
  dictionary: Dictionary
): Promise<BreadcrumbContext> {
  try {
    const headersList = await headers();
    const referrer = headersList.get('referer') || headersList.get('referrer');
    const host = headersList.get('host') || 'localhost:3000';
    
    // Security check: Only analyze referrers from our domain
    const isInternalReferrer = referrer && (
      referrer.includes(host) || 
      referrer.includes(dictionary.seo.site.url.replace(/https?:\/\//, ''))
    );
    
    if (!isInternalReferrer) {
      return {
        type: referrer ? 'external' : 'direct',
        referrerPath: referrer || undefined,
      };
    }

    // Extract referrer path for pattern matching
    const referrerPath = new URL(referrer).pathname;
    
    // Pattern matching for different contexts
    const patterns = {
      author: /\/ru\/authors\/([^\/]+)/,
      category: /\/ru\/category\/([^\/]+)/,
      search: /\/ru\/search/,
      rubrics: /\/ru\/rubrics/,
      featured: /\/ru$/,
    };

    // Author context detection
    const authorMatch = referrerPath.match(patterns.author);
    if (authorMatch) {
      return {
        type: 'author',
        referrerPath,
        contextData: {
          authorSlug: authorMatch[1],
        },
      };
    }

    // Category context detection  
    const categoryMatch = referrerPath.match(patterns.category);
    if (categoryMatch) {
      return {
        type: 'category',
        referrerPath,
        contextData: {
          categorySlug: categoryMatch[1],
        },
      };
    }

    // Search context detection
    if (patterns.search.test(referrerPath)) {
      // Extract search query from referrer URL if available
      const searchParams = new URL(referrer).searchParams;
      const searchQuery = searchParams.get('search') || searchParams.get('q');
      
      return {
        type: 'search',
        referrerPath,
        contextData: {
          searchQuery: searchQuery || undefined,
        },
      };
    }

    // Featured/hero context (main page)
    if (patterns.featured.test(referrerPath)) {
      return {
        type: 'featured',
        referrerPath,
      };
    }

    // Rubrics listing page
    if (patterns.rubrics.test(referrerPath)) {
      return {
        type: 'rubric',
        referrerPath,
      };
    }

    // Default fallback - treat as rubric context
    return {
      type: 'rubric',
      referrerPath,
    };

  } catch (error) {
    console.error('Error detecting breadcrumb context:', error);
    
    // Safe fallback
    return {
      type: 'direct',
    };
  }
}

/**
 * Generate context-aware breadcrumb paths
 * Creates multiple valid navigation paths for SEO while showing contextual path to users
 */
export function generateContextualBreadcrumbs(
  context: BreadcrumbContext,
  articleData: {
    title: string;
    slug: string;
    rubricSlug: string;
    rubricName: string;
    authorName?: string;
    authorSlug?: string;
    categories?: Array<{ name: string; slug: string }>;
  },
  dictionary: Dictionary
): {
  userPath: SmartBreadcrumbItem[];
  canonicalPath: SmartBreadcrumbItem[];
  seoAlternatives: SmartBreadcrumbItem[][];
} {
  
  const baseHome: SmartBreadcrumbItem = {
    label: dictionary.navigation.labels.home,
    href: '/ru',
    ariaLabel: dictionary.navigation.descriptions.home,
  };

  // Canonical path (always rubric-based for SEO consistency)
  const canonicalPath: SmartBreadcrumbItem[] = [
    baseHome,
    {
      label: dictionary.navigation.labels.rubrics,
      href: '/ru/rubrics',
      ariaLabel: dictionary.navigation.descriptions.rubrics,
    },
    {
      label: articleData.rubricName,
      href: `/ru/${articleData.rubricSlug}`,
      ariaLabel: `Рубрика ${articleData.rubricName}`,
    },
    {
      label: articleData.title,
      href: `/ru/${articleData.rubricSlug}/${articleData.slug}`,
      ariaLabel: `Статья: ${articleData.title}`,
    },
  ];

  // Generate user-facing contextual path
  let userPath: SmartBreadcrumbItem[];
  const seoAlternatives: SmartBreadcrumbItem[][] = [];

  switch (context.type) {
    case 'author':
      if (context.contextData?.authorSlug && articleData.authorName) {
        userPath = [
          baseHome,
          {
            label: dictionary.navigation.labels.authors,
            href: '/ru/authors',
            context: 'author-collection',
            ariaLabel: dictionary.navigation.descriptions.authors,
          },
          {
            label: articleData.authorName,
            href: `/ru/authors/${context.contextData.authorSlug}`,
            context: 'author-profile',
            ariaLabel: `Профиль автора ${articleData.authorName}`,
          },
          {
            label: articleData.title,
            href: `/ru/${articleData.rubricSlug}/${articleData.slug}`,
            context: 'article-from-author',
            ariaLabel: dictionary.navigation.descriptions.fromAuthor,
          },
        ];
        
        // Add author path as SEO alternative
        seoAlternatives.push(userPath);
      } else {
        userPath = canonicalPath;
      }
      break;

    case 'category':
      if (context.contextData?.categorySlug) {
        const categoryName = articleData.categories?.find(
          cat => cat.slug === context.contextData?.categorySlug
        )?.name || context.contextData.categorySlug;
        
        userPath = [
          baseHome,
          {
            label: dictionary.navigation.labels.articles,
            href: '/ru/articles',
            context: 'article-collection',
            ariaLabel: dictionary.navigation.descriptions.articles,
          },
          {
            label: categoryName,
            href: `/ru/category/${context.contextData.categorySlug}`,
            context: 'category-filter',
            ariaLabel: `Категория ${categoryName}`,
          },
          {
            label: articleData.title,
            href: `/ru/${articleData.rubricSlug}/${articleData.slug}`,
            context: 'article-from-category',
            ariaLabel: dictionary.navigation.descriptions.fromCategory,
          },
        ];
        
        // Add category path as SEO alternative
        seoAlternatives.push(userPath);
      } else {
        userPath = canonicalPath;
      }
      break;

    case 'featured':
      userPath = [
        baseHome,
        {
          label: articleData.title,
          href: `/ru/${articleData.rubricSlug}/${articleData.slug}`,
          context: 'featured-article',
          ariaLabel: dictionary.navigation.descriptions.fromFeatured,
        },
      ];
      
      // Add shortened featured path as SEO alternative
      seoAlternatives.push(userPath);
      break;

    case 'search':
      const searchLabel = context.contextData?.searchQuery 
        ? `${dictionary.navigation.labels.search}: ${context.contextData.searchQuery}`
        : dictionary.navigation.labels.search;
        
      userPath = [
        baseHome,
        {
          label: searchLabel,
          href: '/ru/search',
          context: 'search-results',
          ariaLabel: dictionary.navigation.descriptions.fromSearch,
        },
        {
          label: articleData.title,
          href: `/ru/${articleData.rubricSlug}/${articleData.slug}`,
          context: 'article-from-search',
          ariaLabel: `Статья из поиска: ${articleData.title}`,
        },
      ];
      break;

    default:
      // Use canonical path for external/direct/unknown contexts
      userPath = canonicalPath;
      break;
  }

  return {
    userPath,
    canonicalPath,
    seoAlternatives,
  };
}