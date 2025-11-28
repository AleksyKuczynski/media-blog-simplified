// src/main/components/Navigation/useFilterGroup.ts
// FIXED: Type-safe, follows React hooks rules, uses dictionary entries

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Category } from '@/main/lib/directus/directusInterfaces';
import { Dictionary, Lang } from '@/main/lib/dictionary';
import {
  generateFilterStateData,
  generateFilterUrls,
  validateFilterDictionary,
  getFilterLabels,
  getSortingOptions,
} from '@/main/lib/dictionary/helpers/filter';
import type { DropdownItemType } from '../../ui/Dropdown/types';

// ===================================================================
// TYPES - Simplified and clean, FIXED TYPES
// ===================================================================

interface UseFilterGroupProps {
  readonly categories: Category[];
  readonly dictionary: Dictionary;
  readonly lang: Lang;
}

interface UseFilterGroupReturn {
  // Current state
  currentCategory: string;
  currentSort: string;
  isArticlesPath: boolean;
  categoryItems: DropdownItemType[];
  filterLabels: ReturnType<typeof getFilterLabels>;
  sortingOptions: ReturnType<typeof getSortingOptions>;
  selectedCategoryName: string; // FIXED: always string, never undefined
  // Actions
  handleCategoryChange: (item: DropdownItemType) => void;
  handleReset: () => void;
}

// ===================================================================
// MAIN USEFILTERGROUP HOOK - FIXED
// ===================================================================

export function useFilterGroup({ 
  categories, 
  dictionary,
  lang
}: UseFilterGroupProps): UseFilterGroupReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Validate dictionary structure
  const isDictionaryValid = useMemo(() => 
    validateFilterDictionary(dictionary), 
    [dictionary]
  );

  // Generate all filter state using existing helper - NO DUPLICATION
  const filterState = useMemo(() => {
    if (!isDictionaryValid) {
      console.warn('useFilterGroup: Dictionary validation failed, using fallbacks');
    }
    
    try {
      return generateFilterStateData(dictionary, categories, pathname, searchParams);
    } catch (error) {
      console.error('useFilterGroup: Error generating filter state', error);
      
      // FIXED: Fallback with proper types
      const filterLabels = getFilterLabels(dictionary);
      return {
        currentCategory: '',
        currentSort: 'desc',
        isArticlesPath: pathname.endsWith('/articles'),
        filterLabels,
        sortingOptions: getSortingOptions(dictionary),
        categoryItems: [{
          id: 'all',
          label: filterLabels.allCategories,
          value: '',
          selected: true,
        }],
        selectedCategoryName: filterLabels.allCategories, // FIXED: always string
      };
    }
  }, [dictionary, categories, pathname, searchParams, isDictionaryValid]);

  // Extract values from filter state for easy access
  const {
    currentCategory,
    currentSort,
    isArticlesPath,
    filterLabels,
    sortingOptions,
    categoryItems,
    selectedCategoryName,
  } = filterState;

  // Handle category change using existing helper
  const handleCategoryChange = useCallback((item: DropdownItemType) => {
    try {
      const baseUrl = dictionary.seo.site.url;
      const newUrl = generateFilterUrls(baseUrl, item.value, currentSort);
      
      // Convert absolute URL to relative path for router
      const relativePath = newUrl.replace(baseUrl, '').replace(`/${lang}`, '');
      router.push(`/${lang}${relativePath}`);
      
    } catch (error) {
      console.error('useFilterGroup: Error handling category change', error);
      
      // Fallback navigation
      if (item.value) {
        router.push(`/${lang}/category/${item.value}?sort=${currentSort}`);
      } else {
        router.push(`/${lang}/articles?sort=${currentSort}`);
      }
    }
  }, [router, currentSort, dictionary.seo?.site?.url]);

  // Handle reset using existing patterns - NO DUPLICATION
  const handleReset = useCallback(() => {
    try {
      if (isArticlesPath && !currentCategory && currentSort === 'desc') {
        // Already at default state, no action needed
        return;
      }
      
      // Reset to default articles page
      router.push(`/${lang}/articles`);
      
    } catch (error) {
      console.error('useFilterGroup: Error handling reset', error);
      // Fallback reset
      router.push(`/${lang}/articles`);
    }
  }, [router, isArticlesPath, currentCategory, currentSort]);

  return {
    // Current state
    currentCategory,
    currentSort,
    isArticlesPath,
    
    // UI data
    categoryItems,
    filterLabels,
    sortingOptions,
    selectedCategoryName,
    
    // Actions
    handleCategoryChange,
    handleReset,
  };
}

// ===================================================================
// UTILITY HOOKS - Additional filter-related hooks, FIXED
// ===================================================================

/**
 * useFilterValidation - Hook for validating filter state
 * Uses existing validation patterns
 */
export function useFilterValidation(dictionary: Dictionary, categories: Category[]) {
  return useMemo(() => {
    const issues: string[] = [];
    
    if (!validateFilterDictionary(dictionary)) {
      issues.push('Filter dictionary validation failed');
    }
    
    if (!Array.isArray(categories)) {
      issues.push('Categories must be an array');
    }
    
    if (categories.length === 0) {
      issues.push('No categories provided');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
    };
  }, [dictionary, categories]);
}

/**
 * useFilterUrls - Hook for generating filter-related URLs
 * Uses existing URL generation helpers
 */
export function useFilterUrls(dictionary: Dictionary) {
  const baseUrl = dictionary.seo.site.url;
  
  return useMemo(() => ({
    generateCategoryUrl: (categorySlug: string, sort: string = 'desc') =>
      generateFilterUrls(baseUrl, categorySlug, sort),
    
    generateArticlesUrl: (sort: string = 'desc') =>
      generateFilterUrls(baseUrl, '', sort),
    
    baseUrl,
  }), [baseUrl]);
}