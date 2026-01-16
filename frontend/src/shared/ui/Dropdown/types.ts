// src/shared/ui/Dropdown/types.ts

export interface DropdownProps {
  children: React.ReactNode;
  items: DropdownItemType[];
  onSelect: (item: DropdownItemType) => void;
}

export interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  ariaLabel?: string;
}

export type DropdownItemType = {
  id: string | number;
  label: string;
  value: string;
  selected?: boolean;
}

export interface DropdownItemProps {
  item: DropdownItemType;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

// Context definition
export interface DropdownContextType {
  isOpen: boolean;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  close: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  itemRefs: React.RefObject<(HTMLLIElement | null)[]>;
  items: DropdownItemType[];
  onSelect: (item: DropdownItemType) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleClick: (e: React.MouseEvent) => void;
  focusTrigger: () => void;
  focusItem: (index: number) => void;
}
