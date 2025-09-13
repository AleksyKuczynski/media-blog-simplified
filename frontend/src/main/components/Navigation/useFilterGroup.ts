// src/main/components/Navigation/useFilterGroup.ts
// MIGRATED: Uses new dictionary system and types
import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Category } from '@/main/lib/directus/directusInterfaces';
import { Lang, CategoryTranslations } from '@/main/lib/dictionary/types'; // MIGRATED: New dictionary types
import type { DropdownItemType } from '../Interface/Dropdown/types';

interface UseFilterGroupProps {
  readonly categories: Category[];
  readonly categoryTranslations: CategoryTranslations; // MIGRATED: Uses new CategoryTranslations
  readonly lang: Lang; // MIGRATED: Uses new Lang type
}

/**
 * useFilterGroup - MIGRATED to new dictionary system
 * Now uses CategoryTranslations from new dictionary structure
 */
export function useFilterGroup({ 
  categories, 
  categoryTranslations,
  lang
}: UseFilterGroupProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Computed states
  const isArticlesPath = useMemo(() => 
    pathname.endsWith('/articles')
  , [pathname]);

  const currentCategory = useMemo(() => {
    const categorySlug = pathname.split('/').pop();
    return categories.some(cat => cat.slug === categorySlug) ? categorySlug : '';
  }, [pathname, categories]);

  const currentSort = useMemo(() => 
    searchParams.get('sort') || 'desc'
  , [searchParams]);

  // MIGRATED: Prepare dropdown items using new dictionary structure
  const categoryItems = useMemo<DropdownItemType[]>(() => [
    { 
      id: 'all',
      label: categoryTranslations.allCategories, // MIGRATED: Still works with new structure
      value: '',
      selected: currentCategory === ''
    },
    ...categories.map(category => ({
      id: category.slug,
      label: category.name,
      value: category.slug,
      selected: category.slug === currentCategory
    }))
  ], [categories, categoryTranslations.allCategories, currentCategory]);

  // Handlers - functionality unchanged
  const handleCategoryChange = useCallback((item: DropdownItemType) => {
    const currentSort = searchParams.get('sort') || 'desc';
    const params = new URLSearchParams();
    params.set('sort', currentSort); // Preserve current sort order

    if (item.value) {
      router.push(`/ru/category/${item.value}?${params.toString()}`);
    } else {
      router.push(`/ru/articles?${params.toString()}`);
    }
  }, [router, searchParams]);

  const handleReset = useCallback(() => {
    if (isArticlesPath) {
      if (currentCategory || currentSort !== 'desc') {
        router.push(`/ru/articles`);
      }
    } else {
      router.push(`/ru/articles`);
    }
  }, [router, isArticlesPath, currentCategory, currentSort]);

  return {
    // States
    currentCategory,
    currentSort,
    isArticlesPath,
    // Prepared data
    categoryItems,
    // Action handlers
    handleCategoryChange,
    handleReset,
  };
}