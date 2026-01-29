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

  // Only show dropdown when there are suggestions
  const isVisible = state.dropdown.visibility === 'visible' && state.dropdown.content === 'suggestions';

  if (!isVisible || state.suggestions.length === 0) {
    return null;
  }

  return (
    <div 
      className={`
        ${SEARCH_DROPDOWN_STYLES.container.base}
        ${SEARCH_DROPDOWN_STYLES.visibility.visible}
        ${className}
      `.trim()}
      role="listbox"
      aria-hidden={!isVisible}
      aria-label={ariaLabel}
    >
      <div className={SEARCH_DROPDOWN_STYLES.content.wrapper}>
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
      </div>
    </div>
  );
}