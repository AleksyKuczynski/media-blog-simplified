// src/main/components/Search/ExpandableSearch.tsx
// SEO-OPTIMIZED: Enhanced semantic markup and accessibility
'use client'

import React from 'react';
import { SearchIcon, NavButton, CloseIcon } from '../Interface';
import SearchInput from './SearchInput';
import SearchDropdown from './SearchDropdown';
import { useSearchLogic } from './useSearchLogic';
import { Dictionary, Lang } from '@/main/lib/dictionary/types';

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
      ref={refs.containerRef}
      className={`relative ${className}`}
      role="search"
      aria-label={dictionary.search.accessibility.searchLabel}
      itemScope
      itemType="https://schema.org/SearchAction"
    >
      <meta itemProp="target" content="https://event4me.eu/ru/search?q={search_term_string}" />
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
          inputRef={refs.inputRef}
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
        dict={{
          placeholder: dictionary.search.labels.placeholder,
          submit: dictionary.search.labels.submit,
          results: dictionary.search.labels.results,
          noResults: dictionary.search.labels.noResults,
          searching: dictionary.search.labels.searching,
          minCharacters: dictionary.search.labels.minCharacters,
          resultsFor: dictionary.search.templates.resultsFor,
          pageTitle: dictionary.search.templates.pageTitle,
          pageDescription: dictionary.search.templates.pageDescription,
          relatedTo: dictionary.search.templates.relatedTo,
        }}
        onItemSelect={handlers.handleSelect}
        className="rounded-lg shadow-lg"
        ariaLabel={dictionary.search.accessibility.searchResultsLabel}
      />
    </search>
  );
}