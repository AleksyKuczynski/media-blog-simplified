// src/shared/ui/Dropdown/Dropdown.tsx
'use client';

import React, { useRef } from 'react';
import { useOutsideClick } from '@/lib/hooks';
import { DropdownContext, useDropdown } from './useDropdown';
import { DROPDOWN_STYLES } from './styles';
import type { DropdownItemType } from './types';

interface DropdownProps {
  children: React.ReactNode;
  items: DropdownItemType[];
  onSelect: (item: DropdownItemType) => void;
}

export default function Dropdown({ children, items, onSelect }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContext = useDropdown({ items, onSelect });
  const { triggerRef, isOpen, close } = dropdownContext;
  
  useOutsideClick(dropdownRef, triggerRef, isOpen, close);

  return (
    <DropdownContext.Provider value={dropdownContext}>
      <div 
        ref={dropdownRef}
        className={DROPDOWN_STYLES.wrapper}
        role="presentation"
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}