// src/features/search/logic/searchScenarios.ts

import { SearchScenario, SearchStepAction } from '../types';

export function executeExpandSearch(
  dispatch: (action: SearchStepAction) => void
) {
  dispatch({ type: 'SHOW_DROPDOWN' });
  dispatch({ type: 'SET_MESSAGE' });
}

export function executeCollapseSearch(
  dispatch: (action: SearchStepAction) => void
) {
  dispatch({ type: 'HIDE_DROPDOWN' });
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
  index: number
) {
  dispatch({ type: 'SELECT_ITEM', payload: index });
}

export function handleSearchScenario(scenario: SearchScenario) {
  switch (scenario.type) {
    case 'SCENARIO_EXPAND_SEARCH':
      executeExpandSearch(scenario.dispatch);
      break;
    case 'SCENARIO_COLLAPSE_SEARCH':
      executeCollapseSearch(scenario.dispatch);
      break;
    case 'SCENARIO_EXECUTE_SEARCH':
      executeSearch(scenario.dispatch, scenario.payload);
      break;
    case 'SCENARIO_NAVIGATE_RESULTS':
      navigateResults(scenario.dispatch, scenario.direction);
      break;
    case 'SCENARIO_SELECT_RESULT':
      selectResult(scenario.dispatch, scenario.index);
      break;
  }
}