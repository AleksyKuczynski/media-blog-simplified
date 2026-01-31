// src/features/search/logic/useSearchBarHandlers.ts
import { useCallback } from 'react';

interface UseSearchBarHandlersProps {
  handleInputChange: (value: string, originalHandler: (value: string) => Promise<void>) => Promise<void>;
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    query: string,
    selectedIndex: number,
    originalHandler: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    cleanupAndClose: () => void
  ) => void;
  originalInputChange: (value: string) => Promise<void>;
  originalKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  handleDropdownClose: () => void;
  query: string;
  selectedIndex: number;
}

export function useSearchBarHandlers({
  handleInputChange,
  handleKeyDown,
  originalInputChange,
  originalKeyDown,
  handleClear,
  handleDropdownClose,
  query,
  selectedIndex
}: UseSearchBarHandlersProps) {
  const cleanupAndClose = useCallback(() => {
    handleClear();
    handleDropdownClose();
  }, [handleClear, handleDropdownClose]);

  const onInputChange = useCallback(
    (value: string) => handleInputChange(value, originalInputChange),
    [handleInputChange, originalInputChange]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => 
      handleKeyDown(e, query, selectedIndex, originalKeyDown, cleanupAndClose),
    [handleKeyDown, query, selectedIndex, originalKeyDown, cleanupAndClose]
  );

  return {
    onInputChange,
    onKeyDown,
    cleanupAndClose
  };
}