// src/features/navigation/Breadcrumbs/BreadcrumbsWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import UnifiedBreadcrumbs from './UnifiedBreadcrumbs';
import { RubricBasic, Category } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';

interface BreadcrumbsWrapperProps {
  lang: Lang;
  dictionary: Dictionary;
  rubrics: RubricBasic[];
  categories: Category[];
  authorName?: string;
}

export default function BreadcrumbsWrapper({
  lang,
  dictionary,
  rubrics,
  categories,
  authorName,
}: BreadcrumbsWrapperProps) {
  const pathname = usePathname();

  return (
    <UnifiedBreadcrumbs
      lang={lang}
      dictionary={dictionary}
      rubrics={rubrics}
      categories={categories}
      pathname={pathname}
      authorName={authorName}
    />
  );
}