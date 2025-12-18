// src/features/navigation/Breadcrumbs/Breadcrumbs.tsx
import Link from 'next/link';
import { ChevronRightIcon } from '@/shared/primitives/Icons';
import { RubricBasic } from '@/api/directus';
import { Lang } from '@/config/i18n';
import { BREADCRUMB_STYLES, SIMPLE_BREADCRUMB_STYLES } from './styles';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  rubrics: RubricBasic[];
  lang: Lang;
  translations: {
    home: string;
    allRubrics: string;
    allAuthors: string;
  };
}

const Chevron = () => (
  <span className={BREADCRUMB_STYLES.separator.container}>
    <ChevronRightIcon className={BREADCRUMB_STYLES.separator.icon} aria-hidden="true" />
  </span>
);

export default function Breadcrumbs({ items, lang, translations }: BreadcrumbsProps) {
  const fullPath: BreadcrumbItem[] = [
    { label: translations.home, href: `/${lang}` },
  ];

  // Determine the context based on the first item
  const firstItem = items[0];
  if (firstItem) {
    if (firstItem.href === `/${lang}/authors` || firstItem.href.startsWith(`/${lang}/authors/`)) {
      // Authors context
      if (firstItem.href !== `/${lang}/authors`) {
        fullPath.push({ label: translations.allAuthors, href: `/${lang}/authors` });
      }
    } else if (firstItem.href === `/${lang}/rubrics` || firstItem.href.startsWith(`/${lang}/`)) {
      // Rubrics context
      if (firstItem.href !== `/${lang}/rubrics`) {
        fullPath.push({ label: translations.allRubrics, href: `/${lang}/rubrics` });
      }
    }
  }

  // Add items as-is since labels are already translated when passed in
  items.forEach(item => {
    if (!fullPath.some(existingItem => existingItem.href === item.href)) {
      fullPath.push(item);
    }
  });

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={BREADCRUMB_STYLES.nav.container}
      itemScope 
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className={BREADCRUMB_STYLES.list.base}>
        {fullPath.map((item, index) => {
          const isLast = index === fullPath.length - 1;
          
          // Determine item styling
          const itemClass = index === 0 
            ? SIMPLE_BREADCRUMB_STYLES.item.home
            : isLast
            ? SIMPLE_BREADCRUMB_STYLES.item.last
            : SIMPLE_BREADCRUMB_STYLES.item.context;
          
          // Determine link styling
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