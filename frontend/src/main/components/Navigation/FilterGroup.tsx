// src/main/components/Navigation/FilterGroup.tsx
// Updated to work with migrated SortingControl
'use client';

import React from 'react';
import { Category } from '@/main/lib/directus/directusInterfaces';
import { Dictionary, Lang } from '@/main/lib/dictionary/types';
import { ChevronDownIcon } from '../Interface/Icons';
import SortingControl from './SortingControl';
import { useFilterGroup } from './useFilterGroup';
import { CustomButton, NavButton } from '../Interface';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '../Interface/Dropdown';

interface FilterGroupProps {
  readonly categories: Category[];
  readonly dictionary: Dictionary; // MIGRATED: Full dictionary instead of separate translations
  readonly lang: Lang;
}

/**
 * FilterGroup - Updated to work with migrated SortingControl
 * Now uses full dictionary instead of separate translation props
 */
export default function FilterGroup({
  categories,
  dictionary,
  lang
}: FilterGroupProps) {
  const {
    currentCategory,
    currentSort,
    categoryItems,
    handleCategoryChange,
    handleReset
  } = useFilterGroup({
    categories,
    categoryTranslations: dictionary.categories, // Access from dictionary
    lang
  });

  return (
    <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
      {/* Category Selector */}
      <div className="flex flex-col">
        <span className="mb-2 text-sm font-medium text-prcolor">
          {dictionary.categories.allCategories}
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
              aria-label={dictionary.categories.allCategories} // FIXED: Use available property
            >
              <span className="truncate">
                {currentCategory 
                  ? categories.find(c => c.slug === currentCategory)?.name 
                  : dictionary.categories.allCategories}
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
                isSelected={item.value === currentCategory}
                onSelect={() => handleCategoryChange(item)}
              />
            ))}
          </DropdownContent>
        </Dropdown>
      </div>

      {/* MIGRATED: Sorting Control with full dictionary */}
      <div className="flex flex-col">
        <SortingControl
          dictionary={dictionary} // MIGRATED: Pass full dictionary
          currentSort={currentSort}
          lang={lang}
        />
      </div>

      {/* Reset Button */}
      <div className="flex flex-col justify-end">
        <CustomButton
          color="primary"
          onClick={handleReset}
          aria-label={dictionary.filter.reset}
        >
          {dictionary.filter.reset}
        </CustomButton>
      </div>
    </div>
  );
}