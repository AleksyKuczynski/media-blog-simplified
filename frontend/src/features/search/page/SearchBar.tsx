// src/features/search/page/SearchBar.tsx
import React from 'react';
import { SearchUIState } from '../types';
import { Dictionary } from '@/config/i18n';
import { SearchIcon } from '@/shared/primitives/Icons';
import { SEARCH_BAR_FORM_STYLES } from '../search.styles';
import SearchBarInput from './SearchBarInput';

interface SearchBarProps {
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
  variant?: 'standalone' | 'combined';
}

export default function SearchBar({
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
  variant = 'standalone'
}: SearchBarProps) {
  const isStandalone = variant === 'standalone';

  return (
    <div className={isStandalone ? SEARCH_BAR_FORM_STYLES.inputWrapper : 'flex items-center gap-3'}>
      <div className={SEARCH_BAR_FORM_STYLES.icon}>
        <SearchIcon className={SEARCH_BAR_FORM_STYLES.iconSize} />
      </div>

      <SearchBarInput
        state={state}
        placeholder={placeholder}
        dictionary={dictionary}
        isFocused={isFocused}
        hasResults={hasResults}
        showTips={showTips}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        onClear={onClear}
        inputRef={inputRef}
        ariaLabel={ariaLabel}
        ariaDescription={ariaDescription}
      />
    </div>
  );
}