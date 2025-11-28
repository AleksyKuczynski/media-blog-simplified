// src/main/components/Interface/Dropdown/DropdownContext.tsx
'use client';

import { createContext, useContext } from 'react';
import type { DropdownContextType } from './types';

export const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdownContext must be used within a Dropdown provider');
  }
  return context;
}