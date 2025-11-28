// src/main/components/Search/common/SearchDropdownItem.tsx
import { Dictionary } from '@/main/lib/dictionary';
import { SearchResult } from '@/main/lib/directus/directusInterfaces';

interface SearchDropdownItemProps {
  suggestion: SearchResult;
  isHighlighted: boolean;
  onSelect: () => void;
  dictionary: Dictionary;
}

export default function SearchDropdownItem({
  suggestion,
  isHighlighted,
  onSelect,
  dictionary
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
      onMouseDown={(e) => e.preventDefault()}
      aria-selected={isHighlighted}
    >
      {/* Type badge */}
      <div className="text-xs font-medium uppercase tracking-wide opacity-70 mb-1">
        {suggestion.type === 'author' && dictionary.navigation.labels.authors}
        {suggestion.type === 'category' && dictionary.navigation.labels.categories}
        {suggestion.type === 'article' && dictionary.navigation.labels.articles}
      </div>

      {/* Title */}
      <div className="font-medium">
        {suggestion.type === 'article' ? suggestion.title : suggestion.name}
      </div>

      {/* Description/Count */}
      {suggestion.type === 'article' && suggestion.description && (
        <div className={`text-sm truncate mt-0.5 ${isHighlighted ? 'text-txcolor-inverted/80' : 'text-txcolor-secondary'}`}>
          {suggestion.description}
        </div>
      )}
      {(suggestion.type === 'author' || suggestion.type === 'category') && (
        <div className={`text-sm mt-0.5 ${isHighlighted ? 'text-txcolor-inverted/80' : 'text-txcolor-secondary'}`}>
          {suggestion.articleCount} {dictionary.common.count.articles}
        </div>
      )}
    </li>
  );
}