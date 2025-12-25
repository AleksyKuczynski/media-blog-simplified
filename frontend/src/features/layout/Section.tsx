// src/features/layout/Section.tsx
import { cn } from '@/lib/utils';
import { SECTION_STYLES } from './styles';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  isOdd?: boolean;
  title?: string;
  titleLevel?: 'h1' | 'h2';
  hasNextSectionTitle?: boolean;
  ariaLabel?: string;
  id?: string;
  as?: 'section' | 'article' | 'aside' | 'nav' | 'div';
  role?: string;
  itemScope?: boolean;
  itemType?: string;
}

export default function Section({ 
  children, 
  className = '', 
  isOdd = false,
  title,
  titleLevel = 'h2',
  hasNextSectionTitle = false,
  ariaLabel,
  id,
  as: Component = 'section',
  role,
  itemScope,
  itemType,
  ...props 
}: SectionProps) {
  const sectionClasses = cn(
    SECTION_STYLES.wrapper.base,
    isOdd ? SECTION_STYLES.wrapper.odd : SECTION_STYLES.wrapper.even,
    hasNextSectionTitle && SECTION_STYLES.wrapper.withNextTitle,
    className
  );

  const headerWrapperClasses = cn(
    SECTION_STYLES.header.wrapper.base,
    isOdd ? SECTION_STYLES.header.wrapper.odd : SECTION_STYLES.header.wrapper.even
  );

  const titleClasses = cn(
    SECTION_STYLES.header.title.base,
    isOdd ? SECTION_STYLES.header.title.odd : SECTION_STYLES.header.title.even
  );

  const sectionProps = {
    className: sectionClasses,
    ...(ariaLabel && { 'aria-label': ariaLabel }),
    ...(id && { id }),
    ...(role && { role }),
    ...(itemScope && { itemScope: true }),
    ...(itemType && { itemType }),
    ...props
  };

  const TitleTag = titleLevel;

  return (
    <Component {...sectionProps}>
      <div className={SECTION_STYLES.container}>
        {title && (
          <header className={headerWrapperClasses}>
            <TitleTag className={titleClasses}>
              {title}
            </TitleTag>
          </header>
        )}
        {children}
      </div>
    </Component>
  );
}