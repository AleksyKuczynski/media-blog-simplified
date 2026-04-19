'use client'

import SearchDropdown from '../ui/SearchDropdown';
import { useSearchLogic } from '../logic/useSearchLogic';
import { useSearchBarState } from '../logic/useSearchBarState';
import { useSearchBarInteractions } from '../logic/useSearchBarInteractions';
import { useSearchBarHandlers } from '../logic/useSearchBarHandlers';
import { Dictionary, Lang } from '@/config/i18n';
import { SearchIcon } from '@/shared/primitives/Icons';
import { SEARCH_BAR_FORM_STYLES, SEARCH_PAGE_STYLES, SEARCH_WITH_SORTING_STYLES } from '../search.styles';
import SortingControl from '@/features/navigation/Filter/SortingControl';
import { cn } from '@/lib/utils';
import { useSearchBarFocusHandlers } from '../logic/useSearchBarFocusHandlers';
import SearchBar from './SearchBar';

interface SearchBarFormProps {
  readonly dictionary: Dictionary;
  readonly lang: Lang;
  readonly currentQuery?: string;
  readonly hasResults?: boolean;
  readonly className?: string;
  readonly showSorting?: boolean;
  readonly currentSort?: string;
  readonly resultsMode?: 'results' | 'no-results' | 'invalid-query' | null;
}

