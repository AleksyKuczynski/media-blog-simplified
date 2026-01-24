// src/features/search/ui/SearchInput.tsx
import React from 'react';
import { SearchUIState } from '../types';
import { SEARCH_INPUT_STYLES } from '../search.styles';

interface SearchInputProps {
  state: SearchUIState;
  placeholder: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  ariaLabel?: string;
  ariaDescription?: string;
}

export default function SearchInput({
  state,
  placeholder,
  onChange,
  onKeyDown,
  onFocus,
  inputRef,
  ariaLabel,
  ariaDescription
}: SearchInputProps) {
  const inputId = React.useId();
  const descriptionId = `${inputId}-description`;
  const resultsId = `${inputId}-results`;

  return (
    <>
      {ariaDescription && (
        <div id={descriptionId} className="sr-only">
          {ariaDescription}
        </div>
      )}
      
      <input
        id="search-bar-input"
        ref={inputRef}
        type="text"
        className={SEARCH_INPUT_STYLES.input}
        placeholder={placeholder}
        value={state.query}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
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
    </>
  );
}