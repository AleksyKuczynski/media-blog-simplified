// src/features/search/page/SearchPageWrapper.tsx
'use client'

import { ReactNode } from 'react';
import SearchBarForm from './SearchBarForm';
import { useSearchParams } from 'next/navigation';
import { Dictionary, Lang } from '@/config/i18n';

interface SearchPageWrapperProps {
  children: ReactNode;
  dictionary: Dictionary;
  lang: Lang;
  currentQuery: string;
  hasResults: boolean;
  showSorting: boolean;
  resultsMode: 'results' | 'no-results' | 'invalid-query' | null;
}

export default function SearchPageWrapper({
  children,
  dictionary,
  lang,
  currentQuery,
  hasResults,
  showSorting,
  resultsMode
}: SearchPageWrapperProps) {
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'desc';

  return (
    <>
      <SearchBarForm
        dictionary={dictionary}
        lang={lang}
        currentQuery={currentQuery}
        hasResults={hasResults}
        showSorting={showSorting}
        currentSort={currentSort}
        resultsMode={resultsMode}
      />
      {children}
    </>
  );
}