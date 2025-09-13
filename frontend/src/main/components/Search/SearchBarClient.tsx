// src/main/components/Search/SearchBarClient.tsx
'use client'

import React from 'react';
import { Dictionary, Lang } from '@/main/lib/dictionary/types';
import SearchBar from './SearchBar';

interface SearchBarClientProps {
  dictionary: Dictionary;
  lang: Lang;
  className?: string;
  onSearchComplete?: () => void;
}

/**
 * Client wrapper for SearchBar to handle client-side hooks
 * This allows SearchBar to be used in server components
 */
export default function SearchBarClient({
  dictionary,
  lang,
  className = '',
  onSearchComplete
}: SearchBarClientProps) {
  return (
    <SearchBar
      dictionary={dictionary}
      lang={lang}
      className={className}
      onSearchComplete={onSearchComplete}
    />
  );
}