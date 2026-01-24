// src/features/search/types.ts

import { SearchResult } from '@/api/directus';

export type ComponentVisibility = 'hidden' | 'visible';
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
  dropdown: {
    visibility: ComponentVisibility;
    content: DropdownContent;
  };
  query: string;
  suggestions: SearchResult[];
  selectedIndex: number;
  searchStatus: SearchStatus;
}

export type SearchStepAction = 
  // Dropdown steps
  | { type: 'SHOW_DROPDOWN' }
  | { type: 'HIDE_DROPDOWN' }
  | { type: 'SET_MESSAGE' }
  // Search execution steps
  | { type: 'START_SEARCH' }
  | { type: 'SET_QUERY', payload: string }
  | { type: 'SET_SEARCHING_STATE' }
  | { type: 'SET_SUGGESTIONS', payload: SearchResult[] }
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
    }
  | { 
      type: 'SCENARIO_COLLAPSE_SEARCH'; 
      dispatch: (action: SearchStepAction) => void;
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
    };