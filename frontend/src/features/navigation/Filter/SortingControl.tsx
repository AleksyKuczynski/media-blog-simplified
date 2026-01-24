// src/features/navigation/Filter/SortingControl.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dictionary } from '@/config/i18n';
import type { DropdownItemType } from '@/shared/ui/Dropdown/types';
import { FILTER_CONTROL_STYLES, SEARCH_SORTING_STYLES } from './styles';
import Dropdown from '@/shared/ui/Dropdown/Dropdown';
import DropdownTrigger from '@/shared/ui/Dropdown/DropdownTrigger';
import DropdownContent from '@/shared/ui/Dropdown/DropdownContent';
import DropdownItem from '@/shared/ui/Dropdown/DropdownItem';

interface SortingControlProps {
  readonly dictionary: Dictionary;
  readonly currentSort: string;
  readonly variant?: 'filter' | 'search';
  onOpenChange?: (isOpen: boolean) => void;
  onHoverChange?: (isHovering: boolean) => void;
}

export default function SortingControl({ 
  dictionary, 
  currentSort,
  variant = 'filter',
  onOpenChange,
  onHoverChange
}: SortingControlProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const sorting = dictionary.filter;
  const styles = variant === 'search' ? SEARCH_SORTING_STYLES : FILTER_CONTROL_STYLES;

  const sortItems: DropdownItemType[] = [
    { id: 'desc', label: sorting.labels.newest, value: 'desc' },
    { id: 'asc', label: sorting.labels.oldest, value: 'asc' },
    { id: 'likes', label: sorting.labels.mostLiked, value: 'likes' },
    { id: 'views', label: sorting.labels.mostViewed, value: 'views' }
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
    <div 
      className={styles.wrapper}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <Dropdown
        items={items}
        onSelect={handleSortChange}
        onOpenChange={onOpenChange}
        defaultItemId="desc"
      >
        <DropdownTrigger
          className={styles.dropdown.button}
          label={sorting.labels.sortBy}
          classNames={{
            label: styles.label,
            text: styles.dropdown.text,
            icon: styles.dropdown.icon
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