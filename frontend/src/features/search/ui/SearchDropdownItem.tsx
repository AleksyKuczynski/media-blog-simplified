// src/features/search/ui/SearchDropdownItem.tsx
import { Dictionary } from '@/config/i18n';
import { SearchResult } from '@/api/directus';
import { SEARCH_DROPDOWN_ITEM_STYLES } from '../search.styles';

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
        ${SEARCH_DROPDOWN_ITEM_STYLES.item.base}
        ${isHighlighted 
          ? SEARCH_DROPDOWN_ITEM_STYLES.item.highlighted
          : SEARCH_DROPDOWN_ITEM_STYLES.item.default
        }
      `.trim()}
      onClick={onSelect}
      onMouseDown={(e) => e.preventDefault()}
      aria-selected={isHighlighted}
    >
      <div className={SEARCH_DROPDOWN_ITEM_STYLES.badge}>
        {suggestion.type === 'author' && dictionary.navigation.labels.authors}
        {suggestion.type === 'category' && dictionary.navigation.labels.categories}
        {suggestion.type === 'article' && dictionary.navigation.labels.articles}
      </div>

      <div className={SEARCH_DROPDOWN_ITEM_STYLES.title}>
        {suggestion.type === 'article' ? suggestion.title : suggestion.name}
      </div>

      {suggestion.type === 'article' && suggestion.description && (
        <div className={`
          ${SEARCH_DROPDOWN_ITEM_STYLES.description.base}
          ${isHighlighted 
            ? SEARCH_DROPDOWN_ITEM_STYLES.description.highlighted
            : SEARCH_DROPDOWN_ITEM_STYLES.description.default
          }
        `.trim()}>
          {suggestion.description}
        </div>
      )}
      {(suggestion.type === 'author' || suggestion.type === 'category') && (
        <div className={`
          ${SEARCH_DROPDOWN_ITEM_STYLES.meta.base}
          ${isHighlighted 
            ? SEARCH_DROPDOWN_ITEM_STYLES.meta.highlighted
            : SEARCH_DROPDOWN_ITEM_STYLES.meta.default
          }
        `.trim()}>
          {suggestion.articleCount} {dictionary.common.count.articles}
        </div>
      )}
    </li>
  );
}