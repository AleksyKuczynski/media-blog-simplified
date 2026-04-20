// src/features/layout/Section.tsx
import { cn } from '@/lib/utils';
import { SECTION_STYLES } from './layout.styles';

type SectionVariant = 'primary' | 'secondary' | 'tertiary' | 'default';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: SectionVariant;
  title?: string;
  shortTitle?: string;
  titleLevel?: 'h1' | 'h2';
  ariaLabel?: string;
  id?: string;
  as?: 'section' | 'article' | 'aside' | 'nav' | 'div';
  role?: string;
  itemScope?: boolean;
  itemType?: string;
  hasNextSectionTitle?: boolean;
  flexGrow?: boolean;
}

export default function Section({
  children,
  className = '',
  variant = 'default',
  title,
  shortTitle,
  titleLevel = 'h2',
  ariaLabel,
  id,
  as: Component = 'section',
  role,
  itemScope,
  itemType,
  hasNextSectionTitle = false,
  flexGrow = false,
  ...props 
}: SectionProps) {
  const sectionClasses = cn(
    SECTION_STYLES.wrapper.base,
    SECTION_STYLES.wrapper[variant],
    hasNextSectionTitle && SECTION_STYLES.wrapper.withNextTitle,
    flexGrow && SECTION_STYLES.wrapper.flexGrow,
    className
  );

  const containerClasses = cn(
    SECTION_STYLES.container.base,
    title && SECTION_STYLES.container.withTitle,
    flexGrow && SECTION_STYLES.container.flexGrow
  );

  const titleClasses = cn(
    SECTION_STYLES.header.title.base,
    SECTION_STYLES.header.title[variant]
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
      <div className={containerClasses}>
        {title && (
          <header className={SECTION_STYLES.header.wrapper}>
            {shortTitle && (
              <TitleTag className={cn(titleClasses, 'sm:hidden')}>
                {shortTitle}
              </TitleTag>
            )}
            <TitleTag className={cn(titleClasses, shortTitle && 'hidden sm:block')}>
              {title}
            </TitleTag>
          </header>
        )}
        {children}
      </div>
    </Component>
  );
}