// src/main/components/Search/useSearchLogic.ts
import { useReducer, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOutsideClick } from '@/main/lib/hooks';
import { searchReducer, getInitialState } from '../desktop/searchReducer';
import { handleSearchScenario } from '../desktop/searchScenarios';
import { createSearchUrl } from '@/main/lib/utils';
import { useSearch } from './useSearch';
import { SearchUIState } from '../types';
import { Lang } from '@/main/lib/dictionary';

interface UseSearchLogicProps {
  mode: 'standard' | 'expandable';
  lang: Lang;
  onSearchComplete?: () => void;
}

interface UseSearchLogicReturn {
  state: SearchUIState;
  handlers: {
    handleInputChange: (value: string) => Promise<void>;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleSelect: (index: number) => void;
    handleFocus: () => void;
    handleSearchButton: () => void;
  };
  refs: {
    containerRef: React.RefObject<HTMLDivElement | null>; // ✅ FIXED: Add | null
    inputRef: React.RefObject<HTMLInputElement | null>;   // ✅ FIXED: Add | null
  };
  utils: {
    hasNavigableContent: boolean;
    iconType: 'search' | 'close';
  };
}

export function useSearchLogic({
  mode,
  lang,
  onSearchComplete
}: UseSearchLogicProps): UseSearchLogicReturn {
  const [state, dispatch] = useReducer(searchReducer, mode, getInitialState);
  const { handleSearch } = useSearch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasNavigableContent = state.dropdown.content === 'suggestions' && 
                            state.suggestions.length > 0;

  const cleanupAndClose = useCallback(() => {
    // Czyszczenie query
    dispatch({ type: 'RESET_STATE' });
    
    // Zamykanie komponentu
    handleSearchScenario({
      type: 'SCENARIO_COLLAPSE_SEARCH',
      dispatch,
      mode
    });

    // Wywołanie callback'a zamknięcia (dla MobileNav)
    onSearchComplete?.();
  }, [dispatch, mode, onSearchComplete]);

  const handleInputChange = useCallback(async (value: string) => {
    handleSearchScenario({
      type: 'SCENARIO_EXECUTE_SEARCH',
      payload: value,
      dispatch
    });
  
    if (value.length >= 3) {
      try {
        const searchResults = await handleSearch(value);
        dispatch({ 
          type: 'SET_SUGGESTIONS',
          payload: searchResults 
        });
      } catch (error) {
        dispatch({ type: 'SET_SEARCH_ERROR' });
      }
    }
  }, [handleSearch]);

  const handleSearchButton = useCallback(() => {
    if (mode === 'expandable' && state.input.visibility === 'hidden' && inputRef) {
      handleSearchScenario({
        type: 'SCENARIO_EXPAND_SEARCH',
        dispatch,
        mode,
        inputRef: inputRef as React.RefObject<HTMLInputElement>
      });
      return;
    }
  
    // Najpierw sprawdzamy czy można nawigować
    if (hasNavigableContent) {
      const searchUrl = createSearchUrl(state.query, searchParams);
      router.push(`/${lang}${searchUrl}`);
      onSearchComplete?.();
      return;
    }
  
    // Jeśli nie ma wystarczającej liczby znaków, zamykamy dropdown
    handleSearchScenario({
      type: 'SCENARIO_COLLAPSE_SEARCH',
      dispatch,
      mode
    });
  }, [mode, state.input.visibility, state.query, lang, searchParams, router, inputRef, hasNavigableContent, onSearchComplete]);

  const getIconType = useCallback(() => {
    // Przypadki dla CloseIcon
    if (
      (state.searchStatus.type === 'minChars' && state.query.length > 0) || // invalid query
      state.searchStatus.type === 'noResults' // brak wyników
    ) {
      return 'close';
    }
  
    return 'search';
  }, [state.searchStatus.type, state.query.length]);
  

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        handleSearchScenario({
          type: 'SCENARIO_NAVIGATE_RESULTS',
          direction: e.key === 'ArrowDown' ? 'down' : 'up',
          dispatch
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (state.selectedIndex >= 0 && state.suggestions[state.selectedIndex]) {
          // Nawigacja z wybranej sugestii
          const selectedSuggestion = state.suggestions[state.selectedIndex];
          cleanupAndClose();
          router.push(`/${lang}/${selectedSuggestion.slug}/${selectedSuggestion.slug}`);
        } else if (hasNavigableContent && state.query.length >= 3) {
          // Nawigacja z wprowadzonego tekstu
          const searchUrl = createSearchUrl(state.query, searchParams);
          cleanupAndClose();
          router.push(`/${lang}${searchUrl}`);
        }
        break;
      case 'Escape':
        e.preventDefault();
        cleanupAndClose();
        break;
    }
  }, [state.selectedIndex, state.suggestions, state.query, hasNavigableContent, lang, searchParams, router, cleanupAndClose]);

  const handleSelect = useCallback((index: number) => {
    const suggestion = state.suggestions[index];
    if (!suggestion) return;

    let targetUrl: string;
    if (suggestion.type === 'author') {
      targetUrl = `/${lang}/authors/${suggestion.slug}`;
    } else if (suggestion.type === 'category') {
      targetUrl = `/${lang}/articles?category=${suggestion.slug}`;
    } else {
      targetUrl = `/${lang}/${suggestion.rubric_slug}/${suggestion.slug}`;
    }

    router.push(targetUrl);
    cleanupAndClose();
  }, [state.suggestions, lang, router, cleanupAndClose]);

  const handleFocus = useCallback(() => {
    if (mode === 'standard') {
      // Zachowaj referencję do aktualnie sfokusowanego elementu
      const activeElement = document.activeElement;
      
      handleSearchScenario({
        type: 'SCENARIO_EXPAND_SEARCH',
        dispatch,
        mode,
        inputRef
      });
  
      // Przywróć focus po wykonaniu scenariusza
      if (activeElement instanceof HTMLElement) {
        activeElement.focus();
      }
    }
  }, [mode]);

  useOutsideClick(
    containerRef,
    null,
    mode === 'standard' || state.input.visibility !== 'hidden',
    () => {
      handleSearchScenario({
        type: 'SCENARIO_COLLAPSE_SEARCH',
        dispatch,
        mode
      });
    }
  );

  return {
    state,
    handlers: {
      handleInputChange,
      handleKeyDown,
      handleSelect,
      handleFocus,
      handleSearchButton,
    },
    refs: {
      containerRef,
      inputRef,
    },
    utils: {
      hasNavigableContent,
      iconType: getIconType()
    }
  };
}