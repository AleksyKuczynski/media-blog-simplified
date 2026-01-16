// src/features/navigation/Filter/SortingControl.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dictionary } from '@/config/i18n';
import type { DropdownItemType } from '@/shared/ui/Dropdown/types';
import { FILTER_CONTROL_STYLES, FILTER_BUTTON_STYLES } from './styles';
import Dropdown from '@/shared/ui/Dropdown/Dropdown';
import DropdownTrigger from '@/shared/ui/Dropdown/DropdownTrigger';
import DropdownContent from '@/shared/ui/Dropdown/DropdownContent';
import DropdownItem from '@/shared/ui/Dropdown/DropdownItem';
import { cn } from '@/lib/utils';

interface SortingControlProps {
  readonly dictionary: Dictionary;
  readonly currentSort: string;
  className: string;
}

export default function SortingControl({ 
  dictionary, 
  currentSort,
  className 
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
    <div className={FILTER_CONTROL_STYLES.wrapper}>
      <Dropdown
        items={items}
        onSelect={handleSortChange}
      >
        <DropdownTrigger
          className={cn(FILTER_BUTTON_STYLES.dropdown.button)}
          label={sorting.labels.sortBy}
          classNames={{
            label: FILTER_CONTROL_STYLES.label,
            text: FILTER_BUTTON_STYLES.text.base,
            icon: FILTER_BUTTON_STYLES.icon
          }}
          ariaLabel={sorting.labels.sortBy}
        >
          {sortItems.find(item => item.value === currentSort)?.label}
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