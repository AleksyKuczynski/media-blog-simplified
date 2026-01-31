// src/features/search/page/SearchBarForm.tsx
'use client'

import { useState, useCallback } from 'react';
import SearchDropdown from '../ui/SearchDropdown';
import SearchBarInput from './SearchBarInput';
import { useSearchLogic } from '../logic/useSearchLogic';
import { Dictionary, Lang } from '@/config/i18n';
import { SearchIcon } from '@/shared/primitives/Icons';
import { SEARCH_BAR_FORM_STYLES, SEARCH_PAGE_STYLES, SEARCH_WITH_SORTING_STYLES } from '../search.styles';
import SortingControl from '@/features/navigation/Filter/SortingControl';
import { cn } from '@/lib/utils';

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
  const [openDropdown, setOpenDropdown] = useState<'search' | 'sorting' | null>(null);
  const [hoveredControl, setHoveredControl] = useState<'search' | 'sorting' | null>(null);
  const [isHoveringContainer, setIsHoveringContainer] = useState(false);
  
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
    setOpenDropdown('search');
    handlers.handleFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpenDropdown(null);
  };

  const handleSortingOpenChange = useCallback((isOpen: boolean) => {
    setOpenDropdown(isOpen ? 'sorting' : null);
  }, []);

  const handleSearchHoverChange = useCallback((isHovering: boolean) => {
    setHoveredControl(isHovering ? 'search' : null);
  }, []);

  const handleSortingHoverChange = useCallback((isHovering: boolean) => {
    setHoveredControl(isHovering ? 'sorting' : null);
  }, []);

  const showTips = !isFocused && !hasResults && state.query.length === 0 && dictionary.search.hub?.tips;

  const isAnyDropdownOpen = openDropdown !== null;
  const isHoveringInactive = hoveredControl !== null && hoveredControl !== openDropdown;
  const showDivider = showSorting && !isAnyDropdownOpen && (hoveredControl === null || !isHoveringContainer);

  // Determine container styling based on combined state
  const getCombinedContainerClassName = () => {
    if (!showSorting) return '';
    
    return cn(
      SEARCH_WITH_SORTING_STYLES.container,
      isAnyDropdownOpen && isHoveringInactive 
        ? SEARCH_WITH_SORTING_STYLES.activeHover 
        : isAnyDropdownOpen 
          ? SEARCH_WITH_SORTING_STYLES.active 
          : SEARCH_WITH_SORTING_STYLES.inactive
    );
  };

  return (
    <search 
      ref={refs.containerRef}
      className={showSorting ? `relative pt-4 ${className}` : `${SEARCH_BAR_FORM_STYLES.container} ${className}`}
      role="search"
      aria-label={dictionary.search.accessibility.searchLabel}
      itemScope
      itemType="https://schema.org/SearchAction"
    >
      <meta itemProp="target" content={`https://${dictionary.seo.site.url}/${lang}/search?search={search_term_string}`} />
      <meta itemProp="query-input" content="required name=search_term_string" />
      
      {showSorting ? (
        <>
          {/* Standalone search bar on < xl screens */}
          <div className="xl:hidden">
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

          {/* Combined sorting + search bar on xl+ screens (sorting LEFT, search RIGHT) */}
          <div 
            className={cn("max-xl:hidden", getCombinedContainerClassName())}
            onMouseEnter={() => setIsHoveringContainer(true)}
            onMouseLeave={() => setIsHoveringContainer(false)}
          >
            {/* Sorting Control Section - LEFT */}
            <div 
              className={SEARCH_WITH_SORTING_STYLES.sortingWrapper}
              onMouseEnter={() => handleSortingHoverChange(true)}
              onMouseLeave={() => handleSortingHoverChange(false)}
            >
              <SortingControl
                dictionary={dictionary}
                currentSort={currentSort}
                variant="search"
                onOpenChange={handleSortingOpenChange}
                onHoverChange={handleSortingHoverChange}
              />
            </div>

            {/* Divider */}
            <div 
              className={cn(
                SEARCH_WITH_SORTING_STYLES.divider.base,
                showDivider 
                  ? SEARCH_WITH_SORTING_STYLES.divider.visible 
                  : SEARCH_WITH_SORTING_STYLES.divider.hidden
              )}
            />

            {/* Search Input Section - RIGHT */}
            <div 
              className={SEARCH_WITH_SORTING_STYLES.searchWrapper}
              onMouseEnter={() => handleSearchHoverChange(true)}
              onMouseLeave={() => handleSearchHoverChange(false)}
            >
              <div className="relative p-2 md:p-3 xl:p-4">
                <div className="flex items-center gap-3">
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

                  <div className="text-on-sf-var cursor-pointer hover:text-on-sf transition-colors">
                    <SearchIcon className="w-5 h-5" />
                  </div>
                </div>

                <SearchDropdown
                  state={state}
                  dict={dictionary}
                  onItemSelect={handlers.handleSelect}
                  className="absolute left-0 right-0 top-full mt-2"
                  ariaLabel={dictionary.search.accessibility.searchResultsLabel}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        // Standalone search bar (no sorting on any screen)
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
      )}

      {showTips && (
        <div className={`${SEARCH_BAR_FORM_STYLES.tips.base} ${SEARCH_BAR_FORM_STYLES.tips.visible} mt-4`}>
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