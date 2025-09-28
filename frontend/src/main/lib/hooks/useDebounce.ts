// src/main/lib/hooks/useDebounce.ts

import { useCallback, useRef } from "react";

export function useDebounce(func: Function, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => func(...args), delay);
  }, [func, delay]);
}