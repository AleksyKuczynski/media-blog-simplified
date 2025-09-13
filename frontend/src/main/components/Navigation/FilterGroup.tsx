// src/main/components/Navigation/FilterGroup.tsx
'use client';

import React from 'react';
import { Category } from '@/main/lib/directus/directusInterfaces';
import { SortingTranslations, CategoryTranslations } from '@/main/lib/dictionaries/dictionariesTypes';
import { ChevronDownIcon } from '../Interface/Icons';
import SortingControl from './SortingControl';
import { useFilterGroup } from './useFilterGroup';
import { CustomButton, NavButton } from '../Interface';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '../Interface/Dropdown';
import { Lang } from '@/main/lib/dictionary/types';

interface FilterGroupProps {
  categories: Category[];
  sortingTranslations: SortingTranslations;
  categoryTranslations: CategoryTranslations;
  resetText: string;
  lang: Lang;
}

export default function FilterGroup({
  categories,
  sortingTranslations,
  categoryTranslations,
  resetText,
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
    categoryTranslations,
    lang
  });

  return (
    <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
      {/* Category Selector */}
      <div className="flex flex-col">
        <span className="mb-2 text-sm font-medium text-prcolor">
          {categoryTranslations.categories}
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
              aria-label={categoryTranslations.selectCategory}
            >
              <span className="truncate">
                {currentCategory 
                  ? categories.find(c => c.slug === currentCategory)?.name 
                  : categoryTranslations.allCategories}
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

      {/* Sorting Control */}
      <div className="flex flex-col">
        <SortingControl
          translations={sortingTranslations}
          currentSort={currentSort}
          lang={lang}
        />
      </div>

      {/* Reset Button */}
      <div className="flex flex-col justify-end">
        <CustomButton
          color="primary"
          onClick={handleReset}
          aria-label={resetText}
        >
          {resetText}
        </CustomButton>
      </div>
    </div>
  );
}