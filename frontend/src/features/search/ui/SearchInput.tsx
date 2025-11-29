// src/features/search/ui/SearchInput.tsx
import React from 'react';
import { SearchUIState } from '../types';
import { ANIMATION_DURATION } from '@/shared/ui/constants';
import { cn } from '@/lib/utils';
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

  const getContainerClasses = () => {
    const baseClasses = `w-0 overflow-hidden transition-all duration-[${ANIMATION_DURATION}ms] transform origin-right`;
    
    switch (state.input.visibility) {
      case 'hidden':
        return cn(baseClasses, 'w-0 opacity-0');
      case 'animating-in':
        return cn(baseClasses, 'w-64 opacity-100');
      case 'visible':
        return cn(baseClasses, 'w-64 opacity-100');
      case 'animating-out':
        return cn(baseClasses, 'w-0 opacity-0');
      default:
        return baseClasses;
    }
  };

  return (
    <div className={getContainerClasses()}>
      {ariaDescription && (
        <div id={descriptionId} className="sr-only">
          {ariaDescription}
        </div>
      )}
      
      <input
        id={inputId}
        ref={inputRef as React.RefObject<HTMLInputElement>}
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
    </div>
  );
}