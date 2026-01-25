// features/navigation/Header/NavigationSkeleton.tsx

import { HEADER_STYLES, DESKTOP_NAV_STYLES, MOBILE_NAV_STYLES } from '../navigation.styles';

export function NavigationSkeleton() {
  return (
    <header className={HEADER_STYLES.wrapper} role="status" aria-label="Loading navigation...">
      {/* Desktop Navigation Skeleton */}
      <div className={DESKTOP_NAV_STYLES.container}>
        <div className={DESKTOP_NAV_STYLES.grid}>
          {/* Left section - Logo skeleton */}
          <div className={DESKTOP_NAV_STYLES.leftSection}>
            <div className="h-12 w-32 bg-sf-hst rounded-lg animate-pulse" />
          </div>

          {/* Center section - Navigation links skeleton */}
          <div className={DESKTOP_NAV_STYLES.centerSection}>
            <div className={DESKTOP_NAV_STYLES.navList}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-24 bg-sf-hst rounded-full animate-pulse" />
              ))}
            </div>
          </div>

          {/* Right section - Search and language switcher skeleton */}
          <div className={DESKTOP_NAV_STYLES.rightSection}>
            <div className="h-10 w-10 bg-sf-hst rounded-full animate-pulse" />
            <div className="h-10 w-16 bg-sf-hst rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Skeleton */}
      <div className={MOBILE_NAV_STYLES.container}>
        <div className={MOBILE_NAV_STYLES.topBar}>
          {/* Left section - Hamburger button skeleton */}
          <div className={MOBILE_NAV_STYLES.leftSection}>
            <div className="h-12 w-12 bg-sf-hst rounded-full animate-pulse" />
          </div>

          {/* Center section - Logo skeleton */}
          <div className={MOBILE_NAV_STYLES.centerSection}>
            <div className="h-10 w-24 bg-sf-hst rounded-lg animate-pulse" />
          </div>

          {/* Right section - Search and language switcher skeleton */}
          <div className={MOBILE_NAV_STYLES.rightSection}>
            <div className="h-10 w-10 bg-sf-hst rounded-full animate-pulse" />
            <div className="h-10 w-12 bg-sf-hst rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <span className="sr-only">Loading navigation...</span>
    </header>
  );
}