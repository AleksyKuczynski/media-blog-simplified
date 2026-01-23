// src/features/layout/SectionSkeleton.tsx

import { cn } from '@/lib/utils';
import { SECTION_STYLES } from './styles';

type SectionVariant = 'primary' | 'secondary' | 'tertiary' | 'default';

interface SectionSkeletonProps {
  children: React.ReactNode;
  variant?: SectionVariant;
  hasTitle?: boolean;
  hasNextSectionTitle?: boolean;
  flexGrow?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function SectionSkeleton({ 
  children,
  variant = 'default',
  hasTitle = true,
  hasNextSectionTitle = false,
  flexGrow = false,
  className = '',
  ariaLabel = 'Loading section...'
}: SectionSkeletonProps) {
  const sectionClasses = cn(
    SECTION_STYLES.wrapper.base,
    SECTION_STYLES.wrapper[variant],
    hasNextSectionTitle && SECTION_STYLES.wrapper.withNextTitle,
    flexGrow && SECTION_STYLES.wrapper.flexGrow,
    className
  );

  const containerClasses = cn(
    SECTION_STYLES.container.base,
    hasTitle && SECTION_STYLES.container.withTitle,
    flexGrow && SECTION_STYLES.container.flexGrow
  );

  const titleClasses = cn(
    SECTION_STYLES.header.title.base,
    SECTION_STYLES.header.title[variant]
  );

  // Get background color for skeleton based on variant
  const getSkeletonBg = () => {
    switch (variant) {
      case 'primary':
        return 'bg-pr-sf/30';
      case 'secondary':
        return 'bg-sec-sf/30';
      case 'tertiary':
        return 'bg-tr-sf/30';
      default:
        return 'bg-sf-hst';
    }
  };

  return (
    <section 
      className={sectionClasses}
      role="status"
      aria-label={ariaLabel}
    >
      <div className={containerClasses}>
        {hasTitle && (
          <header className={SECTION_STYLES.header.wrapper}>
            <div className={cn(titleClasses, 'flex justify-center')}>
              <div className={cn('h-12 w-64 rounded-lg animate-pulse', getSkeletonBg())} />
            </div>
          </header>
        )}
        {children}
      </div>
      <span className="sr-only">{ariaLabel}</span>
    </section>
  );
}