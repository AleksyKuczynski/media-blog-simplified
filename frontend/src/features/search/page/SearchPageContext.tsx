// src/features/search/page/SearchPageContext.tsx
'use client'

import { createContext, useContext, ReactNode } from 'react';
import { Dictionary, Lang } from '@/config/i18n';

interface SearchPageContextValue {
  dictionary: Dictionary;
  lang: Lang;
  currentQuery: string;
  hasResults: boolean;
  showSorting: boolean;
}

const SearchPageContext = createContext<SearchPageContextValue | null>(null);

export function useSearchPageContext() {
  const context = useContext(SearchPageContext);
  if (!context) {
    throw new Error('useSearchPageContext must be used within SearchPageProvider');
  }
  return context;
}

interface SearchPageProviderProps {
  children: ReactNode;
  value: SearchPageContextValue;
}

export function SearchPageProvider({ children, value }: SearchPageProviderProps) {
  return (
    <SearchPageContext.Provider value={value}>
      {children}
    </SearchPageContext.Provider>
  );
}