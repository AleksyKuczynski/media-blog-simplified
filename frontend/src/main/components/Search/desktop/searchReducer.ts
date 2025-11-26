// src/main/components/Search/searchReducer.ts

import { SearchUIState, SearchStepAction, SearchScenario, ComponentMode } from '../types';

export const getInitialState = (mode: ComponentMode = 'expandable'): SearchUIState => ({
  mode,
  input: {
    visibility: mode === 'standard' ? 'visible' : 'hidden',
    isFocused: false
  },
  dropdown: {
    visibility: 'hidden',
    content: 'message'
  },
  query: '',
  suggestions: [],
  searchStatus: { 
    type: 'minChars',
    current: 0,
    required: 3 
  },
  selectedIndex: -1
});

export function searchReducer(
  state: SearchUIState,
  action: SearchStepAction | SearchScenario
): SearchUIState {
  if (state.mode === 'standard') {
    switch (action.type) {
      case 'START_INPUT_COLLAPSE':
      case 'COMPLETE_INPUT_COLLAPSE':
        return state;
    }
  }
  
  switch (action.type) {
    // Expand Search Steps
    case 'START_SEARCH_EXPANSION':
      return {
        ...state,
        input: {
          visibility: 'hidden',
          isFocused: false
        }
      };

    case 'ANIMATE_SEARCH_EXPANSION':
      return {
        ...state,
        input: {
          visibility: 'animating-in',
          isFocused: false
        }
      };

    case 'COMPLETE_SEARCH_EXPANSION':
      return {
        ...state,
        input: {
          visibility: 'visible',
          isFocused: false
        }
      };

    case 'SET_FOCUS':
      return {
        ...state,
        input: {
          ...state.input,
          isFocused: true
        }
      };

    case 'START_DROPDOWN_EXPANSION':
      return {
        ...state,
        dropdown: {
          visibility: 'animating-in',
          content: state.dropdown.content
        }
      };

    case 'SET_MESSAGE':
      return {
        ...state,
        dropdown: {
          ...state.dropdown,
          content: 'message'
        },
        searchStatus: {
          type: 'minChars',
          current: state.query.length,
          required: 3
        }
      };

    case 'COMPLETE_DROPDOWN_EXPANSION':
      return {
        ...state,
        dropdown: {
          ...state.dropdown,
          visibility: 'visible'
        }
      };

    // Collapse Search Steps
    case 'START_DROPDOWN_COLLAPSE':
      return {
        ...state,
        dropdown: {
          ...state.dropdown,
          visibility: 'animating-out'
        }
      };

    case 'COMPLETE_DROPDOWN_COLLAPSE':
      return {
        ...state,
        dropdown: {
          visibility: 'hidden',
          content: 'empty'
        }
      };

    case 'START_INPUT_COLLAPSE':
      return {
        ...state,
        input: {
          ...state.input,
          visibility: 'animating-out',
          isFocused: false
        }
      };

    case 'COMPLETE_INPUT_COLLAPSE':
      return {
        ...state,
        input: {
          visibility: 'hidden',
          isFocused: false
        }
      };

    case 'CLEAR_QUERY':
      return {
        ...state,
        query: '',
        searchStatus: { 
          type: 'minChars',
          current: 0,
          required: 3 
        }
      };

    // Search Execution Steps
    case 'START_SEARCH':
      return {
        ...state,
        searchStatus: { type: 'idle' }
      };

    case 'SET_QUERY':
      return {
        ...state,
        query: action.payload,
        searchStatus: {
          type: 'minChars',
          current: action.payload.length,
          required: 3
        },
        dropdown: {
          ...state.dropdown,
          content: 'message'
        }
      };

    case 'SET_SEARCHING_STATE':
      return {
        ...state,
        searchStatus: { type: 'searching' }
      };

    case 'SET_SUGGESTIONS':
      return {
        ...state,
        suggestions: action.payload,
        searchStatus: {
          type: action.payload.length > 0 ? 'success' : 'noResults',
          count: action.payload.length
        },
        dropdown: {
          ...state.dropdown,
          content: action.payload.length > 0 ? 'suggestions' : 'message'
        }
      };

    case 'SET_SEARCH_ERROR':
      return {
        ...state,
        searchStatus: { type: 'noResults' },
        suggestions: [],
        dropdown: {
          ...state.dropdown,
          content: 'message'
        }
      };

    // Navigation Steps
    case 'NAVIGATE_UP':
      return {
        ...state,
        selectedIndex: Math.max(state.selectedIndex - 1, -1)
      };

    case 'NAVIGATE_DOWN':
      return {
        ...state,
        selectedIndex: Math.min(
          state.selectedIndex + 1,
          state.suggestions.length - 1
        )
      };

    // Selection Steps
    case 'SELECT_ITEM':
      return {
        ...state,
        selectedIndex: action.payload
      };

    // Reset
    case 'RESET_STATE':
      return {
        ...getInitialState(state.mode)
      };

    // Handle scenarios by delegating to orchestrator
    case 'SCENARIO_EXPAND_SEARCH':
    case 'SCENARIO_COLLAPSE_SEARCH':
    case 'SCENARIO_EXECUTE_SEARCH':
    case 'SCENARIO_NAVIGATE_RESULTS':
    case 'SCENARIO_SELECT_RESULT':
      // These are handled by searchScenarios.ts
      return state;

    default:
      return state;
  }
}