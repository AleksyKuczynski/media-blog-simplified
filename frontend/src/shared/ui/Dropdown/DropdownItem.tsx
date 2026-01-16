// src/shared/ui/Dropdown/DropdownItem.tsx
'use client';

import React from 'react';
import { DropdownItemProps } from './types';
import { CheckIcon } from '@/shared/primitives/Icons';
import { useDropdownContext } from './useDropdown';
import { DROPDOWN_STYLES } from './styles';

export default function DropdownItem({
  item,
  index,
  isSelected,
  onSelect
}: DropdownItemProps) {
  const { itemRefs, handleKeyDown, selectedIndex, close } = useDropdownContext();
  const isFocused = selectedIndex === index;

  const handleItemKeyDown = (e: React.KeyboardEvent) => {
    handleKeyDown(e as unknown as KeyboardEvent);
  };

  const handleClick = () => {
    onSelect();
    close();
  };

  const getItemClasses = () => {
    if (isFocused) {
      return `${DROPDOWN_STYLES.item.base} ${DROPDOWN_STYLES.item.focused}`;
    }
    if (isSelected) {
      return `${DROPDOWN_STYLES.item.base} ${DROPDOWN_STYLES.item.selected}`;
    }
    return `${DROPDOWN_STYLES.item.base} ${DROPDOWN_STYLES.item.default}`;
  };

  return (
    <li
      ref={el => {
        if (itemRefs.current) {
          itemRefs.current[index] = el;
        }
      }}
      role="option"
      className={getItemClasses()}
      onClick={handleClick}
      onKeyDown={handleItemKeyDown}
      aria-selected={isSelected}
      tabIndex={0}
    >
      <span>
        {item.label}
      </span>
      {isSelected && (
        <CheckIcon 
          className={DROPDOWN_STYLES.icon.check}
          aria-hidden="true" 
        />
      )}
    </li>
  );
}