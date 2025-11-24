// src/main/lib/utils/breadcrumbContextDetector.ts
// Detects breadcrumb context and handles language switching

import { headers } from 'next/headers';
import { Lang } from '@/main/lib/dictionary';
import { BreadcrumbContext, SmartBreadcrumbItem } from '@/main/components/Navigation/Breadcrumbs/types';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import Dictionary from '../dictionary/types';

/**
 * Detect user's navigation context based on referrer and URL patterns
 * SPECIAL HANDLING: Detects language switching and shows simplified breadcrumbs
 */
export async function detectBreadcrumbContext(
  dictionary: Dictionary,
  lang: Lang,
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
    
    // Check if referrer is from a different language (language switch scenario)
    const referrerLangMatch = referrerPath.match(/^\/([a-z]{2})\//);
    const referrerLang = referrerLangMatch ? referrerLangMatch[1] : null;
    
    if (referrerLang && referrerLang !== lang) {
      // User switched languages - show simplified breadcrumbs
      return {
        type: 'language-switch',
        referrerPath,
        contextData: {
          previousLang: referrerLang,
        },
      };
    }
    
    // Language-aware pattern matching
    const patterns = {
      author: new RegExp(`\\/${lang}\\/authors\\/([^\\/]+)$`),
      category: new RegExp(`\\/${lang}\\/category\\/([^\\/]+)$`),
      search: new RegExp(`\\/${lang}\\/search`),
      articles: new RegExp(`\\/${lang}\\/articles$`),
      rubrics: new RegExp(`\\/${lang}\\/rubrics$`),
      specificRubric: new RegExp(`\\/${lang}\\/([^\\/]+)$`),
      featured: new RegExp(`\\/${lang}$`),
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

    // Specific rubric page detection
    const rubricMatch = referrerPath.match(patterns.specificRubric);
    if (rubricMatch) {
      const rubricSlug = rubricMatch[1];
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

    // Default fallback
    return {
      type: 'direct',
      referrerPath,
    };

  } catch (error) {
    console.error('Error detecting breadcrumb context:', error);
    return {
      type: 'direct',
    };
  }
}

/**
 * Generate context-aware breadcrumb paths
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
  lang: Lang,
): {
  userPath: SmartBreadcrumbItem[];
  canonicalPath: SmartBreadcrumbItem[];
  seoAlternatives: SmartBreadcrumbItem[][];
} {
  
  const baseHome: SmartBreadcrumbItem = {
    label: dictionary.navigation.labels.home,
    href: `/${lang}`,
    ariaLabel: dictionary.navigation.descriptions.home,
  };

  // Canonical path (always rubric-based for SEO consistency)
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

  // Handle language switching with simplified breadcrumbs
  if (context.type === 'language-switch') {
    userPath = [
      baseHome,
      {
        label: articleData.title,
        href: `/${lang}/${articleData.rubricSlug}/${articleData.slug}`,
        ariaLabel: processTemplate(dictionary.breadcrumb.templates.articleLabel, {
          title: articleData.title
        }),
      },
    ];
    return { userPath, canonicalPath, seoAlternatives };
  }

  switch (context.type) {
    case 'rubric':
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
        userPath = canonicalPath;
      }
      break;

    case 'author':
      if (context.contextData?.authorSlug && articleData.authors && articleData.authors.length > 0) {
        const matchedAuthor = articleData.authors.find(
          author => author.slug === context.contextData?.authorSlug
        );
        
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
          userPath = canonicalPath;
        }
      } else {
        userPath = canonicalPath;
      }
      break;

    case 'articles':
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
            search: dictionary.navigation.labels.search,
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
      userPath = canonicalPath;
      break;
  }

  return {
    userPath,
    canonicalPath,
    seoAlternatives,
  };
}