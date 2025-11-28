// src/main/components/Main/Breadcrumbs.tsx
import Link from 'next/link';
import { ChevronRightIcon } from '@/features/primitives/Icons';
import { RubricBasic } from '@/main/lib/directus/directusInterfaces';
import { Lang } from '@/main/lib/dictionary';

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
  <span className="mx-2 flex-shrink-0">
    <ChevronRightIcon className="w-3 h-3 text-pr-cont" aria-hidden="true" />
  </span>
);

export default function Breadcrumbs({ items, rubrics, lang, translations }: BreadcrumbsProps) {
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
      className="text-sm mb-8 overflow-x-auto"
      itemScope 
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="list-none inline-flex items-center whitespace-nowrap">
        {fullPath.map((item, index) => (
          <li 
            key={item.href} 
            className="flex items-center"
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && <Chevron />}
            {index === fullPath.length - 1 ? (
              <span 
                className="font-medium text-on-sf" 
                aria-current="page"
                itemProp="name"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-on-sf-var hover:text-on-sf transition-colors duration-200"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}