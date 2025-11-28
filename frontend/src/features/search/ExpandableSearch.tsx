// src/main/components/Search/ExpandableSearch.tsx
// SEO-OPTIMIZED: Enhanced semantic markup and accessibility
'use client'

import React from 'react';
import { SearchIcon, NavButton, CloseIcon } from '../../main/components/Interface';
import SearchInput from './ui/SearchInput';
import SearchDropdown from './ui/SearchDropdown';
import { useSearchLogic } from './logic/useSearchLogic';
import { Dictionary, Lang } from '@/main/lib/dictionary';

interface ExpandableSearchProps {
  readonly dictionary: Dictionary;
  readonly lang: Lang;
  readonly className?: string;
}

/**
 * ExpandableSearch - SEO-optimized expandable search component
 * SEMANTIC: Enhanced with structured markup for better SEO
 */
export default function ExpandableSearch({
  dictionary,
  lang,
  className = ''
}: ExpandableSearchProps) {
  const {
    state,
    handlers,
    refs,
    utils
  } = useSearchLogic({
    mode: 'expandable',
    lang,
  });

  const isExpanded = state.input.visibility !== 'hidden';

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
      
      <div className={`
        relative flex items-center gap-2
        transition-all duration-200 ease-in-out
        ${isExpanded ? 
          'bg-sf-hi border border-ol rounded-lg shadow-lg hover:shadow-xl focus-within:outline-none focus-within:ring-1 focus-within:ring-pr-fix focus-within:ring-offset-0' 
          : ''
        }
      `.trim()}>
        
        <SearchInput
          state={state}
          placeholder={dictionary.search.labels.placeholder}
          onChange={handlers.handleInputChange}
          onKeyDown={handlers.handleKeyDown}
          onFocus={handlers.handleFocus}
          inputRef={refs.inputRef as React.RefObject<HTMLInputElement>}
          ariaLabel={dictionary.search.accessibility.searchInputLabel}
          ariaDescription={dictionary.search.accessibility.searchDescription}
        />
        
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