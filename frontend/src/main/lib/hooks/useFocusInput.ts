// src/main/lib/hooks/useFocusInput.ts
// FIXED: React 19 compatible nullable ref types

import { RefObject, useEffect } from "react";

export function useFocusInput(
  inputRef: RefObject<HTMLInputElement | null>, // ✅ FIXED: Accept nullable ref
  shouldFocus: boolean, 
  delay: number = 0
): void {
  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, delay);
      return () => clearTimeout(timeoutId);
    }
  }, [shouldFocus, delay, inputRef]);
}