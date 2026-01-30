// features/layout/FooterSkeleton.tsx

import { FOOTER_STYLES } from './layout.styles';

export function FooterSkeleton({ ariaLabel }: { ariaLabel: string }) {
  return (
    <footer 
      className={FOOTER_STYLES.container}
      role="status"
      aria-label={ariaLabel}
    >
      <div className={FOOTER_STYLES.innerContainer}>
        <div className={FOOTER_STYLES.grid}>
          
          {/* Logo + Contact Button skeleton */}
          <section className={FOOTER_STYLES.logoSection}>
            <div className={FOOTER_STYLES.contact.logoWrapper}>
              <div className="h-12 w-48 bg-sf-hst rounded animate-pulse mx-auto" />
            </div>
            <div className="h-10 w-40 bg-sf-hst rounded-lg animate-pulse mx-auto" />
          </section>

          {/* Social Links skeleton */}
          <section className={FOOTER_STYLES.socialSection}>
            <div className="h-6 w-32 bg-sf-hst rounded animate-pulse mb-4" />
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 bg-sf-hst rounded-full animate-pulse" />
              ))}
            </div>
          </section>

          {/* About skeleton */}
          <section className={FOOTER_STYLES.aboutSection}>
            <div className="h-6 w-24 bg-sf-hst rounded animate-pulse mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-sf-hst rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-sf-hst rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-sf-hst rounded animate-pulse" />
            </div>
          </section>

          {/* Legal skeleton */}
          <section className={FOOTER_STYLES.legalSection}>
            <div className="h-6 w-20 bg-sf-hst rounded animate-pulse mb-4" />
            <div className={FOOTER_STYLES.nav.wrapper}>
              <div className="h-4 w-28 bg-sf-hst rounded animate-pulse" />
              <div className="h-4 w-36 bg-sf-hst rounded animate-pulse" />
              <div className="h-4 w-24 bg-sf-hst rounded animate-pulse" />
            </div>
          </section>

          {/* Quick Links skeleton */}
          <section className={FOOTER_STYLES.quickLinksSection}>
            <div className="h-6 w-28 bg-sf-hst rounded animate-pulse mb-4" />
            <div className={FOOTER_STYLES.nav.wrapper}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-32 bg-sf-hst rounded animate-pulse" />
              ))}
            </div>
          </section>
        </div>

        {/* Copyright skeleton */}
        <div className={FOOTER_STYLES.copyright.wrapper}>
          <div className="h-4 w-64 mx-auto bg-sf-hst rounded animate-pulse" />
        </div>
      </div>

      <span className="sr-only">{ariaLabel}</span>
    </footer>
  );
}