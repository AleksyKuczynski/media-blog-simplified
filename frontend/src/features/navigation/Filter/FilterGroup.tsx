// src/features/navigation/Filter/FilterGroup.tsx
'use client';

import { Category } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';
import { ChevronDownIcon } from '../../../shared/primitives/Icons';
import { getFilterAccessibilityData } from '@/config/i18n/helpers/filter';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '@/shared/ui/Dropdown';
import { useFilterGroup, useFilterValidation } from './useFilterGroup';
import SortingControl from './SortingControl';
import { NavButton } from '@/shared/primitives/NavButton';
import { CustomButton } from '@/shared/primitives/CustomButton';
import { FILTER_STYLES, FILTER_CONTROL_STYLES, FILTER_BUTTON_STYLES } from './styles';

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
    handleReset
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
            <DropdownTrigger>
              <NavButton
                context="desktop"
                className={FILTER_BUTTON_STYLES.dropdown.wide}
                aria-label={accessibility.categorySelector}
              >
                <span className={FILTER_BUTTON_STYLES.text.base}>
                  {selectedCategoryName}
                </span>
                <ChevronDownIcon className={FILTER_BUTTON_STYLES.icon} />
              </NavButton>
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
          dictionary={dictionary}
          currentSort={currentSort}
          lang={lang}
        />

        {/* Reset Button */}
        <div className={FILTER_CONTROL_STYLES.resetButtonWrapper}>
          <CustomButton
            color="primary"
            onClick={handleReset}
            aria-label={accessibility.resetButton}
          >
            {filterLabels.reset}
          </CustomButton>
        </div>
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
        
        <div className={FILTER_CONTROL_STYLES.resetButtonWrapper}>
          <CustomButton
            color="primary"
            onClick={() => window.location.href = `/${lang}/articles`}
          >
            {filterLabels.reset}
          </CustomButton>
        </div>
      </div>
    );
  }
}

/**
 * MinimalFilterGroup - Simplified version
 */
export function MinimalFilterGroup({
  categories,
  dictionary,
  lang
}: FilterGroupProps) {
  const {
    filterLabels,
    selectedCategoryName,
    handleReset
  } = useFilterGroup({
    categories,
    dictionary,
    lang
  });

  try {
    return (
      <div className={FILTER_STYLES.container.minimal}>
        <span className="text-sm text-prcolor">
          {filterLabels.category}: <strong>{selectedCategoryName}</strong>
        </span>
        
        <CustomButton
          color="primary"
          onClick={handleReset}
        >
          {filterLabels.reset}
        </CustomButton>
      </div>
    );
    
  } catch (error) {
    console.error('MinimalFilterGroup: Error rendering component', error);
    return (
      <div className={FILTER_STYLES.container.minimal}>
        <span className="text-sm text-prcolor">{filterLabels.allCategories}</span>
        <button onClick={() => window.location.href = `/${lang}/articles`}>
          {filterLabels.reset}
        </button>
      </div>
    );
  }
}

/**
 * CategoryOnlyFilter - Just category selection
 */
export function CategoryOnlyFilter({
  categories,
  dictionary,
  lang
}: FilterGroupProps) {
  const {
    categoryItems,
    selectedCategoryName,
    handleCategoryChange
  } = useFilterGroup({
    categories,
    dictionary,
    lang
  });

  try {
    return (
      <div className={FILTER_STYLES.container.centered}>
        <Dropdown
          items={categoryItems}
          onSelect={handleCategoryChange}
          width="wide"
          position="center"
        >
          <DropdownTrigger>
            <NavButton
              context="desktop"
              className={FILTER_BUTTON_STYLES.dropdown.centered}
            >
              <span className={FILTER_BUTTON_STYLES.text.base}>{selectedCategoryName}</span>
              <ChevronDownIcon className={FILTER_BUTTON_STYLES.icon} />
            </NavButton>
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
    );
    
  } catch (error) {
    console.error('CategoryOnlyFilter: Error rendering component', error);
    const filterLabels = dictionary.filter;
    return (
      <div className={FILTER_STYLES.container.centered}>
        <div className={FILTER_BUTTON_STYLES.dropdown.centered}>
          {filterLabels.labels.allCategories}
        </div>
      </div>
    );
  }
}