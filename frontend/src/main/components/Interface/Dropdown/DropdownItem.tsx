// src/main/components/Interface/Dropdown/DropdownItem.tsx - CLEANED UP
'use client';

import React from 'react';
import { DropdownItemProps } from './types';
import { CheckIcon } from '../Icons';
import { useDropdownContext } from './DropdownContext';

export default function DropdownItem({
  item,
  index,
  isSelected,
  onSelect
}: DropdownItemProps) {
  const { itemRefs, handleKeyDown, selectedIndex } = useDropdownContext();
  const isFocused = selectedIndex === index;

  const handleItemKeyDown = (e: React.KeyboardEvent) => {
    handleKeyDown(e as unknown as KeyboardEvent);
  };

  // Combined styling logic with inline classes - hardcoded rounded theme
  const getItemClasses = () => {
    const baseClasses = "flex items-center justify-between transition-colors duration-200 outline-none cursor-default px-4 py-2 mx-2 first:mt-2 last:mb-2";
    
    if (isFocused) {
      return `${baseClasses} bg-pr-cont text-on-pr rounded-lg`;
    }
    if (isSelected) {
      return `${baseClasses} text-pr-cont cursor-default`;
    }
    return `${baseClasses} text-on-sf hover:bg-sf-hst hover:text-pr-cont rounded-lg cursor-pointer`;
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
      onClick={() => onSelect()}
      onKeyDown={handleItemKeyDown}
      aria-selected={isSelected}
      tabIndex={0}
    >
      <span>
        {item.label}
      </span>
      {isSelected && (
        <CheckIcon 
          className="h-4 w-4 ml-2"
          aria-hidden="true" 
        />
      )}
    </li>
  );
}