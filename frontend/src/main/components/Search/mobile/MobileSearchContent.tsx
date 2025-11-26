// src/main/components/Search/MobileSearchContent.tsx
// Mobile-specific search UI for offcanvas panel
// Renders search results inline (no dropdown) with full accessibility

'use client'

import React, { useEffect } from 'react';
import { SearchIcon } from '../../Interface';
import SearchInput from '../common/SearchInput';
import { useSearchLogic } from '../common/useSearchLogic';
import { Dictionary, Lang } from '@/main/lib/dictionary';
import { useRouter } from 'next/navigation';

interface MobileSearchContentProps {
  readonly dictionary: Dictionary;
  readonly lang: Lang;
  readonly onSearchComplete?: () => void;
}

/**
 * MobileSearchContent - Mobile-optimized search for offcanvas panel
 * Renders search inline without dropdown - suggestions appear directly in content flow
 */
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
    mode: 'standard',
    lang,
    onSearchComplete
  });

  // Auto-focus input when component mounts (when offcanvas opens)
  useEffect(() => {
    if (refs.inputRef && 'current' in refs.inputRef) {
      // Small delay to ensure offcanvas animation completes
      const timer = setTimeout(() => {
        refs.inputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [refs.inputRef]);

  // Handle selecting a suggestion
  const handleSuggestionSelect = (index: number) => {
    const suggestion = state.suggestions[index];
    if (suggestion) {
      // Navigate to the article using rubric_slug and slug
      router.push(`/${lang}/${suggestion.rubric_slug}/${suggestion.slug}`);
      // Close offcanvas after selection
      onSearchComplete?.();
    }
  };

  // Handle keyboard navigation in suggestions list
  const handleSuggestionKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        handleSuggestionSelect(index);
        break;
      case 'ArrowDown':
        e.preventDefault();
        // Focus next suggestion or first if at end
        const nextIndex = index < state.suggestions.length - 1 ? index + 1 : 0;
        document.getElementById(`mobile-suggestion-${nextIndex}`)?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        // Focus previous suggestion or last if at start
        const prevIndex = index > 0 ? index - 1 : state.suggestions.length - 1;
        document.getElementById(`mobile-suggestion-${prevIndex}`)?.focus();
        break;
      case 'Escape':
        e.preventDefault();
        // Return focus to input
        if (refs.inputRef && 'current' in refs.inputRef) {
          refs.inputRef.current?.focus();
        }
        break;
    }
  };

  // Render status message based on search state
  const renderStatusMessage = () => {
    let message = '';
    
    switch (state.searchStatus.type) {
      case 'minChars':
        message = dictionary.search.labels.minCharacters;
        break;
      case 'searching':
        message = dictionary.search.labels.searching;
        break;
      case 'noResults':
        message = dictionary.search.labels.noResults;
        break;
      default:
        return null;
    }

    return (
      <div 
        className="px-4 py-8 text-center text-on-sf-var"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>
    );
  };

  // Render suggestions list
  const renderSuggestions = () => {
    if (state.dropdown.content !== 'suggestions' || state.suggestions.length === 0) {
      return null;
    }

    return (
      <div
        role="listbox"
        aria-label={dictionary.search.accessibility.searchResultsLabel}
        className="divide-y divide-ol-var/20"
      >
        {state.suggestions.map((suggestion, index) => {
          const isHighlighted = index === state.selectedIndex;
          
          return (
            <button
              key={suggestion.slug}
              id={`mobile-suggestion-${index}`}
              role="option"
              aria-selected={isHighlighted}
              onClick={() => handleSuggestionSelect(index)}
              onKeyDown={(e) => handleSuggestionKeyDown(e, index)}
              className={`
                w-full text-left px-6 py-4
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pr-fix
                ${isHighlighted 
                  ? 'bg-sf-hi text-on-sf' 
                  : 'text-on-sf-var hover:bg-sf-hi hover:text-on-sf'
                }
              `}
              tabIndex={0}
            >
              {/* Suggestion Type Badge - SearchProposition returns articles only */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium uppercase tracking-wide text-on-sf-var opacity-70">
                  {dictionary.sections.labels.articles}
                </span>
              </div>

              {/* Suggestion Title */}
              <div className="font-medium text-base">
                {suggestion.title}
              </div>

              {/* Suggestion Description (if exists) */}
              {suggestion.description && (
                <div className="text-sm opacity-80 mt-1 line-clamp-2">
                  {suggestion.description}
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
      className="flex flex-col h-full"
      role="search"
      aria-label={dictionary.search.accessibility.searchLabel}
      itemScope
      itemType="https://schema.org/SearchAction"
    >
      <meta itemProp="target" content={`https://${dictionary.seo.site.url}/${lang}/search?q={search_term_string}`} />
      <meta itemProp="query-input" content="required name=search_term_string" />
      
      {/* Search Input Container - Sticky at top */}
      <div className="flex-shrink-0 px-6 py-4 bg-sf-cont/95 backdrop-blur-lg">
        <div className="
          relative flex gap-3 items-center
          bg-sf-hi rounded-lg shadow-md
          focus-within:ring-2
          focus-within:ring-pr-fix
          focus-within:ring-offset-2
          transition-shadow duration-200
        ">
          {/* Search Icon */}
          <div className="pl-4 text-on-sf-var pointer-events-none">
            <SearchIcon />
          </div>
          
          {/* Search Input */}
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
        </div>
      </div>

      {/* Search Results Area - Scrollable */}
      <div 
        className="flex-1 overflow-y-auto"
        data-interactive="true"
      >
        {/* Status Messages or Suggestions */}
        {state.dropdown.content === 'message' && renderStatusMessage()}
        {state.dropdown.content === 'suggestions' && renderSuggestions()}
        
        {/* Hidden announcement for screen readers */}
        <div 
          className="sr-only" 
          role="status" 
          aria-live="polite"
          aria-atomic="true"
        >
          {state.suggestions.length > 0 && 
            `${dictionary.search.labels.results}: ${state.suggestions.length}`
          }
        </div>
      </div>
    </search>
  );
}