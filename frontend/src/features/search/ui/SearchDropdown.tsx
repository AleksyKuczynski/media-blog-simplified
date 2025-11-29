// src/features/search/ui/SearchDropdown.tsx
import { SearchUIState } from '../types';
import SearchDropdownItem from './SearchDropdownItem';
import { Dictionary } from '@/config/i18n';
import { SEARCH_DROPDOWN_STYLES } from '../search.styles';

interface SearchDropdownProps {
  state: SearchUIState;
  dict: Dictionary;
  onItemSelect: (index: number) => void;
  className?: string;
  ariaLabel?: string; 
}

export default function SearchDropdown({
  state,
  dict,
  onItemSelect,
  className = '',
  ariaLabel
}: SearchDropdownProps) {

  const getVisibilityClasses = () => {
    switch (state.dropdown.visibility) {
      case 'hidden':
        return SEARCH_DROPDOWN_STYLES.visibility.hidden;
      case 'animating-in':
        return SEARCH_DROPDOWN_STYLES.visibility.animatingIn;
      case 'visible':
        return SEARCH_DROPDOWN_STYLES.visibility.visible;
      case 'animating-out':
        return SEARCH_DROPDOWN_STYLES.visibility.animatingOut;
      default:
        return SEARCH_DROPDOWN_STYLES.visibility.hidden;
    }
  };

  function renderContent() {
    if (state.dropdown.content === 'message') {
      return (
        <div className={SEARCH_DROPDOWN_STYLES.content.message}>
          {renderStatusMessage()}
        </div>
      );
    }

    if (state.dropdown.content === 'suggestions') {
      return (
        <ul>
          {state.suggestions.map((suggestion, index) => (
            <SearchDropdownItem
              key={suggestion.slug}
              suggestion={suggestion}
              isHighlighted={index === state.selectedIndex}
              onSelect={() => onItemSelect(index)}
              dictionary={dict}
            />
          ))}
        </ul>
      );
    }

    return null;
  }

  function renderStatusMessage() {
    switch (state.searchStatus.type) {
      case 'minChars':
        return dict.search.labels.minCharacters;
      case 'searching':
        return dict.search.labels.searching;
      case 'noResults':
        return dict.search.labels.noResults;
      default:
        return null;
    }
  }

  if (state.dropdown.visibility === 'hidden') {
    return null;
  }

  return (
    <div 
      className={`
        ${SEARCH_DROPDOWN_STYLES.container.base}
        ${getVisibilityClasses()}
        ${className}
      `.trim()}
      role="listbox"
      aria-hidden={state.dropdown.visibility === 'animating-out'}
      aria-label={ariaLabel}
    >
      <div className={SEARCH_DROPDOWN_STYLES.content.wrapper}>
        {renderContent()}
      </div>
    </div>
  );
}