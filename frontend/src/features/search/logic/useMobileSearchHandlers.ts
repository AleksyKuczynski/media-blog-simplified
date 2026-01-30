// src/features/search/logic/useMobileSearchHandlers.ts
import { useRouter } from 'next/navigation';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { Lang } from '@/config/i18n';
import { SearchUIState } from '../types';
import { createSearchUrl } from '../utils/createSearchUrl';
import { SearchResult } from '@/api/directus';

interface UseMobileSearchHandlersProps {
  state: SearchUIState;
  lang: Lang;
  inputRef: React.RefObject<HTMLInputElement>;
  onSearchComplete?: () => void;
}

export function useMobileSearchHandlers({
  state,
  lang,
  inputRef,
  onSearchComplete
}: UseMobileSearchHandlersProps) {
  const router = useRouter();

  const handleSearchIconClick = () => {
    if (state.query.length >= 3) {
      const searchUrl = createSearchUrl(state.query, new ReadonlyURLSearchParams());
      router.push(`/${lang}${searchUrl}`);
      onSearchComplete?.();
    }
  };

  const handleSuggestionSelect = (index: number) => {
    const suggestion = state.suggestions[index];
    if (!suggestion) return;

    navigateToSuggestion(suggestion);
    onSearchComplete?.();
  };

  const handleSuggestionKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        handleSuggestionSelect(index);
        break;
      case 'ArrowDown':
        e.preventDefault();
        focusNextSuggestion(index);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusPreviousSuggestion(index);
        break;
      case 'Escape':
        e.preventDefault();
        inputRef.current?.focus();
        break;
    }
  };

  // Helper functions
  const navigateToSuggestion = (suggestion: SearchResult) => {
    if (suggestion.type === 'author') {
      router.push(`/${lang}/authors/${suggestion.slug}`);
    } else if (suggestion.type === 'category') {
      router.push(`/${lang}/categories/category=${suggestion.slug}`);
    } else {
      router.push(`/${lang}/${suggestion.rubric_slug}/${suggestion.slug}`);
    }
  };

  const focusNextSuggestion = (currentIndex: number) => {
    const nextIndex = currentIndex < state.suggestions.length - 1 ? currentIndex + 1 : 0;
    document.getElementById(`mobile-suggestion-${nextIndex}`)?.focus();
  };

  const focusPreviousSuggestion = (currentIndex: number) => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : state.suggestions.length - 1;
    document.getElementById(`mobile-suggestion-${prevIndex}`)?.focus();
  };

  return {
    handleSearchIconClick,
    handleSuggestionSelect,
    handleSuggestionKeyDown
  };
}