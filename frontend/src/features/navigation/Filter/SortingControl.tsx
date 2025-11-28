// src/main/components/Navigation/SortingControl.tsx
// Migrated to new dictionary structure - clean implementation
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dictionary, Lang } from '@/config/i18n';
import { ChevronDownIcon } from '@/shared/primitives/Icons';
import type { DropdownItemType } from '@/shared/ui/Dropdown/types';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '@/shared/ui/Dropdown';
import { NavButton } from '@/shared/primitives/NavButton';

interface SortingControlProps {
  readonly dictionary: Dictionary;
  readonly currentSort: string;
  readonly lang: Lang;
}

/**
 * SortingControl - Migrated to new dictionary structure
 * Uses dictionary.sorting instead of separate translations prop
 */
export default function SortingControl({ 
  dictionary, 
  currentSort, 
  lang 
}: SortingControlProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Access sorting translations from dictionary
  const sorting = dictionary.filter;

  const sortItems: DropdownItemType[] = [
    { id: 'desc', label: sorting.labels.newest, value: 'desc' },
    { id: 'asc', label: sorting.labels.oldest, value: 'asc' }
  ];

  const items = sortItems.map(item => ({
    ...item,
    selected: item.value === currentSort
  }));

  const handleSortChange = (item: DropdownItemType) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', item.value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-prcolor">
        {sorting.labels.sortBy}
      </span>
      <Dropdown
        items={items}
        onSelect={handleSortChange}
        width="wide"
        position="right"
      >
        <DropdownTrigger>
          <NavButton
            context="desktop"
            className="flex items-center justify-between w-full px-4 py-2 border-2 border-prcolor rounded-md"
            aria-label={sorting.labels.sortBy}
          >
            <span className="truncate">
              {sortItems.find(item => item.value === currentSort)?.label}
            </span>
            <ChevronDownIcon className="h-5 w-5 ml-2 flex-shrink-0" />
          </NavButton>
        </DropdownTrigger>
        <DropdownContent>
          {items.map((item, index) => (
            <DropdownItem
              key={item.id}
              item={item}
              index={index}
              isSelected={item.value === currentSort}
              onSelect={() => handleSortChange(item)}
            />
          ))}
        </DropdownContent>
      </Dropdown>
    </div>
  );
}