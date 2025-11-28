// src/main/lib/hooks/useKeyboardNavigation.ts

import { useState } from "react";

export function useKeyboardNavigation<T>(
    items: T[],
    onSelect: (item: T) => void,
    onSubmit: () => void
  ) {
    const [focusedIndex, setFocusedIndex] = useState(-1);
  
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (prev < items.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0) {
            onSelect(items[focusedIndex]);
          } else {
            onSubmit();
          }
          break;
        // ... other cases
      }
    };
  
    return { focusedIndex, handleKeyDown };
  }