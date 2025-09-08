// src/main/components/Search/ExpandableSearch.tsx - Updated with dictionary support
import React from 'react';
import { SearchIcon, NavButton, CloseIcon } from '../Interface';
import SearchInput from './SearchInput';
import SearchDropdown from './SearchDropdown';
import { useSearchLogic } from './useSearchLogic';

// NEW: Import new dictionary types
import { Dictionary } from '@/main/lib/dictionary/types';
// OLD: Keep old types for backward compatibility
import { SearchTranslations, Lang } from '@/main/lib/dictionaries/dictionariesTypes';

// Updated interface to support both old and new dictionary structures
interface ExpandableSearchProps {
  // OLD: Backward compatibility
  searchTranslations?: SearchTranslations;
  // NEW: Primary dictionary structure
  dictionary?: Dictionary;
  lang: Lang;
  className?: string;
}

/**
 * ExpandableSearch - Updated to support both old and new dictionary structures
 * This provides backward compatibility during the migration period
 */
export default function ExpandableSearch({
  searchTranslations,
  dictionary,
  lang,
  className = ''
}: ExpandableSearchProps) {
  // Create compatibility translations from either source
  const compatibilityTranslations = React.useMemo(() => {
    if (dictionary) {
      // NEW: Use new dictionary structure
      return {
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
    } else if (searchTranslations) {
      // OLD: Use legacy structure
      return searchTranslations;
    } else {
      // Fallback
      return {
        placeholder: 'Поиск статей...',
        submit: 'Поиск',
        results: 'Результаты поиска',
        noResults: 'Результатов не найдено',
        searching: 'Поиск...',
        minCharacters: 'Введите минимум 3 символа',
        resultsFor: 'Результаты для "{query}"',
        pageTitle: 'Поиск',
        pageDescription: 'Поиск статей',
        relatedTo: 'связанные с',
      };
    }
  }, [dictionary, searchTranslations]);

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

  // Get accessibility labels
  const getAccessibilityLabels = () => {
    if (dictionary) {
      return {
        searchLabel: dictionary.search.accessibility.searchLabel,
        searchButtonLabel: dictionary.search.accessibility.searchButtonLabel,
        clearSearchLabel: dictionary.search.accessibility.clearSearchLabel,
      };
    }
    // Fallback for old structure
    return {
      searchLabel: 'Поиск по сайту',
      searchButtonLabel: 'Выполнить поиск',
      clearSearchLabel: 'Очистить поиск',
    };
  };

  const a11yLabels = getAccessibilityLabels();

  return (
    <div 
      ref={refs.containerRef}
      className={`relative ${className}`}
      role="search"
      aria-label={a11yLabels.searchLabel}
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
          placeholder={compatibilityTranslations.placeholder}
          onChange={handlers.handleInputChange}
          onKeyDown={handlers.handleKeyDown}
          onFocus={handlers.handleFocus}
          inputRef={refs.inputRef}
          ariaLabel={a11yLabels.searchButtonLabel}
        />
        <NavButton
          context="desktop"
          onClick={handlers.handleSearchButton}
          icon={utils.iconType === 'search' ? <SearchIcon /> : <CloseIcon />}
          aria-label={
            utils.iconType === 'search' 
              ? a11yLabels.searchButtonLabel
              : a11yLabels.clearSearchLabel
          }
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
          translations={compatibilityTranslations}
          onItemSelect={handlers.handleSelect}
          className="rounded-lg shadow-lg"
        />
      )}
    </div>
  );
}