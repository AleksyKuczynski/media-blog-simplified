// src/features/search/page/SearchBarForm.tsx
'use client'

import { useState } from 'react';
import SearchDropdown from '../ui/SearchDropdown';
import SearchBarInput from './SearchBarInput';
import { useSearchLogic } from '../logic/useSearchLogic';
import { Dictionary, Lang } from '@/config/i18n';
import { SearchIcon } from '@/shared/primitives/Icons';
import { SEARCH_BAR_FORM_STYLES, SEARCH_PAGE_STYLES } from '../search.styles';
import SortingControl from '@/features/navigation/Filter/SortingControl';

interface SearchBarFormProps {
  readonly dictionary: Dictionary;
  readonly lang: Lang;
  readonly currentQuery?: string;
  readonly hasResults?: boolean;
  readonly className?: string;
  readonly showSorting?: boolean;
  readonly currentSort?: string;
}

export default function SearchBarForm({
  dictionary,
  lang,
  currentQuery,
  hasResults = false,
  className = '',
  showSorting = false,
  currentSort = 'desc'
}: SearchBarFormProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const {
    state,
    handlers,
    refs,
  } = useSearchLogic({
    lang,
    initialQuery: currentQuery
  });

  const handleFocus = () => {
    setIsFocused(true);
    handlers.handleFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const showTips = !isFocused && !hasResults && state.query.length === 0 && dictionary.search.hub?.tips;

  return (
    <search 
      ref={refs.containerRef}
      className={`${SEARCH_BAR_FORM_STYLES.container} ${className}`}
      role="search"
      aria-label={dictionary.search.accessibility.searchLabel}
      itemScope
      itemType="https://schema.org/SearchAction"
    >
      <meta itemProp="target" content={`https://${dictionary.seo.site.url}/${lang}/search?search={search_term_string}`} />
      <meta itemProp="query-input" content="required name=search_term_string" />
      
      {/* Search bar + Sorting control wrapper */}
      <div className={showSorting ? 'xl:flex xl:items-start xl:gap-4 xl:justify-center' : ''}>
        {/* Sorting control on xl+ screens only */}
        {showSorting && (
          <aside 
            aria-label={dictionary.filter.accessibility.sortingControl}
            className="hidden xl:block xl:pt-4"
          >
            <SortingControl
              dictionary={dictionary}
              currentSort={currentSort}
              variant="search"
            />
          </aside>
        )}

        <div className={SEARCH_BAR_FORM_STYLES.wrapper}>
          <div className={SEARCH_BAR_FORM_STYLES.inputWrapper}>
            <SearchBarInput
              state={state}
              placeholder={dictionary.search.labels.placeholder}
              dictionary={dictionary}
              isFocused={isFocused}
              hasResults={hasResults}
              onChange={handlers.handleInputChange}
              onKeyDown={handlers.handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClear={handlers.handleClear}
              inputRef={refs.inputRef}
              ariaLabel={dictionary.search.accessibility.searchInputLabel}
              ariaDescription={dictionary.search.accessibility.searchDescription}
            />

            <div className={SEARCH_BAR_FORM_STYLES.icon}>
              <SearchIcon className={SEARCH_BAR_FORM_STYLES.iconSize} />
            </div>          
          </div>

          <SearchDropdown
            state={state}
            dict={dictionary}
            onItemSelect={handlers.handleSelect}
            className={SEARCH_BAR_FORM_STYLES.dropdown}
            ariaLabel={dictionary.search.accessibility.searchResultsLabel}
          />
        </div>
      </div>

      {dictionary.search.hub?.tips && (
        <div className={`${SEARCH_BAR_FORM_STYLES.tips.base} ${showTips ? SEARCH_BAR_FORM_STYLES.tips.visible : SEARCH_BAR_FORM_STYLES.tips.hidden}`}>
          <p className={SEARCH_PAGE_STYLES.tips.span}>
            {dictionary.search.hub.tipsTitle}:
          </p>
          <ul className={SEARCH_PAGE_STYLES.tips.list}>
            {dictionary.search.hub.tips.map((tip, index) => (
              <li key={index} className={SEARCH_PAGE_STYLES.tips.item}>
                <span aria-hidden="true">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </search>
  );
}