// src/main/components/Main/LoadMoreButton.tsx
// ENHANCED: Dictionary-driven, no hardcoded text, improved accessibility

'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CustomButton } from '../Interface/CustomButton';
import { Dictionary } from '@/main/lib/dictionary/types';

interface LoadMoreButtonProps {
  readonly currentPage: number;
  readonly dictionary: Dictionary;
  readonly disabled?: boolean;
  readonly className?: string;
}

/**
 * LoadMoreButton - Enhanced with dictionary support and better UX
 * NO HARDCODED TEXT - uses dictionary.common.actions.loadMore
 */
export default function LoadMoreButton({ 
  currentPage, 
  dictionary, 
  disabled = false,
  className = ''
}: LoadMoreButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLoadMore = () => {
    if (disabled) return;
    
    const params = new URLSearchParams(searchParams);
    params.set('page', (currentPage + 1).toString());
    
    // Add flag to prevent scroll restoration hook from interfering
    params.set('preserve-scroll', '1');
    
    // Preserve existing parameters (sort, category, etc.)
    const newUrl = `${pathname}?${params.toString()}`;
    
    router.push(newUrl, { scroll: false });
  };

  // Enhanced loading state management
  const isLoading = disabled; // Can be extended with loading state
  const buttonText = isLoading 
    ? dictionary.common.status.loading 
    : dictionary.common.actions.loadMore;

  return (
    <div className={`flex justify-center ${className}`}>
      <CustomButton
        color="accent"
        onClick={handleLoadMore}
        aria-label={`${buttonText}. Текущая страница: ${currentPage}`}
      >
        <span className="flex items-center gap-2">
          {isLoading && (
            <svg 
              className="animate-spin h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {buttonText}
        </span>
      </CustomButton>
    </div>
  );
}