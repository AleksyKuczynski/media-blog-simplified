// src/main/components/Interface/Dropdown/types.ts
import { RefObject } from 'react';

export type DropdownItemType = {
  id: string | number;
  label: string;
  value: string;
  selected?: boolean;
  icon?: React.ReactNode;
  group?: string;
}

export interface DropdownContextType {
  isOpen: boolean;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  toggle: () => void;
  close: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  dropdownRef: RefObject<HTMLDivElement | null>;
  itemRefs: RefObject<(HTMLLIElement | null)[]>;
  items: DropdownItemType[];
  onSelect: (item: DropdownItemType) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleClick: (e: React.MouseEvent) => void;
  focusTrigger: () => void;
  focusItem: (index: number) => void;
}

export interface DropdownBaseProps {
  width?: 'icon' | 'narrow' | 'wide' | 'auto';
  position?: 'left' | 'center' | 'right';
}

export interface DropdownProps extends DropdownBaseProps {
  children: React.ReactNode;
  items: DropdownItemType[];
  onSelect: (item: DropdownItemType) => void;
}

export interface DropdownContentProps extends DropdownBaseProps {
  children: React.ReactNode;
}

export interface DropdownTriggerProps {
  children: React.ReactElement;
}

export interface DropdownItemProps {
  item: DropdownItemType;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}