// src/main/components/Search/searchScenarios.ts

import { ANIMATION_DURATION } from '../../Interface/constants';
import { ComponentMode, SearchScenario, SearchStepAction } from '../types';

export function executeExpandSearch(
  dispatch: (action: SearchStepAction) => void,
  mode: ComponentMode,
  inputRef: React.RefObject<HTMLInputElement | null>
) {

  console.log('executeExpandSearch called with:', { mode, inputRef });
  if (mode === 'standard') {
    dispatch({ type: 'START_DROPDOWN_EXPANSION' });
    dispatch({ type: 'SET_MESSAGE' });
    setTimeout(() => {
      dispatch({ type: 'COMPLETE_DROPDOWN_EXPANSION' });
    }, ANIMATION_DURATION);
    return;
  }

  dispatch({ type: 'RESET_STATE' });
  
  // Start expansion
  requestAnimationFrame(() => {
    dispatch({ type: 'START_SEARCH_EXPANSION' });
    dispatch({ type: 'ANIMATE_SEARCH_EXPANSION' });
    
    // Complete expansion and set focus
    setTimeout(() => {
      dispatch({ type: 'COMPLETE_SEARCH_EXPANSION' });
      
      // Try to focus right after completing expansion
      setTimeout(() => {
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }, 300);

      // Show dropdown
      dispatch({ type: 'START_DROPDOWN_EXPANSION' });
      dispatch({ type: 'SET_MESSAGE' });
      
      setTimeout(() => {
        dispatch({ type: 'COMPLETE_DROPDOWN_EXPANSION' });
      }, ANIMATION_DURATION);
    }, ANIMATION_DURATION);
  });
}

export function executeCollapseSearch(
  dispatch: (action: SearchStepAction) => void, 
  mode: ComponentMode
) {
  requestAnimationFrame(() => {
    if (mode === 'standard') {
      dispatch({ type: 'CLEAR_QUERY' });
    }
    
    // First collapse dropdown
    dispatch({ type: 'START_DROPDOWN_COLLAPSE' });
    
    setTimeout(() => {
      dispatch({ type: 'COMPLETE_DROPDOWN_COLLAPSE' });
      
      // Then collapse input if in expandable mode
      if (mode === 'expandable') {
        requestAnimationFrame(() => {
          dispatch({ type: 'START_INPUT_COLLAPSE' });
          setTimeout(() => {
            dispatch({ type: 'COMPLETE_INPUT_COLLAPSE' });
            dispatch({ type: 'RESET_STATE' });
          }, ANIMATION_DURATION);
        });
      }
    }, ANIMATION_DURATION);
  });
}

export function executeSearch(
  dispatch: (action: SearchStepAction) => void, 
  searchQuery: string
) {
  dispatch({ type: 'START_SEARCH' });
  dispatch({ type: 'SET_QUERY', payload: searchQuery });
  
  if (searchQuery.length >= 3) {
    dispatch({ type: 'SET_SEARCHING_STATE' });
  }
}

export function navigateResults(
  dispatch: (action: SearchStepAction) => void,
  direction: 'up' | 'down'
) {
  dispatch({ 
    type: direction === 'up' ? 'NAVIGATE_UP' : 'NAVIGATE_DOWN' 
  });
}

export function selectResult(
  dispatch: (action: SearchStepAction) => void,
  index: number,
  mode: ComponentMode
) {
  dispatch({ type: 'SELECT_ITEM', payload: index });
  executeCollapseSearch(dispatch, mode);
}

// Main scenario handler
export function handleSearchScenario(scenario: SearchScenario): void {
  switch (scenario.type) {
    case 'SCENARIO_EXPAND_SEARCH':
      executeExpandSearch(scenario.dispatch, scenario.mode, scenario.inputRef);
      break;
      
    case 'SCENARIO_COLLAPSE_SEARCH':
      executeCollapseSearch(scenario.dispatch, scenario.mode);
      break;
      
    case 'SCENARIO_EXECUTE_SEARCH':
      executeSearch(scenario.dispatch, scenario.payload);
      break;
      
    case 'SCENARIO_NAVIGATE_RESULTS':
      navigateResults(scenario.dispatch, scenario.direction);
      break;
      
    case 'SCENARIO_SELECT_RESULT':
      selectResult(scenario.dispatch, scenario.index, scenario.mode);
      break;
  }
}