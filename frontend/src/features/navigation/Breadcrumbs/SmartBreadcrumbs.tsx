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
    rubricName: string;
    authors?: Array<{ name: string; slug: string }>;
    categories?: Array<{ name: string; slug: string }>;
  };
  dictionary: Dictionary;
  lang: Lang;
  fromParam?: string;
  className?: string;
}

export default function SmartBreadcrumbs({
  articleData,
  dictionary,
  lang,
  fromParam,
  className,
}: SmartBreadcrumbsProps) {
  const context = detectBreadcrumbContext(fromParam);

  const { userPath, canonicalPath, seoAlternatives } = generateContextualBreadcrumbs(
    context,
    articleData,
    dictionary,
    lang,
  );

  const displayPath = userPath.length > 0 ? userPath : canonicalPath;
  const baseUrl = dictionary.seo.site.url.replace(/\/$/, '');

  const schemas = generateSmartBreadcrumbSchemas(
    baseUrl,
    lang,
    articleData.rubricSlug,
    articleData.slug,
    displayPath,
    canonicalPath,
    seoAlternatives,
  );

  return (
    <>
      <BreadcrumbSchemas schemas={schemas} />
      <nav
        aria-label={dictionary.navigation.accessibility.breadcrumbNavigation}
        className={className || BREADCRUMB_STYLES.nav.container}
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className={BREADCRUMB_STYLES.list.base}>
          {displayPath.map((item, index) => {
            const isLast = index === displayPath.length - 1;
            const itemClass =
              index === 0
                ? SMART_BREADCRUMB_STYLES.item.home
                : isLast
                ? SMART_BREADCRUMB_STYLES.item.article
                : index === 1
                ? SMART_BREADCRUMB_STYLES.item.context
                : SMART_BREADCRUMB_STYLES.item.parent;
            const linkClass =
              index === 0
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
                {index > 0 && (
                  <span className={BREADCRUMB_STYLES.separator.container}>
                    <ChevronRightIcon
                      className={BREADCRUMB_STYLES.separator.icon}
                      aria-hidden="true"
                    />
                  </span>
                )}
                {isLast ? (
                  <span
                    className={SMART_BREADCRUMB_STYLES.currentPage.base}
                    itemProp="name"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className={linkClass} itemProp="item" aria-label={item.ariaLabel}>
                    <span itemProp="name" className="truncate block">
                      {item.label}
                    </span>
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

export function enhanceArticleForBreadcrumbs(article: any, rubricName: string, rubricSlug: string) {
  return {
    title: article.translations[0]?.title || article.slug,
    slug: article.slug,
    rubricSlug,
    rubricName,
    authors: article.authorsWithDetails?.map((a: any) => ({ name: a.name, slug: a.slug })) || [],
    categories: article.categories || [],
  };
}