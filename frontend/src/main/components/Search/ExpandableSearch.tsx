// src/main/components/Search/ExpandableSearch.tsx - CLEANED UP
import React from 'react';
import { SearchTranslations, Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import { SearchIcon, NavButton, CloseIcon } from '../Interface';
import SearchInput from './SearchInput';
import SearchDropdown from './SearchDropdown';
import { useSearchLogic } from './useSearchLogic';

interface ExpandableSearchProps {
  searchTranslations: SearchTranslations;
  lang: Lang;
  className?: string;
}

export default function ExpandableSearch({
  searchTranslations,
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
    <div 
      ref={refs.containerRef}
      className={`relative ${className}`}
    >
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
          placeholder={searchTranslations.placeholder}
          onChange={handlers.handleInputChange}
          onKeyDown={handlers.handleKeyDown}
          onFocus={handlers.handleFocus}
          inputRef={refs.inputRef}
          className="rounded-lg"
        />
        <NavButton
          context="desktop"
          onClick={handlers.handleSearchButton}
          icon={utils.iconType === 'search' ? <SearchIcon /> : <CloseIcon />}
          aria-label={searchTranslations.submit}
          aria-expanded={isExpanded}
          className={`
            p-2 rounded-full transition-colors duration-200
            ${isExpanded 
              ? 'hover:bg-bgcolor-accent-dark/50 text-on-sf' 
              : 'hover:bg-bgcolor-accent/10 text-on-sf-var'
            }
          `.trim()}
        />
      </div>

      {isExpanded && (
        <SearchDropdown
          state={state}
          translations={searchTranslations}
          onItemSelect={handlers.handleSelect}
          className="rounded-lg shadow-lg"
        />
      )}
    </div>
  );
}