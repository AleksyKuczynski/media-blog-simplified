// src/features/navigation/Breadcrumbs/BreadcrumbsWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import UnifiedBreadcrumbs from './UnifiedBreadcrumbs';
import { RubricBasic, Category } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';
import { fetchAuthorBySlug } from '@/api/directus';

interface BreadcrumbsWrapperProps {
  lang: Lang;
  dictionary: Dictionary;
  rubrics: RubricBasic[];
  categories: Category[];
  authorName?: string; // Server-provided on initial load
}

export default function BreadcrumbsWrapper({
  lang,
  dictionary,
  rubrics,
  categories,
  authorName: serverAuthorName,
}: BreadcrumbsWrapperProps) {
  const pathname = usePathname();
  const [authorName, setAuthorName] = useState<string | undefined>(serverAuthorName);

  // Fetch author name on client-side navigation
  useEffect(() => {
    // If we already have server-provided name and pathname hasn't changed, use it
    if (serverAuthorName) {
      setAuthorName(serverAuthorName);
      return;
    }

    // Check if we're on an author page
    if (pathname.includes('/authors/')) {
      const match = pathname.match(/\/authors\/([^/?#]+)/);
      if (match && match[1]) {
        const authorSlug = decodeURIComponent(match[1]);
        
        // Fetch author name
        fetchAuthorBySlug(authorSlug, lang)
          .then(author => {
            if (author) {
              setAuthorName(author.name);
            }
          })
          .catch(error => {
            console.error('Error fetching author:', error);
          });
      }
    } else {
      // Not on author page, clear author name
      setAuthorName(undefined);
    }
  }, [pathname, lang, serverAuthorName]);

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