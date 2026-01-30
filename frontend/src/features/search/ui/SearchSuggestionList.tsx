// src/features/search/ui/SearchSuggestionList.tsx
import React from 'react';
import { SearchResult } from '@/api/directus';
import { Dictionary } from '@/config/i18n';
import { SearchIcon } from '@/shared/primitives/Icons';

interface SearchSuggestionListProps {
  suggestions: SearchResult[];
  query: string;
  searchStatus: { type: string; count?: number };
  selectedIndex: number;
  dictionary: Dictionary;
  onSuggestionSelect: (index: number) => void;
  onSuggestionKeyDown: (e: React.KeyboardEvent, index: number) => void;
  variant: 'mobile' | 'desktop';
  styles: {
    emptyState: string;
    emptyIcon: string;
    emptyText: string;
    tips: {
      list: string;
      item: string;
      span: string;
    };
    suggestionsList: string;
    suggestion: {
      base: string;
      highlighted: string;
      default: string;
      badge: string;
      title: string;
      description: string;
      meta: string;
    };
  };
}

export default function SearchSuggestionList({
  suggestions,
  query,
  searchStatus,
  selectedIndex,
  dictionary,
  onSuggestionSelect,
  onSuggestionKeyDown,
  variant,
  styles
}: SearchSuggestionListProps) {
  
  // Show search tips when no query entered
  if (query.length === 0) {
    return (
      <div className={styles.emptyState}>
        <SearchIcon className={styles.emptyIcon} />
        <ul className={styles.tips.list}>
          {dictionary.search.hub.tips.map((tip, index) => (
            <li key={index} className={styles.tips.item}>
              <span className={styles.tips.span}>•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Show minimum characters message
  if (searchStatus.type === 'minChars') {
    return (
      <div className={styles.emptyState}>
        <SearchIcon className={styles.emptyIcon} />
        <p className={styles.emptyText}>
          {dictionary.search.labels.minCharacters}
        </p>
      </div>
    );
  }

  // Show no results message
  if (searchStatus.type === 'noResults') {
    return (
      <div className={styles.emptyState}>
        <SearchIcon className={styles.emptyIcon} />
        <p className={styles.emptyText}>
          {dictionary.search.labels.noResults}
        </p>
      </div>
    );
  }

  // Show searching state
  if (searchStatus.type === 'searching') {
    return (
      <div className={styles.emptyState}>
        <SearchIcon className={styles.emptyIcon} />
        <p className={styles.emptyText}>
          {dictionary.search.labels.searching}
        </p>
      </div>
    );
  }

  // Show suggestions
  return (
    <div className={styles.suggestionsList}>
      {suggestions.map((suggestion, index) => {
        const isHighlighted = index === selectedIndex;
        const suggestionId = `${variant}-suggestion-${index}`;
        
        return (
          <button
            key={`${suggestion.type}-${suggestion.slug}`}
            id={suggestionId}
            onClick={() => onSuggestionSelect(index)}
            onKeyDown={(e) => onSuggestionKeyDown(e, index)}
            className={`
              ${styles.suggestion.base}
              ${isHighlighted 
                ? styles.suggestion.highlighted
                : styles.suggestion.default
              }
            `.trim()}
            role="option"
            aria-selected={isHighlighted}
          >
            <div className={styles.suggestion.badge}>
              {suggestion.type === 'author' && dictionary.navigation.labels.authors}
              {suggestion.type === 'category' && dictionary.navigation.labels.categories}
              {suggestion.type === 'article' && dictionary.navigation.labels.articles}
            </div>

            <div className={styles.suggestion.title}>
              {suggestion.type === 'article' ? suggestion.title : suggestion.name}
            </div>

            {suggestion.type === 'article' && suggestion.description && (
              <div className={styles.suggestion.description}>
                {suggestion.description}
              </div>
            )}
            {(suggestion.type === 'author' || suggestion.type === 'category') && (
              <div className={styles.suggestion.meta}>
                {suggestion.articleCount} {dictionary.common.count.articles}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}