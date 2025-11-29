// src/main/components/Search/SearchInput.tsx - Enhanced with new accessibility features
import React from 'react';
import { SearchUIState } from '../types';
import { ANIMATION_DURATION } from '@/shared/ui/constants';
import { cn } from '@/lib/utils';

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

/**
 * SearchInput - Enhanced search input with improved accessibility
 * Now supports comprehensive ARIA labeling for better screen reader support
 */
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
  const styles = {
    container: {
      base: `
        w-0 overflow-hidden
        transition-all duration-[${ANIMATION_DURATION}ms]
        transform origin-right
      `,
      visibility: {
        'hidden': 'w-0 opacity-0',
        'animating-in': 'w-64 opacity-100',
        'visible': 'w-64 opacity-100',
        'animating-out': 'w-0 opacity-0'
      }
    },
    input: {
      base: `
        w-full h-full
        py-2 px-3
        text-on-sf placeholder-on-sf-var
        bg-transparent
        focus:outline-none
        focus:ring-0
        border-0
      `
    }
  };

  // Generate unique IDs for accessibility
  const inputId = React.useId();
  const descriptionId = `${inputId}-description`;
  const resultsId = `${inputId}-results`;

  return (
    <div className={cn(
      styles.container.base,
      styles.container.visibility[state.input.visibility]
    )}>
      {/* Hidden description for screen readers */}
      {ariaDescription && (
        <div id={descriptionId} className="sr-only">
          {ariaDescription}
        </div>
      )}
      
      <input
        id={inputId}
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        className={styles.input.base}
        placeholder={placeholder}
        value={state.query}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        
        // Enhanced ARIA attributes
        role="combobox"
        aria-label={ariaLabel}
        aria-describedby={ariaDescription ? descriptionId : undefined}
        aria-expanded={state.dropdown.visibility !== 'hidden'}
        aria-controls={resultsId}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        
        // Additional accessibility features
        autoComplete="off"
        spellCheck="false"
        
        // Search-specific attributes
        data-search-input="true"
        data-search-state={state.searchStatus.type}
      />
      
      {/* Results container ID for ARIA reference */}
      {state.dropdown.visibility !== 'hidden' && (
        <div id={resultsId} className="sr-only">
          Результаты поиска будут отображены ниже
        </div>
      )}
    </div>
  );
}