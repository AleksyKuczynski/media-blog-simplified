// src/main/components/Search/SearchBar.tsx - CLEANED UP
import React from 'react';
import { SearchTranslations } from '@/main/lib/dictionaries/dictionariesTypes';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import { SearchIcon, NavButton, CloseIcon } from '../Interface';
import SearchInput from './SearchInput';
import SearchDropdown from './SearchDropdown';
import { useSearchLogic } from './useSearchLogic';

interface SearchBarProps {
  searchTranslations: SearchTranslations;
  lang: Lang;
  className?: string;
  onSearchComplete?: () => void;
}

export default function SearchBar({
  searchTranslations,
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
    <div 
      ref={refs.containerRef}
      className={`relative ${className}`}
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
          aria-label={searchTranslations.submit}
          className="p-2 rounded-full hover:bg-bgcolor-accent/10 transition-colors duration-200"
        />
        <SearchInput
          state={state}
          placeholder={searchTranslations.placeholder}
          onChange={handlers.handleInputChange}
          onKeyDown={handlers.handleKeyDown}
          onFocus={handlers.handleFocus}
          inputRef={refs.inputRef}
        />
      </div>

      <SearchDropdown
        state={state}
        translations={searchTranslations}
        onItemSelect={handlers.handleSelect}
        className="rounded-lg shadow-lg"
      />
    </div>
  );
}