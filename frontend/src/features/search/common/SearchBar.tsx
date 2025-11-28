// src/main/components/Search/SearchBar.tsx
// SEO-OPTIMIZED: Enhanced semantic markup for better search engine visibility
'use client'

import React from 'react';
import { SearchIcon, NavButton, CloseIcon } from '@/main/components/Interface';
import SearchInput from './SearchInput';
import SearchDropdown from './SearchDropdown';
import { useSearchLogic } from '../hooks/useSearchLogic';
import { Dictionary, Lang } from '@/main/lib/dictionary';

interface SearchBarProps {
  readonly dictionary: Dictionary;
  readonly lang: Lang;
  readonly className?: string;
  readonly onSearchComplete?: () => void;
}

/**
 * SearchBar - SEO-optimized search component with semantic HTML5
 * SEMANTIC: Uses <search> element and structured data for better SEO
 */
export default function SearchBar({
  dictionary,
  lang,
  className = '',
  onSearchComplete
}: SearchBarProps) {
  const {
    state,
    handlers,
    refs,
    utils
  } = useSearchLogic({
    mode: 'standard',
    lang,
    onSearchComplete
  });

  return (
    <search 
      ref={refs.containerRef as React.RefObject<HTMLElement>}
      className={`relative ${className}`}
      role="search"
      aria-label={dictionary.search.accessibility.searchLabel}
      itemScope
      itemType="https://schema.org/SearchAction"
    >
      <meta itemProp="target" content={`https://${dictionary.seo.site.url}/${lang}/search?q={search_term_string}`} />
      <meta itemProp="query-input" content="required name=search_term_string" />
      
      <div className="
        relative flex gap-2 items-center
        bg-sf-hi rounded-lg shadow-md
        hover:shadow-lg
        focus-within:outline-none
        focus-within:ring-2
        focus-within:ring-pr-fix
        focus-within:ring-offset-0
        transition-[background-color,box-shadow] duration-200
        group
      ">
        <NavButton
          context="desktop"
          onClick={handlers.handleSearchButton}
          icon={utils.iconType === 'search' ? <SearchIcon /> : <CloseIcon />}
          aria-label={
            utils.iconType === 'search' 
              ? dictionary.search.accessibility.searchButtonLabel
              : dictionary.search.accessibility.clearSearchLabel
          }
          className="p-2 rounded-full hover:bg-bgcolor-accent/10 transition-colors duration-200"
        />
        
        <SearchInput
          state={state}
          placeholder={dictionary.search.labels.placeholder}
          onChange={handlers.handleInputChange}
          onKeyDown={handlers.handleKeyDown}
          onFocus={handlers.handleFocus}
          inputRef={refs.inputRef}
          ariaLabel={dictionary.search.accessibility.searchInputLabel}
          ariaDescription={dictionary.search.accessibility.searchDescription}
        />
      </div>

      <SearchDropdown
        state={state}
        dict={dictionary}
        onItemSelect={handlers.handleSelect}
        className="rounded-lg shadow-lg"
        ariaLabel={dictionary.search.accessibility.searchResultsLabel}
      />
    </search>
  );
}
