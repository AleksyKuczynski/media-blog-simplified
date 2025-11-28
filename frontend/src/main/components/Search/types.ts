// src/main/components/Search/types.ts
// FIXED: React 19 compatible nullable ref types

import { SearchProposition, SearchResult } from '@/main/lib/directus';

export type ComponentMode = 'expandable' | 'standard';
export type ComponentVisibility = 'hidden' | 'animating-in' | 'visible' | 'animating-out';
export type DropdownContent = 'empty' | 'message' | 'suggestions';

// Search status and control
export type SearchStatus = 
  | { type: 'idle' }
  | { type: 'minChars'; current: number; required: number }
  | { type: 'searching' }
  | { type: 'noResults' }
  | { type: 'success'; count: number };

// Unified state interface
export interface SearchUIState {
  mode: ComponentMode;
  input: {
    visibility: ComponentVisibility;
    isFocused: boolean;
  };
  dropdown: {
    visibility: ComponentVisibility;
    content: DropdownContent;
  };
  query: string;
  suggestions: SearchResult[];
  selectedIndex: number;
  searchStatus: SearchStatus;
}

// Search Input handlers interface
export interface SearchInputHandlers {
  onInputChange: (value: string) => void;
  onSearchExpand: () => void;
  onSearchCollapse: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSelect: (index: number) => void;
}

export type SearchStepAction = 
  // Expand search steps
  | { type: 'START_SEARCH_EXPANSION' }
  | { type: 'ANIMATE_SEARCH_EXPANSION' }
  | { type: 'COMPLETE_SEARCH_EXPANSION' }
  | { type: 'SET_FOCUS' }
  | { type: 'START_DROPDOWN_EXPANSION' }
  | { type: 'SET_MESSAGE' }
  | { type: 'COMPLETE_DROPDOWN_EXPANSION' }
  // Collapse search steps
  | { type: 'START_DROPDOWN_COLLAPSE' }
  | { type: 'COMPLETE_DROPDOWN_COLLAPSE' }
  | { type: 'START_INPUT_COLLAPSE' }
  | { type: 'COMPLETE_INPUT_COLLAPSE' }
  | { type: 'CLEAR_QUERY' }
  // Search execution steps
  | { type: 'START_SEARCH' }
  | { type: 'SET_QUERY', payload: string }
  | { type: 'SET_SEARCHING_STATE' }
  | { type: 'SET_SUGGESTIONS', payload: SearchProposition[] }
  | { type: 'SET_SEARCH_ERROR' }
  // Navigation steps
  | { type: 'NAVIGATE_UP' }
  | { type: 'NAVIGATE_DOWN' }
  // Selection steps
  | { type: 'SELECT_ITEM', payload: number }
  // Reset
  | { type: 'RESET_STATE' };

// High-level scenarios
export type SearchScenario =
  | { 
      type: 'SCENARIO_EXPAND_SEARCH';
      dispatch: (action: SearchStepAction) => void;
      mode: ComponentMode;
      inputRef: React.RefObject<HTMLInputElement | null>; // ✅ FIXED: Accept nullable ref
    }
  | { 
      type: 'SCENARIO_COLLAPSE_SEARCH'; 
      dispatch: (action: SearchStepAction) => void;
      mode: ComponentMode;
    }
  | { 
      type: 'SCENARIO_EXECUTE_SEARCH'; 
      payload: string;
      dispatch: (action: SearchStepAction) => void;
    }
  | { 
      type: 'SCENARIO_NAVIGATE_RESULTS'; 
      direction: 'up' | 'down';
      dispatch: (action: SearchStepAction) => void;
    }
  | { 
      type: 'SCENARIO_SELECT_RESULT'; 
      index: number;
      dispatch: (action: SearchStepAction) => void;
      mode: ComponentMode;
    };