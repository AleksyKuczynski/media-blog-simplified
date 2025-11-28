// src/main/components/Main/Pagination.tsx
// FIXED: Proper 7-slot pagination algorithm

'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Dictionary } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly dictionary: Dictionary;
  readonly className?: string;
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
    
    router.push(newUrl);
  };

  /**
   * Generate 7-slot pagination: 1, ..., i-1, i, i+1, ..., z
   * - If totalPages <= 7: show all
   * - If currentPage in first 4: [1,2,3,4,5, ..., last]
   * - If currentPage in last 4: [1, ..., last-4, last-3, last-2, last-1, last]
   * - Otherwise: [1, ..., current-1, current, current+1, ..., last]
   */
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const MAX_VISIBLE = 7;
    
    // Show all if <= 7 pages
    if (totalPages <= MAX_VISIBLE) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Current page in first 4: [1,2,3,4,5, ..., last]
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
      return pages;
    }
    
    // Current page in last 4: [1, ..., last-4, last-3, last-2, last-1, last]
    if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Current page in middle: [1, ..., current-1, current, current+1, ..., last]
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
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav 
      className={`flex justify-center items-center gap-2 ${className}`}
      aria-label={dictionary.navigation.accessibility.paginationNavigation}
      role="navigation"
    >
      {/* Previous button */}
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={!hasPrevious}
        className={`
          px-4 py-2 rounded-lg transition-all duration-200
          ${hasPrevious 
            ? 'bg-sf hover:bg-sf-hi text-on-sf cursor-pointer' 
            : 'bg-sf-var text-on-sf-var cursor-not-allowed opacity-50'
          }
        `}
        aria-label={dictionary.common.pagination.previous}
        aria-disabled={!hasPrevious}
      >
        <span className="sr-only">{dictionary.common.pagination.previous}</span>
        <span aria-hidden="true">←</span>
      </button>

      {/* Page numbers */}
      <div className="flex gap-1" role="list">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === 'ellipsis') {
            return (
              <span 
                key={`ellipsis-${index}`} 
                className="px-3 py-2 text-on-sf-var"
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
              onClick={() => navigateToPage(pageNum)}
              disabled={isCurrentPage}
              className={`
                min-w-[40px] px-3 py-2 rounded-lg transition-all duration-200
                ${isCurrentPage
                  ? 'bg-prcolor text-on-prcolor font-semibold cursor-default'
                  : 'bg-sf hover:bg-sf-hi text-on-sf cursor-pointer'
                }
              `}
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

      {/* Next button */}
      <button
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={!hasNext}
        className={`
          px-4 py-2 rounded-lg transition-all duration-200
          ${hasNext 
            ? 'bg-sf hover:bg-sf-hi text-on-sf cursor-pointer' 
            : 'bg-sf-var text-on-sf-var cursor-not-allowed opacity-50'
          }
        `}
        aria-label={dictionary.common.pagination.next}
        aria-disabled={!hasNext}
      >
        <span className="sr-only">{dictionary.common.pagination.next}</span>
        <span aria-hidden="true">→</span>
      </button>

      {/* Screen reader page info */}
      <div className="sr-only" role="status" aria-live="polite">
        {processTemplate(dictionary.navigation.accessibility.pageNavigation, {
          current: currentPage.toString(),
          total: totalPages.toString()
        })}
      </div>
    </nav>
  );
}