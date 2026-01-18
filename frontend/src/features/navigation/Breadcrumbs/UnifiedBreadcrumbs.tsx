// src/features/navigation/Breadcrumbs/UnifiedBreadcrumbs.tsx
import Link from 'next/link';
import { ChevronRightIcon } from '@/shared/primitives/Icons';
import { RubricBasic, Category } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';
import { BREADCRUMB_STYLES, SIMPLE_BREADCRUMB_STYLES } from './styles';

interface UnifiedBreadcrumbsProps {
  lang: Lang;
  dictionary: Dictionary;
  rubrics: RubricBasic[];
  categories?: Category[];
  pathname: string;
  authorName?: string;
}

interface BreadcrumbItem {
  label: string;
  href: string;
}

const Chevron = () => (
  <span className={BREADCRUMB_STYLES.separator.container}>
    <ChevronRightIcon className={BREADCRUMB_STYLES.separator.icon} aria-hidden="true" />
  </span>
);

export default function UnifiedBreadcrumbs({
  lang,
  dictionary,
  rubrics,
  categories = [],
  pathname,
  authorName,
}: UnifiedBreadcrumbsProps) {
  
  const pathSegments = pathname.split('/').filter(Boolean);
  const segments = pathSegments[0] === lang ? pathSegments.slice(1) : pathSegments;
  
  const breadcrumbs: BreadcrumbItem[] = [
    { 
      label: dictionary.navigation.labels.home, 
      href: `/${lang}` 
    }
  ];

  // Handle different page types
  if (segments[0] === 'rubrics') {
    if (segments.length === 1) {
      breadcrumbs.push({
        label: dictionary.navigation.labels.rubrics,
        href: `/${lang}/rubrics`
      });
    }
  } 
  else if (segments[0] === 'authors') {
    if (segments.length === 1) {
      breadcrumbs.push({
        label: dictionary.navigation.labels.authors,
        href: `/${lang}/authors`
      });
    } else {
      breadcrumbs.push({
        label: dictionary.navigation.labels.authors,
        href: `/${lang}/authors`
      });
      
      const authorSlug = segments[1];
      
      breadcrumbs.push({
        label: authorName || authorSlug,
        href: pathname
      });
    }
  }
  else if (segments[0] === 'category') {
    breadcrumbs.push({
      label: dictionary.navigation.labels.articles,
      href: `/${lang}/articles`
    });
    
    const categorySlug = segments[1];
    const category = categories.find(c => c.slug === categorySlug);
    if (category) {
      breadcrumbs.push({
        label: category.name,
        href: pathname
      });
    }
  }
  else if (segments[0] === 'articles') {
    if (segments.length === 1) {
      breadcrumbs.push({
        label: dictionary.navigation.labels.articles,
        href: `/${lang}/articles`
      });
    }
  }
  else if (rubrics.some(r => r.slug === segments[0])) {
    breadcrumbs.push({
      label: dictionary.navigation.labels.rubrics,
      href: `/${lang}/rubrics`
    });
    
    const rubric = rubrics.find(r => r.slug === segments[0]);
    if (rubric) {
      breadcrumbs.push({
        label: rubric.name,
        href: pathname
      });
    }
  }

  if (breadcrumbs.length === 1) {
    return null;
  }

  return (
    <nav 
      aria-label={dictionary.navigation.accessibility.breadcrumbNavigation}
      className={BREADCRUMB_STYLES.nav.container}
      itemScope 
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className={BREADCRUMB_STYLES.list.base}>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          const itemClass = index === 0 
            ? SIMPLE_BREADCRUMB_STYLES.item.home
            : isLast
            ? SIMPLE_BREADCRUMB_STYLES.item.last
            : SIMPLE_BREADCRUMB_STYLES.item.context;
          
          const linkClass = index === 0 
            ? SIMPLE_BREADCRUMB_STYLES.link.home
            : SIMPLE_BREADCRUMB_STYLES.link.context;
          
          return (
            <li 
              key={item.href} 
              className={itemClass}
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && <Chevron />}
              {isLast ? (
                <span 
                  className={SIMPLE_BREADCRUMB_STYLES.currentPage.base}
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
  );
}