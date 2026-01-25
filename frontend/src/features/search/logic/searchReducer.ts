// src/features/search/logic/searchReducer.ts

import { SearchUIState, SearchStepAction, SearchScenario } from '../types';

export const getInitialState = (): SearchUIState => ({
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
  
  switch (action.type) {
    // Dropdown steps
    case 'SHOW_DROPDOWN':
      return {
        ...state,
        dropdown: {
          ...state.dropdown,
          visibility: 'visible'
        }
      };

    case 'HIDE_DROPDOWN':
      return {
        ...state,
        dropdown: {
          visibility: 'hidden',
          content: 'empty'
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

    // Search execution
    case 'START_SEARCH':
      return state;

    case 'SET_QUERY':
      return {
        ...state,
        query: action.payload
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
        dropdown: {
          visibility: 'visible',
          content: action.payload.length > 0 ? 'suggestions' : 'message'
        },
        searchStatus: action.payload.length > 0
          ? { type: 'success', count: action.payload.length }
          : { type: 'noResults' }
      };

    case 'CLEAR_SUGGESTIONS':
      return {
        ...state,
        suggestions: [],
        dropdown: {
          visibility: 'visible',
          content: 'message'
        },
        searchStatus: {
          type: 'minChars',
          current: state.query.length,
          required: 3
        }
      };

    case 'SET_SEARCH_ERROR':
      return {
        ...state,
        dropdown: {
          visibility: 'visible',
          content: 'message'
        },
        searchStatus: { type: 'noResults' }
      };

    // Navigation
    case 'NAVIGATE_UP':
      return {
        ...state,
        selectedIndex: state.selectedIndex > 0 
          ? state.selectedIndex - 1 
          : state.suggestions.length - 1
      };

    case 'NAVIGATE_DOWN':
      return {
        ...state,
        selectedIndex: state.selectedIndex < state.suggestions.length - 1 
          ? state.selectedIndex + 1 
          : 0
      };

    // Selection
    case 'SELECT_ITEM':
      return {
        ...state,
        selectedIndex: action.payload
      };

    // Reset
    case 'RESET_STATE':
      return getInitialState();

    default:
      return state;
  }
}