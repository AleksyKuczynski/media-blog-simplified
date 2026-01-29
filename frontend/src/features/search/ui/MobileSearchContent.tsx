// src/features/search/ui/MobileSearchContent.tsx
'use client'

import React, { useEffect } from 'react';
import SearchInput from './SearchInput';
import { useSearchLogic } from '../logic/useSearchLogic';
import { Dictionary, Lang } from '@/config/i18n';
import { ReadonlyURLSearchParams, useRouter } from 'next/navigation';
import { SearchIcon } from '@/shared/primitives/Icons';
import { MOBILE_SEARCH_STYLES } from '../search.styles';
import { createSearchUrl } from '../utils/createSearchUrl';

interface MobileSearchContentProps {
  readonly dictionary: Dictionary;
  readonly lang: Lang;
  readonly onSearchComplete?: () => void;
}

export default function MobileSearchContent({
  dictionary,
  lang,
  onSearchComplete
}: MobileSearchContentProps) {
  const router = useRouter();
  
  const {
    state,
    handlers,
    refs,
  } = useSearchLogic({
    lang,
    onSearchComplete
  });

  useEffect(() => {
    if (refs.inputRef && 'current' in refs.inputRef) {
      const timer = setTimeout(() => {
        refs.inputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [refs.inputRef]);

  const handleSearchIconClick = () => {
  if (state.query.length >= 3) {
    const searchUrl = createSearchUrl(state.query, new ReadonlyURLSearchParams());
    router.push(`/${lang}${searchUrl}`);
    onSearchComplete?.();
  }
};

  const handleSuggestionSelect = (index: number) => {
    const suggestion = state.suggestions[index];
    if (!suggestion) return;

    if (suggestion.type === 'author') {
      router.push(`/${lang}/authors/${suggestion.slug}`);
    } else if (suggestion.type === 'category') {
      router.push(`/${lang}/categories/category=${suggestion.slug}`);
    } else {
      router.push(`/${lang}/${suggestion.rubric_slug}/${suggestion.slug}`);
    }
    
    onSearchComplete?.();
  };

  const handleSuggestionKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        handleSuggestionSelect(index);
        break;
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = index < state.suggestions.length - 1 ? index + 1 : 0;
        document.getElementById(`mobile-suggestion-${nextIndex}`)?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = index > 0 ? index - 1 : state.suggestions.length - 1;
        document.getElementById(`mobile-suggestion-${prevIndex}`)?.focus();
        break;
      case 'Escape':
        e.preventDefault();
        refs.inputRef.current?.focus();
        break;
    }
  };

  const renderSuggestions = () => {
    // Show search tips when no query entered
    if (state.query.length === 0) {
      return (
        <div className={MOBILE_SEARCH_STYLES.emptyState}>
          <SearchIcon className={MOBILE_SEARCH_STYLES.emptyIcon} />
          <ul className={MOBILE_SEARCH_STYLES.tips.list}>
                  {dictionary.search.hub.tips.map((tip, index) => (
                    <li key={index} className={MOBILE_SEARCH_STYLES.tips.item}>
                      <span className={MOBILE_SEARCH_STYLES.tips.span}>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
        </div>
      );
    }

    // Show minimum characters message
    if (state.searchStatus.type === 'minChars') {
      return (
        <div className={MOBILE_SEARCH_STYLES.emptyState}>
          <SearchIcon className={MOBILE_SEARCH_STYLES.emptyIcon} />
          <p className={MOBILE_SEARCH_STYLES.emptyText}>
            {dictionary.search.labels.minCharacters}
          </p>
        </div>
      );
    }

    // Show no results message
    if (state.searchStatus.type === 'noResults') {
      return (
        <div className={MOBILE_SEARCH_STYLES.emptyState}>
          <SearchIcon className={MOBILE_SEARCH_STYLES.emptyIcon} />
          <p className={MOBILE_SEARCH_STYLES.emptyText}>
            {dictionary.search.labels.noResults}
          </p>
        </div>
      );
    }

    // Show searching state
    if (state.searchStatus.type === 'searching') {
      return (
        <div className={MOBILE_SEARCH_STYLES.emptyState}>
          <SearchIcon className={MOBILE_SEARCH_STYLES.emptyIcon} />
          <p className={MOBILE_SEARCH_STYLES.emptyText}>
            {dictionary.search.labels.searching}
          </p>
        </div>
      );
    }

    // Show suggestions
    return (
      <div className={MOBILE_SEARCH_STYLES.suggestionsList}>
        {state.suggestions.map((suggestion, index) => {
          const isHighlighted = index === state.selectedIndex;
          
          return (
            <button
              key={`${suggestion.type}-${suggestion.slug}`}
              id={`mobile-suggestion-${index}`}
              onClick={() => handleSuggestionSelect(index)}
              onKeyDown={(e) => handleSuggestionKeyDown(e, index)}
              className={`
                ${MOBILE_SEARCH_STYLES.suggestion.base}
                ${isHighlighted 
                  ? MOBILE_SEARCH_STYLES.suggestion.active
                  : MOBILE_SEARCH_STYLES.suggestion.default
                }
              `}
              tabIndex={0}
            >
              <div className={MOBILE_SEARCH_STYLES.suggestion.badge}>
                <span className={MOBILE_SEARCH_STYLES.suggestion.badgeText}>
                  {suggestion.type === 'author' && dictionary.navigation.labels.authors}
                  {suggestion.type === 'category' && dictionary.sections.labels.categories}
                  {suggestion.type === 'article' && dictionary.sections.labels.articles}
                </span>
              </div>

              <div className={MOBILE_SEARCH_STYLES.suggestion.title}>
                {suggestion.type === 'article' ? suggestion.title : suggestion.name}
              </div>

              {suggestion.type === 'article' && suggestion.description && (
                <div className={MOBILE_SEARCH_STYLES.suggestion.description}>
                  {suggestion.description}
                </div>
              )}
              {suggestion.type === 'author' && (
                <div className={MOBILE_SEARCH_STYLES.suggestion.meta}>
                  {suggestion.articleCount} {dictionary.common.count.articles}
                </div>
              )}
              {suggestion.type === 'category' && (
                <div className={MOBILE_SEARCH_STYLES.suggestion.meta}>
                  {suggestion.articleCount} {dictionary.common.count.articles}
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <search 
      ref={refs.containerRef as React.RefObject<HTMLElement>}
      className={MOBILE_SEARCH_STYLES.container}
      role="search"
      aria-label={dictionary.search.accessibility.searchLabel}
      itemScope
      itemType="https://schema.org/SearchAction"
    >
      <meta itemProp="target" content={`https://${dictionary.seo.site.url}/${lang}/search?q={search_term_string}`} />
      <meta itemProp="query-input" content="required name=search_term_string" />
      
      <div className={MOBILE_SEARCH_STYLES.inputContainer}>
        <div className={MOBILE_SEARCH_STYLES.inputWrapper}>
          <button
            type="button"
            onClick={handleSearchIconClick}
            className={MOBILE_SEARCH_STYLES.iconWrapper}
            aria-label={dictionary.search.accessibility.searchButtonLabel}
            disabled={state.query.length < 3}
          >
            <SearchIcon />
          </button>
          
          <SearchInput
            state={state}
            placeholder={dictionary.search.labels.placeholder}
            onChange={handlers.handleInputChange}
            onKeyDown={handlers.handleKeyDown}
            onFocus={handlers.handleFocus}
            onClear={handlers.handleClear}
            inputRef={refs.inputRef as React.RefObject<HTMLInputElement>}
            ariaLabel={dictionary.search.accessibility.searchInputLabel}
            ariaDescription={dictionary.search.accessibility.searchDescription}
            isMobile={true}
          />
        </div>
      </div>

      <div className={MOBILE_SEARCH_STYLES.suggestionsContainer}>
        {renderSuggestions()}
      </div>
    </search>
  );
}