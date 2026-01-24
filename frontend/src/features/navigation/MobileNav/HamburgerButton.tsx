// src/features/navigation/MobileNav/HamburgerButton.tsx
'use client'

import React from 'react';
import { HAMBURGER_BUTTON_STYLES } from './mobileNav.styles';
import { CloseIcon, MenuIcon } from '@/shared/primitives/Icons';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  ariaControls: string;
  openLabel: string;
  closeLabel: string;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function HamburgerButton({
  isOpen,
  onClick,
  ariaControls,
  openLabel,
  closeLabel,
  buttonRef
}: HamburgerButtonProps) {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={ariaControls}
      aria-label={isOpen ? closeLabel : openLabel}
      className={HAMBURGER_BUTTON_STYLES.button}
      type="button"
    >
      {isOpen ? (
        <CloseIcon className={HAMBURGER_BUTTON_STYLES.icon} />
      ) : (
        <MenuIcon className={HAMBURGER_BUTTON_STYLES.icon} />
      )}
    </button>
  );
}