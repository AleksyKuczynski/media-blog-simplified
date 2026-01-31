// src/features/search/page/SearchBarInput.tsx
import React from 'react';
import { SearchUIState } from '../types';
import { SEARCH_BAR_FORM_STYLES } from '../search.styles';
import { CloseIcon } from '@/shared/primitives/Icons';
import { Dictionary } from '@/config/i18n';

interface SearchBarInputProps {
  state: SearchUIState;
  placeholder: string;
  dictionary: Dictionary;
  isFocused: boolean;
  hasResults: boolean;
  showTips: boolean;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur?: () => void;
  onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  ariaLabel?: string;
  ariaDescription?: string;
}

export default function SearchBarInput({
  state,
  placeholder,
  dictionary,
  isFocused,
  hasResults,
  showTips,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  onClear,
  inputRef,
  ariaLabel,
  ariaDescription,
}: SearchBarInputProps) {
  const descriptionId = 'search-bar-input-description';
  const resultsId = 'search-bar-input-results';
  const styles = SEARCH_BAR_FORM_STYLES.input;

  // Determine label text based on focus, results, and search status
  const getLabelText = () => {
    // Hide label when showing tips
    if (showTips) {
      return '';
    }

    // If on search results page, always show "results for {query}"
    if (hasResults && state.query.length >= 3) {
      return dictionary.search.templates.resultsFor.replace('{query}', state.query);
    }

    // If not focused, show placeholder
    if (!isFocused) {
      return placeholder;
    }

    // If focused, show status-based messages
    switch (state.searchStatus.type) {
      case 'minChars':
        return dictionary.search.labels.minCharacters;
      case 'searching':
        return dictionary.search.labels.searching;
      case 'noResults':
        return dictionary.search.labels.noResults;
      case 'success':
        return dictionary.search.templates.resultsFor.replace('{query}', state.query);
      default:
        return placeholder;
    }
  };

  const labelText = getLabelText();

  return (
    <div className={styles.wrapper}>
      {ariaDescription && (
        <div id={descriptionId} className="sr-only">
          {ariaDescription}
        </div>
      )}
      
      {labelText && (
        <label htmlFor="search-bar-input" className={styles.label}>
          {labelText}
        </label>
      )}
      
      <input
        id="search-bar-input"
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder={showTips ? '' : placeholder}
        value={state.query}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        role="combobox"
        aria-label={ariaLabel}
        aria-describedby={ariaDescription ? descriptionId : undefined}
        aria-controls={resultsId}
        aria-expanded={state.dropdown.visibility === 'visible'}
        aria-autocomplete="list"
        aria-activedescendant={
          state.selectedIndex >= 0 
            ? `search-result-${state.selectedIndex}` 
            : undefined
        }
      />

      {state.query.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className={styles.clearButton}
          aria-label="Clear search"
        >
          <CloseIcon className={styles.clearIcon} />
        </button>
      )}
    </div>
  );
}