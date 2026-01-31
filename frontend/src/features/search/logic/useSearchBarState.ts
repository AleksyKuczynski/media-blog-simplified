// src/features/search/logic/useSearchBarState.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Lang } from '@/config/i18n';

interface UseSearchBarStateProps {
  lang: Lang;
  currentQuery?: string;
  showSorting?: boolean;
  onDropdownClose?: () => void;
}

export function useSearchBarState({
  lang,
  currentQuery = '',
  showSorting = false,
  onDropdownClose
}: UseSearchBarStateProps) {
  const router = useRouter();
  const [isEditingQuery, setIsEditingQuery] = useState(false);

  const handleQueryChange = useCallback((newQuery: string) => {
    const isEditing = showSorting && newQuery !== currentQuery;
    setIsEditingQuery(isEditing);
  }, [showSorting, currentQuery]);

  const handleBlur = useCallback(() => {
    // Reset editing state when unfocused without submitting
    setIsEditingQuery(false);
  }, []);

  const handleSearchSubmit = useCallback((
    query: string,
    cleanupAndClose: () => void
  ) => {
    const url = `/${lang}/search?search=${encodeURIComponent(query)}&sort=desc`;
    cleanupAndClose();
    router.push(url);
    setIsEditingQuery(false);
    onDropdownClose?.();
  }, [lang, router, onDropdownClose]);

  const handleInputChange = useCallback(async (
    value: string,
    originalHandler: (value: string) => Promise<void>
  ) => {
    handleQueryChange(value);
    await originalHandler(value);
  }, [handleQueryChange]);

  const handleKeyDown = useCallback((
    e: React.KeyboardEvent<HTMLInputElement>,
    query: string,
    selectedIndex: number,
    originalHandler: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    cleanupAndClose: () => void
  ) => {
    if (e.key === 'Enter' && query.length >= 3 && selectedIndex < 0) {
      e.preventDefault();
      handleSearchSubmit(query, cleanupAndClose);
      return;
    }
    originalHandler(e);
  }, [handleSearchSubmit]);

  return {
    isEditingQuery,
    handleInputChange,
    handleKeyDown,
    handleBlur
  };
}