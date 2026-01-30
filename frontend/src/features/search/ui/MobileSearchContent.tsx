// src/features/search/ui/MobileSearchContent.tsx
'use client'

import React, { useEffect } from 'react';
import SearchInput from './SearchInput';
import SearchSuggestionList from './SearchSuggestionList';
import { useSearchLogic } from '../logic/useSearchLogic';
import { useMobileSearchHandlers } from '../logic/useMobileSearchHandlers';
import { Dictionary, Lang } from '@/config/i18n';
import { SearchIcon } from '@/shared/primitives/Icons';
import { MOBILE_SEARCH_STYLES } from '../search.styles';

interface MobileSearchContentProps {
  readonly dictionary: Dictionary;
  readonly lang: Lang;
  readonly onSearchComplete?: () => void;
}

export default function MobileSearchContent({
  dictionary,
  lang,
  onSearchComplete
}: MobileSearchContentProps) {
  
  const {
    state,
    handlers,
    refs,
  } = useSearchLogic({
    lang,
    onSearchComplete
  });

  const mobileHandlers = useMobileSearchHandlers({
    state,
    lang,
    inputRef: refs.inputRef as React.RefObject<HTMLInputElement>,
    onSearchComplete
  });

  // Auto-focus input when panel opens
  useEffect(() => {
    if (refs.inputRef && 'current' in refs.inputRef) {
      const timer = setTimeout(() => {
        refs.inputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [refs.inputRef]);

  return (
    <search 
      ref={refs.containerRef as React.RefObject<HTMLElement>}
      className={MOBILE_SEARCH_STYLES.container}
      role="search"
      aria-label={dictionary.search.accessibility.searchLabel}
      itemScope
      itemType="https://schema.org/SearchAction"
    >
      <meta itemProp="target" content={`https://${dictionary.seo.site.url}/${lang}/search?q={search_term_string}`} />
      <meta itemProp="query-input" content="required name=search_term_string" />
      
      <div className={MOBILE_SEARCH_STYLES.inputContainer}>
        <div className={MOBILE_SEARCH_STYLES.inputWrapper}>
          <button
            type="button"
            onClick={mobileHandlers.handleSearchIconClick}
            className={MOBILE_SEARCH_STYLES.iconWrapper}
            aria-label={dictionary.search.accessibility.searchButtonLabel}
            disabled={state.query.length < 3}
          >
            <SearchIcon />
          </button>
          
          <SearchInput
            state={state}
            placeholder={dictionary.search.labels.placeholder}
            onChange={handlers.handleInputChange}
            onKeyDown={handlers.handleKeyDown}
            onFocus={handlers.handleFocus}
            onClear={handlers.handleClear}
            inputRef={refs.inputRef as React.RefObject<HTMLInputElement>}
            ariaLabel={dictionary.search.accessibility.searchInputLabel}
            ariaDescription={dictionary.search.accessibility.searchDescription}
            isMobile={true}
          />
        </div>
      </div>

      <div className={MOBILE_SEARCH_STYLES.suggestionsContainer}>
        <SearchSuggestionList
          suggestions={state.suggestions}
          query={state.query}
          searchStatus={state.searchStatus}
          selectedIndex={state.selectedIndex}
          dictionary={dictionary}
          onSuggestionSelect={mobileHandlers.handleSuggestionSelect}
          onSuggestionKeyDown={mobileHandlers.handleSuggestionKeyDown}
          variant="mobile"
          styles={{
            emptyState: MOBILE_SEARCH_STYLES.emptyState,
            emptyIcon: MOBILE_SEARCH_STYLES.emptyIcon,
            emptyText: MOBILE_SEARCH_STYLES.emptyText,
            tips: MOBILE_SEARCH_STYLES.tips,
            suggestionsList: MOBILE_SEARCH_STYLES.suggestionsList,
            suggestion: MOBILE_SEARCH_STYLES.suggestion
          }}
        />
      </div>
    </search>
  );
}