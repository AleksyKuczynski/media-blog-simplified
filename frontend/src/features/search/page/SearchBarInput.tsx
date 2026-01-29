// src/features/search/page/SearchBarInput.tsx
import React from 'react';
import { SearchUIState } from '../types';
import { SEARCH_BAR_FORM_STYLES } from '../search.styles';
import { CloseIcon } from '@/shared/primitives/Icons';

interface SearchBarInputProps {
  state: SearchUIState;
  placeholder: string;
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

  return (
    <div className={styles.wrapper}>
      {ariaDescription && (
        <div id={descriptionId} className="sr-only">
          {ariaDescription}
        </div>
      )}
      
      <input
        id="search-bar-input"
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder={placeholder}
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