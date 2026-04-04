// src/shared/ui/Dropdown/DropdownContent.tsx
'use client';

import { DROPDOWN_STYLES } from './styles';
import { useDropdownContext } from './useDropdown';

interface DropdownContentProps {
  children: React.ReactNode;
}

export default function DropdownContent({ children }: DropdownContentProps) {
  const { isOpen } = useDropdownContext();

  const className = `
    ${DROPDOWN_STYLES.content.base}
    ${isOpen ? DROPDOWN_STYLES.content.open : DROPDOWN_STYLES.content.closed}
  `.trim();

  return (
    <div 
      className={`${className} dropdown-scroll`}
      role="menu"
      aria-orientation="vertical"
      style={{ 
        maxHeight: 'calc(var(--vh, 1vh) * 80)',
        top: 'calc(100% + 0.5rem)'
      }}
    >
      <ul role="menu">{children}</ul>
    </div>
  );
}