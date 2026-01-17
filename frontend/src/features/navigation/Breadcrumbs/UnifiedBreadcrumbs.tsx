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

/**
 * Unified Breadcrumbs Component
 * Generates breadcrumbs from URL pathname for collection pages
 * (rubrics, categories, authors, articles list)
 */
export default function UnifiedBreadcrumbs({
  lang,
  dictionary,
  rubrics,
  categories = [],
  pathname,
}: UnifiedBreadcrumbsProps) {
  
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // Remove lang from segments
  const segments = pathSegments[0] === lang ? pathSegments.slice(1) : pathSegments;
  
  // Always start with home
  const breadcrumbs: BreadcrumbItem[] = [
    { 
      label: dictionary.navigation.labels.home, 
      href: `/${lang}` 
    }
  ];

  // Handle different page types
  if (segments[0] === 'rubrics') {
    // /rubrics or /rubrics/[slug] - but [slug] is now in (collections)/[rubric]
    // This handles /rubrics only
    // No additional breadcrumb needed for listing page
  } 
  else if (segments[0] === 'authors') {
    // /authors or /authors/[slug]
    if (segments.length === 1) {
      // Just /authors listing - no additional crumb needed
    } else {
      // /authors/[slug] - author profile
      breadcrumbs.push({
        label: dictionary.navigation.labels.authors,
        href: `/${lang}/authors`
      });
      // Last segment is author name - will be handled below
    }
  }
  else if (segments[0] === 'category') {
    // /category/[slug]
    breadcrumbs.push({
      label: dictionary.navigation.labels.articles,
      href: `/${lang}/articles`
    });
    
    // Find category name
    const categorySlug = segments[1];
    const category = categories.find(c => c.slug === categorySlug);
    if (category) {
      // Last item - will be handled below
    }
  }
  else if (segments[0] === 'articles') {
    // /articles listing - no additional crumb needed
  }
  else {
    // Rubric page: /[rubric]
    const rubricSlug = segments[0];
    const rubric = rubrics.find(r => r.slug === rubricSlug);
    
    if (rubric) {
      breadcrumbs.push({
        label: dictionary.navigation.labels.rubrics,
        href: `/${lang}/rubrics`
      });
      // Last item - will be handled below
    }
  }

  // Add last segment as current page (if not already a listing page)
  if (segments.length > 0) {
    const lastSegment = segments[segments.length - 1];
    
    // Don't add duplicate for listing pages
    if (!['rubrics', 'authors', 'articles'].includes(lastSegment)) {
      let label = lastSegment;
      
      // Try to get proper name for rubric/category/author
      if (segments[0] === 'category' && segments[1]) {
        const category = categories.find(c => c.slug === segments[1]);
        label = category?.name || lastSegment;
      } else if (rubrics.some(r => r.slug === lastSegment)) {
        const rubric = rubrics.find(r => r.slug === lastSegment);
        label = rubric?.name || lastSegment;
      }
      // For authors, we don't have the name here - would need to fetch
      // Keep slug for now or pass authors data as prop if needed
      
      breadcrumbs.push({
        label,
        href: pathname
      });
    }
  }

  // If only home, don't render breadcrumbs
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
                  aria-current="page"
                  itemProp="name"
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
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}