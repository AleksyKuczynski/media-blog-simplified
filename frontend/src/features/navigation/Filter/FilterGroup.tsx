// src/features/navigation/Filter/FilterGroup.tsx
'use client';

import { Category } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';
import { getFilterAccessibilityData } from '@/config/i18n/helpers/filter';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '@/shared/ui/Dropdown';
import { useFilterGroup, useFilterValidation } from './useFilterGroup';
import SortingControl from './SortingControl';
import { FILTER_STYLES, FILTER_CONTROL_STYLES, FILTER_BUTTON_STYLES } from './styles';
import { cn } from '@/lib/utils';

interface FilterGroupProps {
  readonly categories: Category[];
  readonly dictionary: Dictionary;
  readonly lang: Lang;
}

export default function FilterGroup({
  categories,
  dictionary,
  lang
}: FilterGroupProps) {
  const validation = useFilterValidation(dictionary, categories);
  
  const {
    currentSort,
    categoryItems,
    filterLabels,
    selectedCategoryName,
    handleCategoryChange,
  } = useFilterGroup({
    categories,
    dictionary,
    lang
  });

  const accessibility = getFilterAccessibilityData(dictionary);

  if (!validation.isValid) {
    console.warn('FilterGroup validation issues:', validation.issues);
  }

  try {
    return (
      <div className={FILTER_STYLES.container.base}>
        {/* Category Selector */}
        <div className={FILTER_CONTROL_STYLES.wrapper}>
          <span className={FILTER_CONTROL_STYLES.label}>
            {filterLabels.category}
          </span>
          <Dropdown
            items={categoryItems}
            onSelect={handleCategoryChange}
            width="wide"
            position="left"
          >
            <DropdownTrigger
              className={cn(FILTER_BUTTON_STYLES.dropdown.button, FILTER_BUTTON_STYLES.dropdown.left)}
              textClassName={FILTER_BUTTON_STYLES.text.base}
              iconClassName={FILTER_BUTTON_STYLES.icon}
              ariaLabel={accessibility.categorySelector}
            >
              {selectedCategoryName}
            </DropdownTrigger>
            <DropdownContent>
              {categoryItems.map((item, index) => (
                <DropdownItem
                  key={item.id}
                  item={item}
                  index={index}
                  isSelected={Boolean(item.selected)}
                  onSelect={() => handleCategoryChange(item)}
                />
              ))}
            </DropdownContent>
          </Dropdown>
        </div>

        {/* Sorting Control */}
        <SortingControl
          className={cn(FILTER_BUTTON_STYLES.dropdown.button, FILTER_BUTTON_STYLES.dropdown.rigth)}
          dictionary={dictionary}
          currentSort={currentSort}
        />
      </div>
    );
    
  } catch (error) {
    console.error('FilterGroup: Error rendering component', error);
    
    return (
      <div className={FILTER_STYLES.container.base}>
        <div className={FILTER_CONTROL_STYLES.wrapper}>
          <span className={FILTER_CONTROL_STYLES.label}>
            {filterLabels.category}
          </span>
          <div className={FILTER_BUTTON_STYLES.dropdown.wide}>
            {filterLabels.allCategories}
          </div>
        </div>
        
        <div className={FILTER_CONTROL_STYLES.wrapper}>
          <span className={FILTER_CONTROL_STYLES.label}>
            {filterLabels.sortOrder}
          </span>
          <div className={FILTER_BUTTON_STYLES.dropdown.base}>
            {filterLabels.newest}
          </div>
        </div>
      </div>
    );
  }
}