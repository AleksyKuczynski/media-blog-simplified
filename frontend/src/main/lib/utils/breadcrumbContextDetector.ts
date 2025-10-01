// Complete updated breadcrumbContextDetector.ts with articles pattern and multi-author fix
// src/main/lib/utils/breadcrumbContextDetector.ts

import { headers } from 'next/headers';
import { Dictionary } from '@/main/lib/dictionary/types';
import { BreadcrumbContext, SmartBreadcrumbItem } from '@/main/components/Navigation/types';

/**
 * Detect user's navigation context based on referrer and URL patterns
 * SECURITY: Validates referrer headers to prevent manipulation
 * FIXED: Handles /ru/articles pattern and multi-author matching
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
    
    // Pattern matching for different contexts - ORDER MATTERS!
    const patterns = {
      author: /\/ru\/authors\/([^\/]+)$/,      // Specific author page
      category: /\/ru\/category\/([^\/]+)$/,   // Specific category page
      search: /\/ru\/search/,                   // Search results
      articles: /\/ru\/articles$/,              // FIXED: Articles listing (exact match)
      rubrics: /\/ru\/rubrics$/,                // Rubrics listing (exact match)
      featured: /\/ru$/,                        // Main page
    };

    // Author context detection (highest priority for specific pages)
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

    // FIXED: Articles listing page (before rubrics check)
    if (patterns.articles.test(referrerPath)) {
      return {
        type: 'articles',
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

    // Featured/hero context (main page)
    if (patterns.featured.test(referrerPath)) {
      return {
        type: 'featured',
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
 * FIXED: Matches authors from context with article's author array for multi-author articles
 */
export function generateContextualBreadcrumbs(
  context: BreadcrumbContext,
  articleData: {
    title: string;
    slug: string;
    rubricSlug: string;
    rubricName: string;
    authors?: Array<{
      name: string;
      slug: string;
    }>;
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

  let userPath: SmartBreadcrumbItem[];
  const seoAlternatives: SmartBreadcrumbItem[][] = [];

  switch (context.type) {
    case 'author':
      // FIXED: Match the author from context with the article's authors array
      if (context.contextData?.authorSlug && articleData.authors && articleData.authors.length > 0) {
        const matchedAuthor = articleData.authors.find(
          author => author.slug === context.contextData?.authorSlug
        );
        
        // Only show author breadcrumb if we found the matching author
        if (matchedAuthor) {
          userPath = [
            baseHome,
            {
              label: dictionary.navigation.labels.authors,
              href: '/ru/authors',
              context: 'author-collection',
              ariaLabel: dictionary.navigation.descriptions.authors,
            },
            {
              label: matchedAuthor.name,  // FIXED: Use matched author's name
              href: `/ru/authors/${matchedAuthor.slug}`,  // FIXED: Use matched author's slug
              context: 'author-profile',
              ariaLabel: `Профиль автора ${matchedAuthor.name}`,
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
          // Fallback: If author not found in article's authors, use canonical
          console.warn(`Author ${context.contextData.authorSlug} not found in article authors`);
          userPath = canonicalPath;
        }
      } else {
        userPath = canonicalPath;
      }
      break;

    case 'category':
      if (context.contextData?.categorySlug && articleData.categories && articleData.categories.length > 0) {
        const matchedCategory = articleData.categories.find(
          cat => cat.slug === context.contextData?.categorySlug
        );
        
        if (matchedCategory) {
          userPath = [
            baseHome,
            {
              label: dictionary.navigation.labels.articles,
              href: '/ru/articles',
              context: 'article-collection',
              ariaLabel: dictionary.navigation.descriptions.articles,
            },
            {
              label: matchedCategory.name,
              href: `/ru/category/${matchedCategory.slug}`,
              context: 'category-filter',
              ariaLabel: `Категория ${matchedCategory.name}`,
            },
            {
              label: articleData.title,
              href: `/ru/${articleData.rubricSlug}/${articleData.slug}`,
              context: 'article-from-category',
              ariaLabel: dictionary.navigation.descriptions.fromCategory,
            },
          ];
          
          seoAlternatives.push(userPath);
        } else {
          console.warn(`Category ${context.contextData.categorySlug} not found in article categories`);
          userPath = canonicalPath;
        }
      } else {
        userPath = canonicalPath;
      }
      break;

    case 'articles':
      // NEW: Handle /ru/articles referrer
      userPath = [
        baseHome,
        {
          label: dictionary.navigation.labels.articles,
          href: '/ru/articles',
          context: 'articles-collection',
          ariaLabel: dictionary.navigation.descriptions.articles,
        },
        {
          label: articleData.title,
          href: `/ru/${articleData.rubricSlug}/${articleData.slug}`,
          context: 'article-from-articles',
          ariaLabel: 'Статья из общего списка статей',
        },
      ];
      
      seoAlternatives.push(userPath);
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