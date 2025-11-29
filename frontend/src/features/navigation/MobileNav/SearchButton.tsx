// src/features/navigation/MobileNav/SearchButton.tsx
'use client'

import React from 'react';
import { SEARCH_BUTTON_STYLES } from './styles';
import { CloseIcon, SearchIcon } from '@/shared/primitives/Icons';

interface SearchButtonProps {
  isOpen: boolean;
  onClick: () => void;
  ariaControls: string;
  openLabel: string;
  closeLabel: string;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function SearchButton({
  isOpen,
  onClick,
  ariaControls,
  openLabel,
  closeLabel,
  buttonRef
}: SearchButtonProps) {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={ariaControls}
      aria-label={isOpen ? closeLabel : openLabel}
      className={SEARCH_BUTTON_STYLES.button}
      type="button"
    >
      {isOpen ? (
        <CloseIcon className={SEARCH_BUTTON_STYLES.icon} />
      ) : (
        <SearchIcon className={SEARCH_BUTTON_STYLES.icon} />
      )}
    </button>
  );
}