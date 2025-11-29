// src/features/search/ui/ExpandableSearch.tsx
'use client'

import React from 'react';
import SearchInput from './SearchInput';
import SearchDropdown from './SearchDropdown';
import { Dictionary, Lang } from '@/config/i18n';
import { useSearchLogic } from '../logic/useSearchLogic';
import { NavButton } from '@/shared/primitives/NavButton';
import { CloseIcon, SearchIcon } from '@/shared/primitives/Icons';
import { EXPANDABLE_SEARCH_STYLES } from '../search.styles';

interface ExpandableSearchProps {
  readonly dictionary: Dictionary;
  readonly lang: Lang;
  readonly className?: string;
}

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
      className={`${EXPANDABLE_SEARCH_STYLES.container} ${className}`}
      role="search"
      aria-label={dictionary.search.accessibility.searchLabel}
      itemScope
      itemType="https://schema.org/SearchAction"
    >
      <meta itemProp="target" content={`https://${dictionary.seo.site.url}/${lang}/search?q={search_term_string}`} />
      <meta itemProp="query-input" content="required name=search_term_string" />
      
      <div className={`
        ${EXPANDABLE_SEARCH_STYLES.wrapper.base}
        ${isExpanded ? EXPANDABLE_SEARCH_STYLES.wrapper.expanded : EXPANDABLE_SEARCH_STYLES.wrapper.collapsed}
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
          className={EXPANDABLE_SEARCH_STYLES.button}
        />
      </div>

      <SearchDropdown
        state={state}
        dict={dictionary}
        onItemSelect={handlers.handleSelect}
        className={EXPANDABLE_SEARCH_STYLES.dropdown}
        ariaLabel={dictionary.search.accessibility.searchResultsLabel}
      />
    </search>
  );
}