// src/main/components/Search/SearchDropdownItem.tsx - CLEANED UP
import { SearchProposition } from '@/main/lib/directus/directusInterfaces';

interface SearchDropdownItemProps {
  suggestion: SearchProposition;
  isHighlighted: boolean;
  onSelect: () => void;
}

export default function SearchDropdownItem({
  suggestion,
  isHighlighted,
  onSelect
}: SearchDropdownItemProps) {

  return (
    <li
      role="option"
      className={`
        cursor-pointer transition-colors duration-300
        px-4 py-2 mx-2 first:mt-2 last:mb-2
        ${isHighlighted 
          ? 'bg-pr-fix text-on-pr rounded-lg' 
          : 'text-on-sf hover:bg-sf-cont hover:text-pr-fix rounded-lg'
        }
      `.trim()}
      onClick={onSelect}
      onMouseDown={(e) => {
        // Prevent blur event on the input when clicking an item
        e.preventDefault();
      }}
      aria-selected={isHighlighted}
    >
      {/* Title section with consistent styling */}
      <div className="font-medium">
        {suggestion.title}
      </div>

      {/* Description section with conditional opacity based on state */}
      {suggestion.description && (
        <div 
          className={`
            text-sm truncate mt-0.5
            ${isHighlighted 
              ? 'text-txcolor-inverted/80' 
              : 'text-txcolor-secondary'
            }
          `.trim()}
        >
          {suggestion.description}
        </div>
      )}
    </li>
  );
}