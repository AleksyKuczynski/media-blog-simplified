// src/main/components/Navigation/FilterGroup.tsx
// FIXED: React hooks rules, type safety, uses dictionary entries

'use client';

import { Category } from '@/main/lib/directus/directusInterfaces';
import { Dictionary, Lang } from '@/main/lib/dictionary';
import { ChevronDownIcon } from '../../Interface/Icons';
import { getFilterAccessibilityData } from '@/main/lib/dictionary/helpers/filter';
import { CustomButton, NavButton } from '../../Interface';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '../../Interface/Dropdown';
import { useFilterGroup, useFilterValidation } from './useFilterGroup';
import SortingControl from './SortingControl';

// ===================================================================
// TYPES - Simple and clean
// ===================================================================

interface FilterGroupProps {
  readonly categories: Category[];
  readonly dictionary: Dictionary;
  readonly lang: Lang;
}

// ===================================================================
// MAIN FILTERGROUP COMPONENT - FIXED
// ===================================================================

/**
 * FilterGroup - FIXED: Follows React hooks rules, uses dictionary entries
 * NO DUPLICATION - uses useFilterGroup hook and existing helper patterns
 */
export default function FilterGroup({
  categories,
  dictionary,
  lang
}: FilterGroupProps) {
  // FIXED: All hooks called at top level - no conditional calls
  const validation = useFilterValidation(dictionary, categories);
  
  const {
    currentCategory,
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

  // Check validation after hooks (not before)
  if (!validation.isValid) {
    console.warn('FilterGroup validation issues:', validation.issues);
  }

  try {
    return (
      <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
        {/* Category Selector */}
        <div className="flex flex-col">
          <span className="mb-2 text-sm font-medium text-prcolor">
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
                className="flex items-center justify-between w-full sm:w-48 px-4 py-2 border-2 border-prcolor rounded-md"
                aria-label={accessibility.categorySelector}
              >
                <span className="truncate">
                  {selectedCategoryName}
                </span>
                <ChevronDownIcon className="h-5 w-5 ml-2 flex-shrink-0" />
              </NavButton>
            </DropdownTrigger>
            <DropdownContent>
              {categoryItems.map((item, index) => (
                <DropdownItem
                  key={item.id}
                  item={item}
                  index={index}
                  isSelected={Boolean(item.selected)} // FIXED: ensure boolean
                  onSelect={() => handleCategoryChange(item)}
                />
              ))}
            </DropdownContent>
          </Dropdown>
        </div>

        {/* Sorting Control - uses existing component */}
        <div className="flex flex-col">
          <SortingControl
            dictionary={dictionary}
            currentSort={currentSort}
            lang={lang}
          />
        </div>

        {/* Reset Button - FIXED: removed invalid size prop */}
        <div className="flex flex-col justify-end">
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
    
    // Fallback FilterGroup using dictionary entries
    return (
      <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
        <div className="flex flex-col">
          <span className="mb-2 text-sm font-medium text-prcolor">
            {filterLabels.category}
          </span>
          <div className="w-full sm:w-48 px-4 py-2 border-2 border-prcolor rounded-md">
            {filterLabels.allCategories}
          </div>
        </div>
        
        <div className="flex flex-col">
          <span className="mb-2 text-sm font-medium text-prcolor">
            {filterLabels.sortOrder}
          </span>
          <div className="px-4 py-2 border-2 border-prcolor rounded-md">
            {filterLabels.newest}
          </div>
        </div>
        
        <div className="flex flex-col justify-end">
          <CustomButton
            color="primary"
            onClick={() => window.location.href = '/ru/articles'}
          >
            {filterLabels.reset}
          </CustomButton>
        </div>
      </div>
    );
  }
}

// ===================================================================
// FILTER GROUP VARIANTS - Different configurations, FIXED
// ===================================================================

/**
 * MinimalFilterGroup - Simplified version, FIXED
 */
export function MinimalFilterGroup({
  categories,
  dictionary,
  lang
}: FilterGroupProps) {
  // FIXED: Hooks called at top level
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
      <div className="mb-4 flex items-center justify-between px-4">
        <span className="text-sm text-prcolor">
          {filterLabels.category}: <strong>{selectedCategoryName}</strong>
        </span>
        
        <CustomButton
          color="primary"
          onClick={handleReset}
          // FIXED: removed invalid size prop
        >
          {filterLabels.reset}
        </CustomButton>
      </div>
    );
    
  } catch (error) {
    console.error('MinimalFilterGroup: Error rendering component', error);
    return (
      <div className="mb-4 flex items-center justify-between px-4">
        <span className="text-sm text-prcolor">{filterLabels.allCategories}</span>
        <button onClick={() => window.location.href = '/ru/articles'}>
          {filterLabels.reset}
        </button>
      </div>
    );
  }
}

/**
 * CategoryOnlyFilter - Just category selection, FIXED
 */
export function CategoryOnlyFilter({
  categories,
  dictionary,
  lang
}: FilterGroupProps) {
  // FIXED: Hooks called at top level
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
      <div className="mb-6 flex justify-center">
        <Dropdown
          items={categoryItems}
          onSelect={handleCategoryChange}
          width="wide"
          position="center"
        >
          <DropdownTrigger>
            <NavButton
              context="desktop"
              className="flex items-center justify-between w-64 px-4 py-2 border-2 border-prcolor rounded-md"
            >
              <span className="truncate">{selectedCategoryName}</span>
              <ChevronDownIcon className="h-5 w-5 ml-2 flex-shrink-0" />
            </NavButton>
          </DropdownTrigger>
          <DropdownContent>
            {categoryItems.map((item, index) => (
              <DropdownItem
                key={item.id}
                item={item}
                index={index}
                isSelected={Boolean(item.selected)} // FIXED: ensure boolean
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
      <div className="mb-6 flex justify-center">
        <div className="w-64 px-4 py-2 border-2 border-prcolor rounded-md text-center">
          {filterLabels.labels.allCategories}
        </div>
      </div>
    );
  }
}