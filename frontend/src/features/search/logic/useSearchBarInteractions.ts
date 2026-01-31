// src/features/search/logic/useSearchBarInteractions.ts
import { useState, useCallback } from 'react';

type DropdownType = 'search' | 'sorting' | null;
type ControlType = 'search' | 'sorting' | null;

export function useSearchBarInteractions() {
  const [isFocused, setIsFocused] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const [hoveredControl, setHoveredControl] = useState<ControlType>(null);
  const [isHoveringContainer, setIsHoveringContainer] = useState(false);

  const handleDropdownClose = useCallback(() => {
    setOpenDropdown(null);
    setIsFocused(false);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setOpenDropdown('search');
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setOpenDropdown(null);
  }, []);

  const handleSortingOpenChange = useCallback((isOpen: boolean) => {
    setOpenDropdown(isOpen ? 'sorting' : null);
  }, []);

  const handleSearchHoverChange = useCallback((isHovering: boolean) => {
    setHoveredControl(isHovering ? 'search' : null);
  }, []);

  const handleSortingHoverChange = useCallback((isHovering: boolean) => {
    setHoveredControl(isHovering ? 'sorting' : null);
  }, []);

  const setContainerHover = useCallback((isHovering: boolean) => {
    setIsHoveringContainer(isHovering);
  }, []);

  const isAnyDropdownOpen = openDropdown !== null;
  const isHoveringInactive = hoveredControl !== null && hoveredControl !== openDropdown;

  return {
    state: {
      isFocused,
      openDropdown,
      hoveredControl,
      isHoveringContainer,
      isAnyDropdownOpen,
      isHoveringInactive
    },
    handlers: {
      handleDropdownClose,
      handleFocus,
      handleBlur,
      handleSortingOpenChange,
      handleSearchHoverChange,
      handleSortingHoverChange,
      setContainerHover
    }
  };
}