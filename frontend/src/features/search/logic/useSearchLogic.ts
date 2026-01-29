// src/features/search/logic/useSearchLogic.ts
import { useReducer, useRef, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOutsideClick } from '@/lib/hooks';
import { searchReducer, getInitialState } from './searchReducer';
import { handleSearchScenario } from './searchScenarios';
import { useSearch } from './useSearch';
import { SearchUIState } from '../types';
import { Lang } from '@/config/i18n';
import { createSearchUrl } from '../utils/createSearchUrl';

interface UseSearchLogicProps {
  lang: Lang;
  initialQuery?: string;
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
    handleClear: () => void;
  };
  refs: {
    containerRef: React.RefObject<HTMLDivElement | null>;
    inputRef: React.RefObject<HTMLInputElement | null>;
  };
  utils: {
    hasNavigableContent: boolean;
    iconType: 'search' | 'close';
  };
}

export function useSearchLogic({
  lang,
  initialQuery,
  onSearchComplete
}: UseSearchLogicProps): UseSearchLogicReturn {
  const [state, dispatch] = useReducer(searchReducer, undefined, getInitialState);
  const { handleSearch } = useSearch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize query from URL if present
  useEffect(() => {
    if (initialQuery && initialQuery !== state.query) {
      dispatch({ type: 'SET_QUERY', payload: initialQuery });
      // Set status to success when showing results page
      if (initialQuery.length >= 3) {
        dispatch({ 
          type: 'SET_SUGGESTIONS',
          payload: [] // Empty suggestions array for results page
        });
      }
    }
  }, [initialQuery]); // Only run when initialQuery changes
  
  const hasNavigableContent = state.dropdown.content === 'suggestions' && state.suggestions.length > 0;

  const cleanupAndClose = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
    
    handleSearchScenario({
      type: 'SCENARIO_COLLAPSE_SEARCH',
      dispatch
    });

    onSearchComplete?.();
  }, [dispatch, onSearchComplete]);

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
    } else if (value.length > 0) {
      // Clear suggestions and show min chars message
      dispatch({ type: 'CLEAR_SUGGESTIONS' });
    }
  }, [handleSearch]);

  const handleSearchButton = useCallback(() => {
    if (hasNavigableContent) {
      const searchUrl = createSearchUrl(state.query, searchParams);
      router.push(`/${lang}${searchUrl}`);
      onSearchComplete?.();
      return;
    }
  
    handleSearchScenario({
      type: 'SCENARIO_COLLAPSE_SEARCH',
      dispatch
    });
  }, [state.query, lang, searchParams, router, hasNavigableContent, onSearchComplete]);

  const getIconType = useCallback(() => {
    if (
      (state.searchStatus.type === 'minChars' && state.query.length > 0) ||
      state.searchStatus.type === 'noResults'
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
          const selectedSuggestion = state.suggestions[state.selectedIndex];
          cleanupAndClose();
          
          let targetUrl: string;
          if (selectedSuggestion.type === 'author') {
            targetUrl = `/${lang}/authors/${selectedSuggestion.slug}`;
          } else if (selectedSuggestion.type === 'category') {
            targetUrl = `/${lang}/categories/${selectedSuggestion.slug}`;
          } else {
            targetUrl = `/${lang}/${selectedSuggestion.rubric_slug}/${selectedSuggestion.slug}`;
          }
          
          router.push(targetUrl);
        } else if (hasNavigableContent && state.query.length >= 3) {
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
    handleSearchScenario({
      type: 'SCENARIO_EXPAND_SEARCH',
      dispatch
    });
  }, []);

  const handleClear = useCallback(() => {
  dispatch({ type: 'RESET_STATE' });
  inputRef.current?.focus();
}, []);

  useOutsideClick(
    containerRef,
    null,
    state.dropdown.visibility === 'visible',
    () => {
      handleSearchScenario({
        type: 'SCENARIO_COLLAPSE_SEARCH',
        dispatch
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
      handleClear
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