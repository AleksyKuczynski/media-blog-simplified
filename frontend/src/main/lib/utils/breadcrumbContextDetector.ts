// src/main/lib/utils/breadcrumbContextDetector.ts
// REFACTORED: Removed all hardcoded text and /ru paths, using dictionary and constants

import { headers } from 'next/headers';
import { Dictionary, Lang } from '@/main/lib/dictionary/types';
import { BreadcrumbContext, SmartBreadcrumbItem } from '@/main/components/Navigation/types';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

/**
 * Detect user's navigation context based on referrer and URL patterns
 * SECURITY: Validates referrer headers to prevent manipulation
 * REFACTORED: Uses lang parameter and dictionary entries, no hardcoded text
 */
export async function detectBreadcrumbContext(
  currentPath: string,
  dictionary: Dictionary,
  lang: Lang = 'ru'
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
    
    // FIXED: Language-agnostic pattern matching using lang parameter
    const patterns = {
      author: new RegExp(`\\/${lang}\\/authors\\/([^\\/]+)$`),
      category: new RegExp(`\\/${lang}\\/category\\/([^\\/]+)$`),
      search: new RegExp(`\\/${lang}\\/search`),
      articles: new RegExp(`\\/${lang}\\/articles$`),
      rubrics: new RegExp(`\\/${lang}\\/rubrics$`),
      specificRubric: new RegExp(`\\/${lang}\\/([^\\/]+)$`),
      featured: new RegExp(`\\/${lang}$`),
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

    // Articles listing page
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

    // Specific rubric page detection (must come after other specific patterns)
    const rubricMatch = referrerPath.match(patterns.specificRubric);
    if (rubricMatch) {
      const rubricSlug = rubricMatch[1];
      // Exclude known non-rubric paths
      const excludedPaths = ['authors', 'rubrics', 'articles', 'search', 'category'];
      if (!excludedPaths.includes(rubricSlug)) {
        return {
          type: 'rubric',
          referrerPath,
          contextData: {
            rubricSlug,
          },
        };
      }
    }

    // Default fallback - direct navigation
    return {
      type: 'direct',
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
 * REFACTORED: Uses dictionary templates for all text, lang parameter for paths
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
  dictionary: Dictionary,
  lang: Lang = 'ru'
): {
  userPath: SmartBreadcrumbItem[];
  canonicalPath: SmartBreadcrumbItem[];
  seoAlternatives: SmartBreadcrumbItem[][];
} {
  
  // FIXED: Use lang parameter instead of hardcoded '/ru'
  const baseHome: SmartBreadcrumbItem = {
    label: dictionary.navigation.labels.home,
    href: `/${lang}`,
    ariaLabel: dictionary.navigation.descriptions.home,
  };

  // Canonical path (always rubric-based for SEO consistency)
  // FIXED: All text from dictionary, all paths use lang parameter
  const canonicalPath: SmartBreadcrumbItem[] = [
    baseHome,
    {
      label: dictionary.navigation.labels.rubrics,
      href: `/${lang}/rubrics`,
      ariaLabel: dictionary.navigation.descriptions.rubrics,
    },
    {
      label: articleData.rubricName,
      href: `/${lang}/${articleData.rubricSlug}`,
      ariaLabel: processTemplate(dictionary.breadcrumb.templates.rubricLabel, {
        name: articleData.rubricName
      }),
    },
    {
      label: articleData.title,
      href: `/${lang}/${articleData.rubricSlug}/${articleData.slug}`,
      ariaLabel: processTemplate(dictionary.breadcrumb.templates.articleLabel, {
        title: articleData.title
      }),
    },
  ];

  let userPath: SmartBreadcrumbItem[];
  const seoAlternatives: SmartBreadcrumbItem[][] = [];

  switch (context.type) {
    case 'rubric':
      // Handle navigation from rubric pages
      if (context.contextData?.rubricSlug) {
        userPath = [
          baseHome,
          {
            label: dictionary.navigation.labels.rubrics,
            href: `/${lang}/rubrics`,
            ariaLabel: dictionary.navigation.descriptions.rubrics,
          },
          {
            label: articleData.rubricName,
            href: `/${lang}/${articleData.rubricSlug}`,
            context: 'rubric-page',
            ariaLabel: processTemplate(dictionary.breadcrumb.templates.rubricLabel, {
              name: articleData.rubricName
            }),
          },
          {
            label: articleData.title,
            href: `/${lang}/${articleData.rubricSlug}/${articleData.slug}`,
            context: 'article-from-rubric',
            ariaLabel: processTemplate(dictionary.breadcrumb.templates.fromRubric, {
              rubric: articleData.rubricName
            }),
          },
        ];
        
        seoAlternatives.push(userPath);
      } else {
        // Came from rubrics listing page, use canonical path
        userPath = canonicalPath;
      }
      break;

    case 'author':
      // Match the author from context with the article's authors array
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
              href: `/${lang}/authors`,
              context: 'author-collection',
              ariaLabel: dictionary.navigation.descriptions.authors,
            },
            {
              label: matchedAuthor.name,
              href: `/${lang}/authors/${matchedAuthor.slug}`,
              context: 'author-profile',
              ariaLabel: processTemplate(dictionary.breadcrumb.templates.authorProfile, {
                name: matchedAuthor.name
              }),
            },
            {
              label: articleData.title,
              href: `/${lang}/${articleData.rubricSlug}/${articleData.slug}`,
              context: 'article-from-author',
              ariaLabel: dictionary.navigation.descriptions.fromAuthor,
            },
          ];
          
          seoAlternatives.push(userPath);
        } else {
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
              href: `/${lang}/articles`,
              context: 'article-collection',
              ariaLabel: dictionary.navigation.descriptions.articles,
            },
            {
              label: matchedCategory.name,
              href: `/${lang}/category/${matchedCategory.slug}`,
              context: 'category-filter',
              ariaLabel: processTemplate(dictionary.breadcrumb.templates.categoryLabel, {
                name: matchedCategory.name
              }),
            },
            {
              label: articleData.title,
              href: `/${lang}/${articleData.rubricSlug}/${articleData.slug}`,
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
      // Handle /lang/articles referrer
      userPath = [
        baseHome,
        {
          label: dictionary.navigation.labels.articles,
          href: `/${lang}/articles`,
          context: 'articles-collection',
          ariaLabel: dictionary.navigation.descriptions.articles,
        },
        {
          label: articleData.title,
          href: `/${lang}/${articleData.rubricSlug}/${articleData.slug}`,
          context: 'article-from-articles',
          ariaLabel: processTemplate(dictionary.breadcrumb.templates.fromArticles, {}),
        },
      ];
      
      seoAlternatives.push(userPath);
      break;

    case 'featured':
      userPath = [
        baseHome,
        {
          label: articleData.title,
          href: `/${lang}/${articleData.rubricSlug}/${articleData.slug}`,
          context: 'featured-article',
          ariaLabel: dictionary.navigation.descriptions.fromFeatured,
        },
      ];
      
      seoAlternatives.push(userPath);
      break;

    case 'search':
      const searchLabel = context.contextData?.searchQuery 
        ? processTemplate(dictionary.breadcrumb.templates.searchWithQuery, {
            query: context.contextData.searchQuery
          })
        : dictionary.navigation.labels.search;
        
      userPath = [
        baseHome,
        {
          label: searchLabel,
          href: `/${lang}/search`,
          context: 'search-results',
          ariaLabel: dictionary.navigation.descriptions.fromSearch,
        },
        {
          label: articleData.title,
          href: `/${lang}/${articleData.rubricSlug}/${articleData.slug}`,
          context: 'article-from-search',
          ariaLabel: processTemplate(dictionary.breadcrumb.templates.fromSearch, {
            title: articleData.title
          }),
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