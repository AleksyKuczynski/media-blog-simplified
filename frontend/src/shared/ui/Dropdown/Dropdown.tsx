// src/main/components/Interface/Dropdown/Dropdown.tsx
'use client';

import React from 'react';
import type { DropdownContentProps, DropdownProps } from './types';
import { DropdownContext } from './DropdownContext';
import { useOutsideClick } from '@/lib/hooks';
import DropdownContent from './DropdownContent';
import { useDropdown } from './useDropdown';

export default function Dropdown({
  children,
  items,
  onSelect,
  width,
  position = 'left'
}: DropdownProps) {
  const dropdownContext = useDropdown({ items, onSelect });
  const { dropdownRef, triggerRef, isOpen, close } = dropdownContext;
  
  useOutsideClick(dropdownRef, triggerRef, isOpen, close);

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && 
        child.type === DropdownContent) {
      const typedChild = child as React.ReactElement<DropdownContentProps>;
  
    return React.cloneElement(typedChild, {
      children: <ul role="menu">{typedChild.props.children}</ul>,
      width,
      position
    });
  }
    return child;
  });

  return (
    <DropdownContext.Provider value={dropdownContext}>
      <div 
        ref={dropdownRef as React.RefObject<HTMLDivElement>}
        className="relative inline-block"
        role="presentation"
      >
        {childrenWithProps}
      </div>
    </DropdownContext.Provider>
  );
}