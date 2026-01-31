//  src/main/components/Navigation/menuAnimationReducer.ts

type MenuAnimationState = 
  | 'CLOSED' 
  | 'OPENING'
  | 'OPENED'
  | 'FULLY_OPENED'
  | 'HIDING_CONTROLS'
  | 'CLOSING';

type MenuAction =
  | { type: 'OPEN_MENU' }
  | { type: 'SHOW_CONTROLS' }
  | { type: 'HIDE_CONTROLS' }
  | { type: 'CLOSE_MENU' }
  | { type: 'RESET'};

  export function menuAnimationReducer(state: MenuAnimationState, action: MenuAction): MenuAnimationState {
    switch (action.type) {
      case 'OPEN_MENU':
        return 'OPENING';
      case 'SHOW_CONTROLS':
        return state === 'OPENING' ? 'FULLY_OPENED' : state;
      case 'HIDE_CONTROLS':
        return state === 'FULLY_OPENED' ? 'HIDING_CONTROLS' : state;
      case 'CLOSE_MENU':
        return state === 'HIDING_CONTROLS' ? 'CLOSING' : state;
      case 'RESET':  // Dodajemy nową akcję
        return 'CLOSED';
      default:
        return state;
    }
  }