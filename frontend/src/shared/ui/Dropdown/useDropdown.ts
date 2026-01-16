// src/shared/ui/Dropdown/useDropdown.ts
'use client';

import { useCallback, useState, useRef, createContext, useContext } from 'react';
import type { DropdownContextType, DropdownItemType } from './types';

export const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdownContext must be used within a Dropdown');
  }
  return context;
}

// Hook implementation
export function useDropdown({ 
  items, 
  onSelect 
}: {
  items: DropdownItemType[];
  onSelect: (item: DropdownItemType) => void;
}): DropdownContextType {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const focusTrigger = useCallback(() => {
    triggerRef.current?.focus();
  }, []);

  const focusItem = useCallback((index: number) => {
    itemRefs.current[index]?.focus();
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
    setSelectedIndex(-1);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggle();
  }, [toggle]);

  const findNextSelectableIndex = useCallback((currentIndex: number, direction: 'up' | 'down') => {
    let nextIndex = currentIndex;
    const increment = direction === 'down' ? 1 : -1;

    do {
      nextIndex = nextIndex + increment;
      if (nextIndex >= items.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = items.length - 1;
      if (nextIndex === currentIndex) return -1;
    } while (items[nextIndex].selected);

    return nextIndex;
  }, [items]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        focusTrigger();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          const firstSelectable = findNextSelectableIndex(-1, 'down');
          if (firstSelectable !== -1) {
            setSelectedIndex(firstSelectable);
            focusItem(firstSelectable);
          }
        } else {
          const nextIndex = findNextSelectableIndex(selectedIndex, 'down');
          if (nextIndex !== -1) {
            setSelectedIndex(nextIndex);
            focusItem(nextIndex);
          }
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (selectedIndex > -1) {
          const prevIndex = findNextSelectableIndex(selectedIndex, 'up');
          if (prevIndex !== -1) {
            setSelectedIndex(prevIndex);
            focusItem(prevIndex);
          } else {
            setSelectedIndex(-1);
            focusTrigger();
          }
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (selectedIndex >= 0) {
          onSelect(items[selectedIndex]);
          close();
          focusTrigger();
        }
        break;
    }
  }, [items, selectedIndex, isOpen, onSelect, close, focusItem, focusTrigger, findNextSelectableIndex]);

  return {
    isOpen,
    selectedIndex,
    setSelectedIndex,
    close,
    triggerRef,
    itemRefs,
    items,
    onSelect,
    handleKeyDown,
    handleClick,
    focusTrigger,
    focusItem
  };
}