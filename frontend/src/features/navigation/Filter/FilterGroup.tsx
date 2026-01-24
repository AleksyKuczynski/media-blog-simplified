// src/features/navigation/Filter/FilterGroup.tsx
'use client';

import { useState, useCallback } from 'react';
import { Category } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';
import { getFilterAccessibilityData } from '@/config/i18n/helpers/filter';
import { useFilterGroup, useFilterValidation } from './useFilterGroup';
import SortingControl from './SortingControl';
import { FILTER_STYLES, FILTER_CONTROL_STYLES } from './filter.styles';
import { cn } from '@/lib/utils';
import Dropdown from '@/shared/ui/Dropdown/Dropdown';
import DropdownTrigger from '@/shared/ui/Dropdown/DropdownTrigger';
import DropdownContent from '@/shared/ui/Dropdown/DropdownContent';
import DropdownItem from '@/shared/ui/Dropdown/DropdownItem';

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
  const [openDropdown, setOpenDropdown] = useState<'category' | 'sorting' | null>(null);
  const [hoveredButton, setHoveredButton] = useState<'category' | 'sorting' | null>(null);
  const [isHoveringContainer, setIsHoveringContainer] = useState(false);
  
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

  const handleCategoryOpenChange = useCallback((isOpen: boolean) => {
    setOpenDropdown(isOpen ? 'category' : null);
  }, []);

  const handleSortingOpenChange = useCallback((isOpen: boolean) => {
    setOpenDropdown(isOpen ? 'sorting' : null);
  }, []);

  const handleCategoryHoverChange = useCallback((isHovering: boolean) => {
    setHoveredButton(isHovering ? 'category' : null);
  }, []);

  const handleSortingHoverChange = useCallback((isHovering: boolean) => {
    setHoveredButton(isHovering ? 'sorting' : null);
  }, []);

  const isAnyDropdownOpen = openDropdown !== null;
  const isHoveringInactive = hoveredButton !== null && hoveredButton !== openDropdown;
  const showDivider = !isAnyDropdownOpen && (hoveredButton === null || !isHoveringContainer);

  console.log('Divider state:', { openDropdown, hoveredButton, isHoveringContainer, showDivider });

  const containerClassName = cn(
    FILTER_STYLES.container.base,
    isAnyDropdownOpen && isHoveringInactive 
      ? FILTER_STYLES.container.activeHover 
      : isAnyDropdownOpen 
        ? FILTER_STYLES.container.active 
        : FILTER_STYLES.container.inactive
  );

  try {
    return (
      <div 
        className={containerClassName}
        onMouseEnter={() => setIsHoveringContainer(true)}
        onMouseLeave={() => setIsHoveringContainer(false)}
      >
        {/* Category Selector */}
        <div 
          className={FILTER_CONTROL_STYLES.wrapper}
          onMouseEnter={handleCategoryHoverChange.bind(null, true)}
          onMouseLeave={handleCategoryHoverChange.bind(null, false)}
        >
          <Dropdown
            items={categoryItems}
            onSelect={handleCategoryChange}
            onOpenChange={handleCategoryOpenChange}
            defaultItemId="all"
          >
            <DropdownTrigger
              className={FILTER_CONTROL_STYLES.dropdown.button}
              label={filterLabels.category}
              classNames={{
                label: FILTER_CONTROL_STYLES.label,
                text: FILTER_CONTROL_STYLES.dropdown.text,
                icon: FILTER_CONTROL_STYLES.dropdown.icon
              }}
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

        {/* Divider */}
        <div 
          className={cn(
            FILTER_STYLES.divider.base,
            showDivider 
              ? FILTER_STYLES.divider.visible 
              : FILTER_STYLES.divider.hidden
          )}
        />

        {/* Sorting Control */}
        <SortingControl
          dictionary={dictionary}
          currentSort={currentSort}
          onOpenChange={handleSortingOpenChange}
          onHoverChange={handleSortingHoverChange}
        />
      </div>
    );
    
  } catch (error) {
    console.error('FilterGroup: Error rendering component', error);
    return null;
  }
}