export default function SearchBarForm({
  dictionary,
  lang,
  currentQuery,
  hasResults = false,
  className = '',
  showSorting = false,
  currentSort = 'desc',
  resultsMode = null
}: SearchBarFormProps) {
  const interactions = useSearchBarInteractions();
  
  const searchLogic = useSearchLogic({
    lang,
    initialQuery: currentQuery
  });

  const searchBarState = useSearchBarState({
    lang,
    currentQuery,
    showSorting,
    onDropdownClose: interactions.handlers.handleDropdownClose
  });

  const searchBarHandlers = useSearchBarHandlers({
    handleInputChange: searchBarState.handleInputChange,
    handleKeyDown: searchBarState.handleKeyDown,
    originalInputChange: searchLogic.handlers.handleInputChange,
    originalKeyDown: searchLogic.handlers.handleKeyDown,
    handleClear: searchLogic.handlers.handleClear,
    handleDropdownClose: interactions.handlers.handleDropdownClose,
    query: searchLogic.state.query,
    selectedIndex: searchLogic.state.selectedIndex
  });

  const { handleFocus, handleBlur } = useSearchBarFocusHandlers({
    interactionsFocus: interactions.handlers.handleFocus,
    interactionsBlur: interactions.handlers.handleBlur,
    searchLogicFocus: searchLogic.handlers.handleFocus,
    searchBarStateBlur: searchBarState.handleBlur
  })
  
  const showTips = !interactions.state.isFocused && !hasResults && searchLogic.state.query.length === 0 && !!dictionary.search.hub?.tips;  const showDivider = showSorting && !searchBarState.isEditingQuery && !interactions.state.isAnyDropdownOpen && 
    (interactions.state.hoveredControl === null || !interactions.state.isHoveringContainer);
  const shouldShowSorting = showSorting && !searchBarState.isEditingQuery;

   // Helper to create search bar props
  const getSearchBarProps = (variant: 'standalone' | 'combined') => ({
    state: searchLogic.state,
    placeholder: dictionary.search.labels.placeholder,
    dictionary,
    isFocused: interactions.state.isFocused,
    hasResults,
    showTips,
    onChange: searchBarHandlers.onInputChange,
    onKeyDown: searchBarHandlers.onKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onClear: searchLogic.handlers.handleClear,
    inputRef: searchLogic.refs.inputRef,
    ariaLabel: dictionary.search.accessibility.searchInputLabel,
    ariaDescription: dictionary.search.accessibility.searchDescription,
    iconClassName: getIconClassName(),
    variant
  });
 
  // Icon color: dimmed when showing tips, normal when query is clickable (3+ chars)
  const getIconClassName = () => {
    if (showTips) {
      return 'text-on-sf-dim';
    }
    return searchLogic.state.query.length >= 3 
      ? 'text-on-sf cursor-pointer hover:text-on-sf transition-colors'
      : 'text-on-sf-var cursor-pointer hover:text-on-sf transition-colors';
  };

  const getCombinedContainerClassName = () => {
    if (!showSorting) return '';
    
    return cn(
      SEARCH_WITH_SORTING_STYLES.container,
      interactions.state.isAnyDropdownOpen && interactions.state.isHoveringInactive 
        ? SEARCH_WITH_SORTING_STYLES.activeHover 
        : interactions.state.isAnyDropdownOpen 
          ? SEARCH_WITH_SORTING_STYLES.active 
          : SEARCH_WITH_SORTING_STYLES.inactive
    );
  };

  return (
    <section             
      className={
        resultsMode === null 
        ? "min-h-[calc(100vh-4rem)] xl:min-h-[calc(100vh-8rem)] pt-16 md:pt-24 xl:pt-32" 
        : "min-h-72 pt-16 md:pt-24 xl:pt-32"
      }
    >      
      <search 
        ref={searchLogic.refs.containerRef}
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
            <div className="xl:hidden">
              <div className={SEARCH_BAR_FORM_STYLES.wrapper}>
                <SearchBar {...getSearchBarProps('standalone')} />

                <SearchDropdown
                  state={searchLogic.state}
                  dict={dictionary}
                  onItemSelect={searchLogic.handlers.handleSelect}
                  className={SEARCH_BAR_FORM_STYLES.dropdown}
                  ariaLabel={dictionary.search.accessibility.searchResultsLabel}
                />
              </div>
            </div>

            <div 
              className={cn("max-xl:hidden", getCombinedContainerClassName())}
              onMouseEnter={() => interactions.handlers.setContainerHover(true)}
              onMouseLeave={() => interactions.handlers.setContainerHover(false)}
            >
              <div 
                className={SEARCH_WITH_SORTING_STYLES.searchWrapper}
                onMouseEnter={() => interactions.handlers.handleSearchHoverChange(true)}
                onMouseLeave={() => interactions.handlers.handleSearchHoverChange(false)}
              >
                <div>
                  <SearchBar {...getSearchBarProps('combined')} />

                  <SearchDropdown
                    state={searchLogic.state}
                    dict={dictionary}
                    onItemSelect={searchLogic.handlers.handleSelect}
                    className="absolute left-0 right-0 top-full mt-2"
                    ariaLabel={dictionary.search.accessibility.searchResultsLabel}
                  />
                </div>
              </div>

              <div 
                className={cn(
                  SEARCH_WITH_SORTING_STYLES.divider.base,
                  showDivider 
                    ? SEARCH_WITH_SORTING_STYLES.divider.visible 
                    : SEARCH_WITH_SORTING_STYLES.divider.hidden
                )}
              />

              {shouldShowSorting && (
                <div 
                  className={SEARCH_WITH_SORTING_STYLES.sortingWrapper}
                  onMouseEnter={() => interactions.handlers.handleSortingHoverChange(true)}
                  onMouseLeave={() => interactions.handlers.handleSortingHoverChange(false)}
                >
                  <SortingControl
                    dictionary={dictionary}
                    currentSort={currentSort}
                    variant="search"
                    onOpenChange={interactions.handlers.handleSortingOpenChange}
                    onHoverChange={interactions.handlers.handleSortingHoverChange}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={SEARCH_BAR_FORM_STYLES.wrapper}>
            <SearchBar {...getSearchBarProps('standalone')} />

            <SearchDropdown
              state={searchLogic.state}
              dict={dictionary}
              onItemSelect={searchLogic.handlers.handleSelect}
              className={SEARCH_BAR_FORM_STYLES.dropdown}
              ariaLabel={dictionary.search.accessibility.searchResultsLabel}
            />

            {showTips && (                                                                                                                          
              <div className={cn(SEARCH_BAR_FORM_STYLES.tips.base, SEARCH_BAR_FORM_STYLES.tips.visible)}>                                           
                <ul className={SEARCH_PAGE_STYLES.tips.list}>                                            
                  {dictionary.search.hub.tips.map((tip, index) => (                                                                                 
                    <li key={index} className={SEARCH_PAGE_STYLES.tips.item}>
                      <span className={SEARCH_PAGE_STYLES.tips.span}>•</span>                                                                       
                      <span>{tip}</span>                                     
                    </li>                                                                                                                           
                  ))}                                                                                                                               
                </ul>
              </div>                                                                                                                                
            )}
          </div>
        )}
      </search>
    </section>
  );
}