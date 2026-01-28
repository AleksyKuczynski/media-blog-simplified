// app/[lang]/(articles)/[rubric]/[slug]/_components/ArticlePageSkeleton.tsx

import { Dictionary } from '@/config/i18n';
import { LAYOUT_STYLES } from './article.styles';
import { BREADCRUMB_STYLES, SMART_BREADCRUMB_STYLES } from '@/features/navigation/Breadcrumbs/breadcrumbs.styles';
import { IMAGE_RATIO_STRING } from '@/features/mainConstants';
import { cn } from '@/lib/utils';

interface ArticlePageSkeletonProps {
  dictionary: Dictionary;
}

export function ArticlePageSkeleton({ dictionary }: ArticlePageSkeletonProps) {
  return (
    <div 
      className={LAYOUT_STYLES.articleContainer}
      role="status"
      aria-label={dictionary.common.status.loading}
    >
      {/* Breadcrumbs Skeleton */}
      <nav 
        className={BREADCRUMB_STYLES.nav.container}
        aria-label="Loading breadcrumbs..."
      >
        <ol className={BREADCRUMB_STYLES.list.base}>
          {/* Home breadcrumb */}
          <li className={SMART_BREADCRUMB_STYLES.item.home}>
            <div className="h-4 w-16 bg-pr-cont/30 rounded animate-pulse" />
          </li>
          
          {/* Separator */}
          <li className={BREADCRUMB_STYLES.separator.container}>
            <div className="w-3 h-3 bg-pr-cont/30 rounded animate-pulse" />
          </li>
          
          {/* Context breadcrumb */}
          <li className={SMART_BREADCRUMB_STYLES.item.context}>
            <div className="h-4 w-20 bg-pr-cont/30 rounded animate-pulse" />
          </li>
          
          {/* Separator */}
          <li className={BREADCRUMB_STYLES.separator.container}>
            <div className="w-3 h-3 bg-pr-cont/30 rounded animate-pulse" />
          </li>
          
          {/* Parent breadcrumb */}
          <li className={SMART_BREADCRUMB_STYLES.item.parent}>
            <div className="h-4 w-32 bg-pr-cont/30 rounded animate-pulse" />
          </li>
          
          {/* Separator */}
          <li className={BREADCRUMB_STYLES.separator.container}>
            <div className="w-3 h-3 bg-pr-cont/30 rounded animate-pulse" />
          </li>
          
          {/* Article title breadcrumb */}
          <li className={SMART_BREADCRUMB_STYLES.item.article}>
            <div className="h-4 w-40 bg-on-sf-var/50 rounded animate-pulse" />
          </li>
        </ol>
      </nav>

      {/* Header Skeleton */}
      <header className={LAYOUT_STYLES.header.container}>
        {/* Mobile date skeleton - order-1 */}
        <div className={LAYOUT_STYLES.header.mobileDateText}>
          <div className="h-4 w-32 bg-on-sf-var/50 rounded animate-pulse" />
        </div>

        {/* Image skeleton - order-3 on mobile, order-1 on desktop */}
        <div className={LAYOUT_STYLES.header.imageWrapper}>
          <div className={cn(LAYOUT_STYLES.header.imageContainer, IMAGE_RATIO_STRING)}>
            <div className="w-full h-full bg-sf-hst rounded-3xl animate-pulse" />
          </div>
        </div>

        {/* Right column - order-2 */}
        <div className={LAYOUT_STYLES.header.rightColumn}>
          {/* Title skeleton */}
          <div className="space-y-4 mb-4 md:mb-0 flex-grow">
            <div className={cn(LAYOUT_STYLES.header.title, 'h-9 bg-on-sf/80 rounded animate-pulse w-full')} />
            <div className={cn(LAYOUT_STYLES.header.title, 'h-9 bg-on-sf/80 rounded animate-pulse w-5/6')} />
            <div className={cn(LAYOUT_STYLES.header.title, 'h-9 bg-on-sf/80 rounded animate-pulse w-4/6')} />
          </div>

          {/* Metadata box skeleton - hidden on mobile, visible on desktop */}
          <div className={LAYOUT_STYLES.header.metadataBox}>
            {/* Date skeleton */}
            <div className="mb-4">
              <div className="h-4 w-40 bg-on-sf-var/50 rounded animate-pulse" />
            </div>
            
            {/* Authors skeleton */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-sf-hst rounded-full animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-on-sf-var/50 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-on-sf-var/30 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead skeleton - order-4, full width */}
        <div className={LAYOUT_STYLES.header.lead}>
          <div className="space-y-3">
            <div className="h-7 bg-on-sf/60 rounded animate-pulse w-full" />
            <div className="h-7 bg-on-sf/60 rounded animate-pulse w-11/12" />
            <div className="h-7 bg-on-sf/60 rounded animate-pulse w-5/6" />
          </div>
        </div>
      </header>

      <span className="sr-only">{dictionary.common.status.loading}</span>
    </div>
  );
}