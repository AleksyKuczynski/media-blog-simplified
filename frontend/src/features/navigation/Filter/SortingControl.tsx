// src/features/navigation/Filter/SortingControl.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dictionary, Lang } from '@/config/i18n';
import { ChevronDownIcon } from '@/shared/primitives/Icons';
import type { DropdownItemType } from '@/shared/ui/Dropdown/types';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '@/shared/ui/Dropdown';
import { FILTER_CONTROL_STYLES, FILTER_BUTTON_STYLES } from './styles';

interface SortingControlProps {
  readonly dictionary: Dictionary;
  readonly currentSort: string;
  readonly lang: Lang;
}

export default function SortingControl({ 
  dictionary, 
  currentSort, 
  lang 
}: SortingControlProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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
    <div className={FILTER_CONTROL_STYLES.wrapperWithGap}>
      <span className={FILTER_CONTROL_STYLES.label}>
        {sorting.labels.sortBy}
      </span>
      <Dropdown
        items={items}
        onSelect={handleSortChange}
        width="wide"
        position="right"
      >
        <DropdownTrigger>
          <button
            className="flex items-center justify-between w-full px-4 py-2 border-2 border-prcolor rounded-md transition-all duration-200 text-on-sf-var hover:text-on-sf hover:bg-sf-hi"
            aria-label={sorting.labels.sortBy}
            type="button"
          >
            <span className={FILTER_BUTTON_STYLES.text.base}>
              {sortItems.find(item => item.value === currentSort)?.label}
            </span>
            <ChevronDownIcon className={FILTER_BUTTON_STYLES.icon} />
          </button>
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