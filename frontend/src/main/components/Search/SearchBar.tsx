// src/main/components/Search/SearchBar.tsx - Fixed with 'use client'
'use client'

import React from 'react';
import { SearchIcon, NavButton, CloseIcon } from '../Interface';
import SearchInput from './SearchInput';
import SearchDropdown from './SearchDropdown';
import { useSearchLogic } from './useSearchLogic';
import { Dictionary, Lang } from '@/main/lib/dictionary/types';

interface SearchBarProps {
  dictionary: Dictionary;
  lang: Lang;
  className?: string;
  onSearchComplete?: () => void;
}

/**
 * SearchBar - Main search component with enhanced dictionary support
 * Now properly marked as client component to handle hooks
 */
export default function SearchBar({
  dictionary,
  lang,
  className = '',
  onSearchComplete
}: SearchBarProps) {
  // Create compatibility translation object for useSearchLogic
  const compatibilityTranslations = {
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
  };

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
    <div 
      ref={refs.containerRef}
      className={`relative ${className}`}
      role="search"
      aria-label={dictionary.search.accessibility.searchLabel}
    >
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
        translations={compatibilityTranslations}
        onItemSelect={handlers.handleSelect}
        className="rounded-lg shadow-lg"
        ariaLabel={dictionary.search.accessibility.searchResultsLabel}
      />
    </div>
  );
}