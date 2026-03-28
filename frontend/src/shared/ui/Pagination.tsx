// src/shared/ui/Pagination.tsx

'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Dictionary } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { cn } from '@/lib/utils';

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly dictionary: Dictionary;
  readonly className?: string;
}

const PAGINATION_STYLES = {
  nav: 'flex justify-center items-center xl:pb-6',
  list: 'flex gap-3 max-xl:text-sm ',
  base: cn(
    'min-w-8 px-3 py-1.5 rounded-full transition-all duration-200 ',
    'xl:min-w-[40px] xl:px-3 xl:py-2 xl:rounded-full xl:transition-all xl:duration-200'
  ),
  page: 'bg-sf hover:bg-sf-hi text-pr-cont cursor-pointer',
  active: 'bg-prcolor text-on-sf-dim font-semibold cursor-default',
  arrow: cn(
    'px-4 py-2', 
    'transition-all duration-200', 
    'disabled:text-on-sf-dim disabled:cursor-not-allowed', 
    'enabled:text-pr-cont enabled:cursor-pointer'
  ),
  ellipsis: 'px-3 py-2 text-on-sf-var',
}

export default function Pagination({ 
  currentPage, 
  totalPages,
  dictionary, 
  className = ''
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const styles = PAGINATION_STYLES;

  if (totalPages <= 1) return null;

  const navigateToPage = (page: number) => { 
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    
    const newUrl = params.toString() 
      ? `${pathname}?${params.toString()}` 
      : pathname;
    
    router.push(newUrl, { scroll: false });
  };

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const MAX_VISIBLE = 7;
    
    if (totalPages <= MAX_VISIBLE) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
      return pages;
    }
    
    if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    pages.push(1);
    pages.push('ellipsis');
    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);
    pages.push('ellipsis');
    pages.push(totalPages);
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <nav 
      className={`${styles.nav} ${className}`}
      aria-label={dictionary.navigation.accessibility.paginationNavigation}
      role="navigation"
    >
      <button
        type="button"
        onClick={() => !isPreviousDisabled && navigateToPage(currentPage - 1)}
        disabled={isPreviousDisabled}
        className={styles.arrow}
      >
        <span className="sr-only">{dictionary.common.pagination.previous}</span>
        <span aria-hidden="true">◀</span>
      </button>

      <div className={styles.list} role="list">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === 'ellipsis') {
            return (
              <span 
                key={`ellipsis-${index}`} 
                className={styles.ellipsis}
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const isCurrentPage = pageNum === currentPage;
          
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => navigateToPage(pageNum)}
              disabled={isCurrentPage}
              className={
                isCurrentPage
                  ? `${styles.base} ${styles.active}`
                  : `${styles.base} ${styles.page}`
              }
              aria-label={
                isCurrentPage
                  ? processTemplate(dictionary.common.pagination.currentPage, { page: pageNum.toString() })
                  : processTemplate(dictionary.common.pagination.goToPage, { page: pageNum.toString() })
              }
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => !isNextDisabled && navigateToPage(currentPage + 1)}
        disabled={isNextDisabled}
        className={styles.arrow}
        aria-label={dictionary.common.pagination.next}
      >
        <span className="sr-only">{dictionary.common.pagination.next}</span>
        <span aria-hidden="true">▶</span>
      </button>

      <div className="sr-only" role="status" aria-live="polite">
        {processTemplate(dictionary.navigation.accessibility.pageNavigation, {
          current: currentPage.toString(),
          total: totalPages.toString()
        })}
      </div>
    </nav>
  );
}