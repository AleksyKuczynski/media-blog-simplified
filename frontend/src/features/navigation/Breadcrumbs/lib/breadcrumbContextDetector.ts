// src/features/navigation/Breadcrumbs/lib/breadcrumbContextDetector.ts

import { Dictionary, Lang } from '@/config/i18n';
import { BreadcrumbContext, SmartBreadcrumbItem } from '@/features/navigation/Breadcrumbs/types';
import { processTemplate } from '@/config/i18n/helpers/templates';

export function detectBreadcrumbContext(
  fromParam: string | undefined,
): BreadcrumbContext {
  if (!fromParam) return { type: 'direct' };

  const decoded = decodeURIComponent(fromParam);

  if (decoded === 'home') return { type: 'featured' };
  if (decoded === 'articles') return { type: 'articles' };

  if (decoded.startsWith('rubric:')) {
    return {
      type: 'rubric',
      contextData: { rubricSlug: decoded.slice(7) },
    };
  }

  if (decoded.startsWith('author:')) {
    return {
      type: 'author',
      contextData: { authorSlug: decoded.slice(7) },
    };
  }

  if (decoded.startsWith('category:')) {
    return {
      type: 'category',
      contextData: { categorySlug: decoded.slice(9) },
    };
  }

  return { type: 'direct' };
}

export function generateContextualBreadcrumbs(
  context: BreadcrumbContext,
  articleData: {
    title: string;
    slug: string;
    rubricSlug: string;
    rubricName: string;
    authors?: Array<{ name: string; slug: string }>;
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

  const articleItem: SmartBreadcrumbItem = {
    label: articleData.title,
    href: `/${lang}/${articleData.rubricSlug}/${articleData.slug}`,
    ariaLabel: processTemplate(dictionary.breadcrumb.templates.articleLabel, {
      title: articleData.title,
    }),
  };

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
        name: articleData.rubricName,
      }),
    },
    articleItem,
  ];

  const seoAlternatives: SmartBreadcrumbItem[][] = [];
  let userPath: SmartBreadcrumbItem[];

  switch (context.type) {
    case 'featured':
      userPath = [baseHome, articleItem];
      seoAlternatives.push(canonicalPath);
      break;

    case 'articles':
      userPath = [
        baseHome,
        {
          label: dictionary.navigation.labels.articles,
          href: `/${lang}/articles`,
          ariaLabel: dictionary.navigation.descriptions.articles,
        },
        articleItem,
      ];
      seoAlternatives.push(canonicalPath);
      break;

    case 'rubric':
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
          ariaLabel: processTemplate(dictionary.breadcrumb.templates.rubricLabel, {
            name: articleData.rubricName,
          }),
        },
        articleItem,
      ];
      break;

    case 'author': {
      const authorSlug = context.contextData?.authorSlug;
      const matchedAuthor = articleData.authors?.find(a => a.slug === authorSlug);
      if (authorSlug && matchedAuthor) {
        userPath = [
          baseHome,
          {
            label: dictionary.navigation.labels.authors,
            href: `/${lang}/authors`,
            ariaLabel: dictionary.navigation.descriptions.authors,
          },
          {
            label: matchedAuthor.name,
            href: `/${lang}/authors/${authorSlug}`,
            ariaLabel: processTemplate(dictionary.breadcrumb.templates.authorProfile, {
              name: matchedAuthor.name,
            }),
          },
          articleItem,
        ];
        seoAlternatives.push(canonicalPath);
      } else {
        userPath = canonicalPath;
      }
      break;
    }

    case 'category': {
      const categorySlug = context.contextData?.categorySlug;
      const matchedCategory = articleData.categories?.find(c => c.slug === categorySlug);
      if (categorySlug && matchedCategory) {
        userPath = [
          baseHome,
          {
            label: dictionary.navigation.labels.articles,
            href: `/${lang}/articles`,
            ariaLabel: dictionary.navigation.descriptions.articles,
          },
          {
            label: matchedCategory.name,
            href: `/${lang}/categories/${categorySlug}`,
            ariaLabel: processTemplate(dictionary.breadcrumb.templates.categoryLabel, {
              name: matchedCategory.name,
            }),
          },
          articleItem,
        ];
        seoAlternatives.push(canonicalPath);
      } else {
        userPath = canonicalPath;
      }
      break;
    }

    default:
      // direct / refresh — show home > article only
      userPath = [baseHome, articleItem];
      seoAlternatives.push(canonicalPath);
      break;
  }

  return { userPath, canonicalPath, seoAlternatives };
}