// features/navigation/QuickNav/QuickNavigationSkeleton.tsx

import { SectionSkeleton } from '@/features/layout/SectionSkeleton';
import { QUICK_NAV_STYLES } from '../navigation.styles';

export function QuickNavigationSkeleton({ ariaLabel }: { ariaLabel: string }) {
  return (
    <SectionSkeleton 
      variant="default"
      hasTitle={true}
      ariaLabel={ariaLabel}
    >
      <nav className={QUICK_NAV_STYLES.nav} aria-label={ariaLabel}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="inline-flex flex-col items-center gap-2 px-4 md:px-8 py-2 md:py-4">
            {/* Icon skeleton */}
            <div className={`${QUICK_NAV_STYLES.icon} bg-sf-hst rounded-lg animate-pulse`} />
            {/* Label skeleton */}
            <div className="h-4 w-20 md:w-24 bg-sf-hst rounded animate-pulse" />
          </div>
        ))}
      </nav>
    </SectionSkeleton>
  );
}