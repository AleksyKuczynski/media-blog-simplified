// src/main/components/Search/SearchDropdown.tsx - CLEANED UP
import { SearchUIState } from '../types';
import SearchDropdownItem from './SearchDropdownItem';
import { Dictionary } from '@/config/i18n';

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

  // Visibility classes - hardcoded rounded theme
  const getVisibilityClasses = () => {
    switch (state.dropdown.visibility) {
      case 'hidden':
        return 'scale-y-0 opacity-0 -translate-y-4 pointer-events-none invisible';
      case 'animating-in':
        return 'scale-y-100 opacity-100 translate-y-0 transition-all duration-300 ease-out delay-150 visible';
      case 'visible':
        return 'scale-y-100 opacity-100 translate-y-0 transition-none visible';
      case 'animating-out':
        return 'scale-y-0 opacity-0 -translate-y-4 transition-all duration-300 ease-in pointer-events-none';
      default:
        return 'scale-y-0 opacity-0 -translate-y-4 pointer-events-none invisible';
    }
  };

  function renderContent() {
    if (state.dropdown.content === 'message') {
      return (
        <div className="px-4 py-2 text-on-sf-var rounded-lg mx-2">
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
        absolute z-50 shadow-lg bg-sf-hi 
        w-full top-full mt-2 max-h-[80vh]
        origin-top transition-none
        rounded-xl
        ${getVisibilityClasses()}
        ${className}
      `.trim()}
      role="listbox"
      aria-hidden={state.dropdown.visibility === 'animating-out'}
      aria-label={ariaLabel}
    >
      <div className="transition-opacity duration-150 opacity-100">
        {renderContent()}
      </div>
    </div>
  );
}