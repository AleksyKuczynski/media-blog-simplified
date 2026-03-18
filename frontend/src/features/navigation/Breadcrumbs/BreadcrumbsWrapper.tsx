'use client';

import { usePathname } from 'next/navigation';
import Breadcrumbs from './Breadcrumbs';
import { RubricBasic, Category } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';

interface BreadcrumbsWrapperProps {
  lang: Lang;
  dictionary: Dictionary;
  rubrics: RubricBasic[];
  categories: Category[];
}

export default function BreadcrumbsWrapper({
  lang,
  dictionary,
  rubrics,
  categories,
}: BreadcrumbsWrapperProps) {
  const pathname = usePathname();

  // Author detail pages render their own Breadcrumbs via authors/[slug]/layout.tsx
  if (/\/authors\/[^/]+/.test(pathname)) return null;

  return (
    <Breadcrumbs
      lang={lang}
      dictionary={dictionary}
      rubrics={rubrics}
      categories={categories}
      pathname={pathname}
    />
  );
}